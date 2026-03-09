/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profileStore';
import { profileAPI } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ChevronLeft, Save } from 'lucide-react';

export default function ProfileEditPage() {
  const router = useRouter();
  const { profile, setProfile } = useProfileStore();

  const [formData, setFormData] = useState({
    displayName: '',
    gender: 'Male',
    birthday: '',
    height: '',
    weight: '',
    about: '',
  });
  const [loading, setLoading] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(true);

  useEffect(() => {
    // Check if editing existing profile
    if (profile) {
      setIsNewProfile(false);
      setFormData({
        displayName: profile.displayName || '',
        gender: profile.gender || 'Male',
        birthday: profile.birthday ? profile.birthday.split('T')[0] : '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        about: profile.about || '',
      });
    } else {
      // Try to fetch profile to check if it exists
      checkExistingProfile();
    }
  }, [profile]);

  const checkExistingProfile = async () => {
    try {
      const response = await profileAPI.get();
      // Profile exists
      setProfile(response.data);
      setIsNewProfile(false);
      setFormData({
        displayName: response.data.displayName || '',
        gender: response.data.gender || 'Male',
        birthday: response.data.birthday ? response.data.birthday.split('T')[0] : '',
        height: response.data.height?.toString() || '',
        weight: response.data.weight?.toString() || '',
        about: response.data.about || '',
      });
    } catch (error) {
      // Profile doesn't exist - this is a new profile
      setIsNewProfile(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate birthday is in correct format
      let birthday = formData.birthday;
      if (birthday) {
        // Ensure to date is in YYYY-MM-DD format (ISO 8601)
        const date = new Date(birthday);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        // Format as YYYY-MM-DD
        birthday = date.toISOString().split('T')[0];
      }

      const payload = {
        displayName: formData.displayName,
        gender: formData.gender,
        birthday: birthday,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        about: formData.about,
      };

      let response;
      if (isNewProfile) {
        response = await profileAPI.create(payload);
      } else {
        response = await profileAPI.update(payload);
      }

      setProfile(response.data);
      router.push('/profile');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Save profile error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-radial px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/profile')}
          className="text-white flex items-center gap-2 hover:text-accent-cyan transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-semibold text-white">
          {isNewProfile ? 'Create Profile' : 'Edit Profile'}
        </h1>
        <div className="w-16" /> {/* Spacer for alignment */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {/* Display Name */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">
            Display Name
          </label>
          <Input
            type="text"
            placeholder="Enter your name"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            className="w-full bg-surface-input border border-border-input rounded-lg px-5 py-4 text-white outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Birthday */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">
            Birthday
          </label>
          <Input
            type="date"
            placeholder="DD MM YYYY"
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
          />
          {formData.birthday && (
            <p className="text-white/40 text-xs mt-1">
              Your horoscope and zodiac will be calculated automatically
            </p>
          )}
        </div>

        {/* Height */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">
            Height (cm)
          </label>
          <Input
            type="number"
            placeholder="Enter height in cm"
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: e.target.value })
            }
          />
        </div>

        {/* Weight */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">
            Weight (kg)
          </label>
          <Input
            type="number"
            placeholder="Enter weight in kg"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
          />
        </div>

        {/* About */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">About</label>
          <textarea
            placeholder="Tell us about yourself..."
            value={formData.about}
            onChange={(e) =>
              setFormData({ ...formData, about: e.target.value })
            }
            rows={4}
            className="w-full bg-surface-input border border-border-input rounded-lg px-5 py-4 text-white placeholder:text-white/40 focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? (
            'Saving...'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save size={20} />
              {isNewProfile ? 'Create Profile' : 'Save Changes'}
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}