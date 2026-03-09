'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profileStore';
import { profileAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { ChevronLeft, Plus } from 'lucide-react';

export default function InterestsPage() {
  const router = useRouter();
  const { profile, setProfile } = useProfileStore();

  const [interests, setInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile if not already loaded
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.get();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    if (!profile) {
      fetchProfile();
    } else if (profile?.interests) {
      setInterests(profile.interests);
    }
  }, [profile, setProfile]);

  const handleAddInterest = () => {
    if (inputValue.trim() && !interests.includes(inputValue.trim())) {
      setInterests([...interests, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const response = await profileAPI.update({ interests });
      setProfile(response.data);
      router.push('/profile');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Save interests error:', error);
      alert('Failed to save interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-radial px-6 py-8">
      {/* Header */}
      <div className="flex justify-end items-center mb-8">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="px-6"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Title */}
      <div className="mb-8">
        <p className="text-accent-gold text-sm mb-2">
          Tell everyone about yourself
        </p>
        <h1 className="text-3xl font-bold text-white">
          What interest you?
        </h1>
      </div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type an interest and press Enter..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-surface-input border border-border-input rounded-lg px-5 py-4 text-white placeholder:text-white/40 focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 outline-none transition-all"
          />
          <button
            onClick={handleAddInterest}
            className="bg-gradient-primary text-white px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-white/40 text-sm mt-2">
          Press Enter or click + to add an interest
        </p>
      </div>

      {/* Interests Display */}
      <div className="space-y-4">
        {interests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">
              No interests added yet. Start typing to add some!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                onRemove={() => handleRemoveInterest(index)}
                removable
              />
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {interests.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            {interests.length} interest{interests.length !== 1 ? 's' : ''} added
          </p>
        </div>
      )}
    </div>
  );
}
