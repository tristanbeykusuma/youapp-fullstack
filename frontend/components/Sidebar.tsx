'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, MessageSquare, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header - Hamburger Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-card border-b border-border-card z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-accent-cyan transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-surface-card border-r border-border-card z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent-cyan/20 text-accent-cyan'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={24} />
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed top-0 left-0 h-full w-20 bg-surface-card border-r border-border-card z-50 flex-col items-center py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors mb-6 ${
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
      </nav>
    </>
  );
}
