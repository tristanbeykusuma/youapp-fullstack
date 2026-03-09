'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, MessageSquare } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 bg-surface-card border-b border-border-card z-50">
      <div className="flex justify-around items-center py-3 px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? 'text-accent-cyan'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
