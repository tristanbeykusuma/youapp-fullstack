/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { chatAPI } from '@/lib/api';
import { Send, MoreHorizontal } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  readStatus: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  participants: Array<{ id: string; username: string; email: string }>;
  lastMessage?: { content: string; senderId: string; timestamp: Date };
  updatedAt: Date;
}

interface User {
  id: string;
  username: string;
  email: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const response = await chatAPI.getConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      const apiError = error as { response?: { data?: { message?: string } } };
      console.error('Error response:', apiError.response?.data);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await chatAPI.viewMessages(conversationId);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      const apiError = error as { response?: { data?: { message?: string } } };
      console.error('Error response:', apiError.response?.data);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      socketInstance.emit('register', { userId: user.id });
    });

    socketInstance.on('registered', (data: { userId: string }) => {
      console.log('✅ Registered:', data);
    });

    socketInstance.on('newMessage', (data: {
      senderId: string;
      content: string;
      conversationId: string;
      timestamp: Date
    }) => {
      console.log('📩 New message received:', data);
      
      // Add message to current conversation if it matches
      const currentConversation = selectedConversationRef.current;
      if (currentConversation && currentConversation.id === data.conversationId) {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          senderId: data.senderId,
          receiverId: user.id,
          content: data.content,
          readStatus: false,
          timestamp: new Date(data.timestamp),
        }]);
      }
      
      // Refresh conversations
      loadConversations();
    });

    socketInstance.on('messageSent', (data: { success: boolean; timestamp: Date }) => {
      console.log('✅ Message sent confirmation:', data);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    setSocket(socketInstance);
    loadConversations();

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Keep ref in sync with selectedConversation state
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation, loadMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      inputRef.current?.focus();
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation || !user?.id) {
      console.log('❌ Missing data:', { 
        hasInput: !!messageInput.trim(), 
        hasConversation: !!selectedConversation, 
        hasUser: !!user?.id 
      });
      return;
    }
    
    const otherUser = getOtherUser(selectedConversation);
    if (!otherUser?.id) {
      console.error('❌ No receiver found in conversation');
      alert('Cannot find receiver. Please try selecting the conversation again.');
      return;
    }

    console.log('📤 Sending message:', {
      from: user.id,
      to: otherUser.id,
      content: messageInput.trim()
    });

    setSending(true);
    const messageContent = messageInput.trim();
    const tempId = Date.now().toString();

    try {
      // Optimistically add message to UI
      const tempMessage: Message = {
        id: tempId,
        senderId: user.id,
        receiverId: otherUser.id,
        content: messageContent,
        readStatus: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, tempMessage]);
      setMessageInput('');

      // 1. Send via REST API (saves to database)
      console.log('🔄 Calling chatAPI.sendMessage...');
      const response = await chatAPI.sendMessage({
        receiverId: otherUser.id, // Make sure this is the MongoDB ID
        content: messageContent,
      });

      console.log('✅ Message saved to database:', response);

      // 2. Send via Socket.io (real-time delivery)
      if (socket?.connected) {
        console.log('📡 Emitting via socket...');
        socket.emit('sendMessage', {
          senderId: user.id,
          receiverId: otherUser.id,
          content: messageContent,
          conversationId: response.data.conversationId,
        });
      } else {
        console.warn('⚠️ Socket not connected, message saved but not sent in real-time');
      }

      // Reload conversations and messages to get accurate data
      await loadConversations();
      if (response.data.conversationId) {
        await loadMessages(response.data.conversationId);
      }

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      const apiError = error as { response?: { data?: { message?: string } } };
      console.error('Error details:', apiError.response?.data);
      
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(m => m.id !== tempId));
      setMessageInput(messageContent); // Restore message
      
      const errorMsg = apiError.response?.data?.message || 'Failed to send message';
      alert(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conversation: Conversation): User | undefined => {
    return conversation.participants.find((p) => p.id !== user?.id);
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-app-radial flex">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border-card bg-surface-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border-card">
          <div className="flex justify-between items-center">
            <h2 className="text-white font-semibold text-lg">Messages</h2>
            <button
              onClick={() => router.push('/profile')}
              className="text-white/60 hover:text-white text-sm"
            >
              Profile
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-white/60 mb-2">No conversations yet</p>
              <p className="text-white/40 text-sm">
                Send a message to someone to start chatting
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {conversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                if (!otherUser) return null;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-input flex items-center justify-center flex-shrink-0">
                        <span className="text-white/60 text-lg">
                          {otherUser.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {otherUser.username}
                        </p>
                        <p className="text-white/60 text-xs truncate">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {conversation.lastMessage && (
                        <span className="text-white/40 text-xs whitespace-nowrap">
                          {formatTime(conversation.updatedAt)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Socket Status */}
        <div className="p-3 border-t border-border-card">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white/60">
              {socket?.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border-card bg-surface-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-input flex items-center justify-center">
                    <span className="text-white/60 text-lg">
                      {getOtherUser(selectedConversation)?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {getOtherUser(selectedConversation)?.username}
                    </h3>
                    <p className="text-white/60 text-sm">Online</p>
                  </div>
                </div>
                <button className="text-white/60 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/60">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-surface-input text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border-card bg-surface-card">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-input text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !messageInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span>
                      Sending...
                    </span>
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/60 text-lg mb-2">Select a conversation</p>
              <p className="text-white/40">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}