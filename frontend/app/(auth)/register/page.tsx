/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authAPI } from '@/lib/api';
import { ChevronLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(formData);

      // Redirect to login
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-radial px-6 py-8">
      <button
        onClick={() => router.back()}
        className="text-white mb-8 flex items-center gap-2 hover:text-accent-cyan transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <h1 className="text-4xl font-bold text-white mb-12">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Input
          type="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <Input
          type="text"
          placeholder="Create Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          error={errors.username}
        />

        <Input
          type="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          showPasswordToggle
          error={errors.password}
        />

        <Input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          showPasswordToggle
          error={errors.confirmPassword}
        />

        {errors.general && (
          <p className="text-red-400 text-sm">{errors.general}</p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>

        <p className="text-center text-white mt-6">
          Have an account?{' '}
          <Link href="/login" className="text-accent-cyan underline hover:text-accent-blue">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
