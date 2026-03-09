/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { profileAPI } from '@/lib/api';
import axios from 'axios';
import Chip from '@/components/ui/Chip';
import { LogOut, Edit2, Camera, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { profile, setProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    gender: 'Male',
    birthday: '',
    height: '',
    weight: '',
  });

  // Client-side auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!storedToken || !storedUser) {
        router.push('/login');
        return;
      }
      
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        gender: profile.gender || 'Male',
        birthday: profile.birthday ? profile.birthday.split('T')[0] : '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get();
      setProfile(response.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setIsEditing(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let birthday = formData.birthday;
      if (birthday) {
        const date = new Date(birthday);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        birthday = date.toISOString().split('T')[0];
      }

      const payload = {
        displayName: formData.displayName,
        gender: formData.gender,
        birthday: birthday,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
      };

      let response;
      if (profile) {
        response = await profileAPI.update(payload);
      } else {
        response = await profileAPI.create(payload);
      }

      setProfile(response.data);
      setIsEditing(false);
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only image files (JPG, PNG, GIF, WebP) are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/uploadProfileImage`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Image uploaded:', response.data);
      setProfile(response.data.data);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('❌ Image upload failed:', error);
      alert(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/api/deleteProfileImage`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Image deleted:', response.data);
      setProfile(response.data.data);
    } catch (error: any) {
      console.error('❌ Image delete failed:', error);
      alert(error.response?.data?.message || 'Failed to delete image');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-radial flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const profileImageUrl = profile?.profileImage 
    ? `${API_URL}${profile.profileImage}` 
    : null;

  return (
    <div className="min-h-screen bg-app-radial px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-white text-base font-medium">@{user?.username}</span>
        <button
          onClick={handleLogout}
          className="text-white hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Profile Image Card with Background */}
      <div className="relative rounded-2xl overflow-hidden mb-4" style={{ height: '200px' }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile Background"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Upload/Delete Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {profile?.profileImage && (
            <button
              onClick={handleImageDelete}
              className="bg-red-500/80 hover:bg-red-600 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
              title="Delete image"
            >
              <X size={20} />
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors backdrop-blur-sm disabled:opacity-50"
            title="Upload image"
          >
            {uploadingImage ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={20} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white text-2xl font-medium mb-2">
            @{user?.username}, {profile?.age || '--'}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm">Gender:</span>
              <span className="text-white text-sm font-medium">{profile?.gender || '--'}</span>
            </div>
            {profile?.horoscope && (
              <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm">
                  {getHoroscopeSymbol(profile.horoscope)} {profile.horoscope}
                </span>
              </div>
            )}
            {profile?.zodiac && (
              <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm">
                  {getZodiacSymbol(profile.zodiac)} {profile.zodiac}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Card */}
      <div className="bg-surface-card border border-border-card rounded-2xl p-6 mb-4">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white text-lg font-semibold">About</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white hover:text-accent-cyan transition-colors"
            >
              <Edit2 size={20} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-white text-base hover:text-accent-cyan transition-colors"
            >
              {saving ? 'Saving...' : 'Save & Update'}
            </button>
          )}
        </div>

        {!isEditing && !profile ? (
          <p className="text-white/40 text-base">
            Add in your details to help others know you better
          </p>
        ) : isEditing ? (
          // Edit Mode
          <div className="space-y-5">
            {/* Display Name */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-white/60 text-base">Display name:</label>
              <input
                type="text"
                placeholder="Enter name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="col-span-2 bg-transparent border border-border-input rounded-lg px-4 py-2 text-white text-base text-right placeholder:text-white/30 focus:border-accent-cyan outline-none"
              />
            </div>

            {/* Gender */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-white/60 text-base">Gender:</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="col-span-2 bg-transparent border border-border-input rounded-lg px-4 py-2 text-white text-base text-right focus:border-accent-cyan outline-none appearance-none"
              >
                <option value="Male" className="bg-bg-middle">Male</option>
                <option value="Female" className="bg-bg-middle">Female</option>
                <option value="Other" className="bg-bg-middle">Other</option>
              </select>
            </div>

            {/* Birthday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-white/60 text-base">Birthday:</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="col-span-2 bg-surface-input border border-border-input rounded-lg px-4 py-2 text-white text-base text-right placeholder:text-white/30 focus:border-accent-cyan outline-none [color-scheme:dark]"
              />
            </div>

            {/* Horoscope */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-white/60 text-base">Horoscope:</label>
              <div className="col-span-2 text-right text-white/40 text-base">
                {profile?.horoscope || '--'}
              </div>
            </div>

            {/* Zodiac */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-white/60 text-base">Zodiac:</label>
              <div className="col-span-2 text-right text-white/40 text-base">
                {profile?.zodiac || '--'}
              </div>
            </div>

            {/* Height */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-white/60 text-base">Height:</label>
              <input
                type="number"
                placeholder="Add height"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="col-span-2 bg-transparent border border-border-input rounded-lg px-4 py-2 text-white text-base text-right placeholder:text-white/30 focus:border-accent-cyan outline-none"
              />
            </div>

            {/* Weight */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-white/60 text-base">Weight:</label>
              <input
                type="number"
                placeholder="Add weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="col-span-2 bg-transparent border border-border-input rounded-lg px-4 py-2 text-white text-base text-right placeholder:text-white/30 focus:border-accent-cyan outline-none"
              />
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-base">Display name:</span>
              <span className="text-white text-base font-medium">{profile?.displayName || '--'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60 text-base">Birthday:</span>
              <span className="text-white text-base font-medium">
                {profile?.birthday ? new Date(profile.birthday).toLocaleDateString('en-GB').replace(/\//g, ' ') : '--'} (Age {profile?.age})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60 text-base">Horoscope:</span>
              <div className="bg-surface-input rounded-full px-4 py-1.5">
                <span className="text-white text-base font-medium">{getHoroscopeSymbol(profile!.horoscope)} {profile!.horoscope}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60 text-base">Zodiac:</span>
              <div className="bg-surface-input rounded-full px-4 py-1.5">
                <span className="text-white text-base font-medium">{getZodiacSymbol(profile!.zodiac)} {profile!.zodiac}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60 text-base">Height:</span>
              <span className="text-white text-base font-medium">{profile?.height} cm</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60 text-base">Weight:</span>
              <span className="text-white text-base font-medium">{profile?.weight} kg</span>
            </div>
          </div>
        )}
      </div>

      {/* Interest Card */}
      <div className="bg-surface-card border border-border-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white text-lg font-semibold">Interest</h3>
          <button
            onClick={() => router.push('/interests')}
            className="text-white hover:text-accent-cyan transition-colors"
          >
            <Edit2 size={20} />
          </button>
        </div>

        {profile?.interests && profile.interests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <div
                key={index}
                className="bg-white/[0.08] border border-white/[0.25] rounded-full px-4 py-2 text-white text-base"
              >
                {interest}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-base">
            Add in your interest to find a better match
          </p>
        )}
      </div>
    </div>
  );
}

// Function for symbols
function getHoroscopeSymbol(horoscope: string): string {
  const symbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
  };
  return symbols[horoscope] || '';
}

function getZodiacSymbol(zodiac: string): string {
  const symbols: Record<string, string> = {
    'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐇',
    'Dragon': '🐉', 'Snake': '🐍', 'Horse': '🐎', 'Goat': '🐐',
    'Monkey': '🐒', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐖',
  };
  return symbols[zodiac] || '';
}