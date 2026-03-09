'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-app-radial flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-md">
        <h1 className="text-5xl font-bold text-white">YouApp</h1>
        <p className="text-xl text-white/70">
          Connect and Chat
        </p>

        <div className="space-y-4 pt-8">
          <Button fullWidth onClick={() => router.push('/login')}>
            Login
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => router.push('/register')}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
