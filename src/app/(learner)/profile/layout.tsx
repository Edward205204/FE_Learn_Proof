"use client";

import { Sidebar } from "./_components/sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-12">
        {/* Sidebar Section */}
        <aside className="w-full md:w-[280px] flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content Section */}
        <main className="flex-1 bg-background">
          <div className="max-w-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
