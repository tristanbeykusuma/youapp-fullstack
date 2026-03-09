import { create } from 'zustand';

interface Profile {
  displayName: string;
  gender: string;
  birthday: string;
  age: number;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  interests: string[];
  about: string;
  profileImage?: string;
}

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
