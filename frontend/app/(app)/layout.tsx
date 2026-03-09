'use client';

import Sidebar from '@/components/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="pt-16 lg:pt-0 lg:pl-20">{children}</div>
    </>
  );
}