'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      // Save auth data
      setAuth(response.data.user, response.data.accessToken);

      // Use router for client-side navigation
      router.push('/profile');
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: 'An unexpected error occurred.' });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-radial px-6 py-8">
      <Link
        href="/"
        className="text-white mb-8 flex items-center gap-2 hover:text-accent-cyan transition-colors inline-flex"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </Link>

      <h1 className="text-4xl font-bold text-white mb-12">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Input
          type="email"
          placeholder="Enter Username/Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <Input
          type="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          showPasswordToggle
          error={errors.password}
        />

        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="text-center text-white mt-6">
          No account?{' '}
          <Link href="/register" className="text-accent-cyan underline hover:text-accent-blue">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}