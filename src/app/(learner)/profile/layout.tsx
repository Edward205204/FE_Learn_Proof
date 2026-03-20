"use client";

import { Sidebar } from "./_components/sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background py-10 px-4 md:px-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row bg-card border border-border shadow-sm min-h-[600px] mb-20 rounded-lg overflow-hidden">
        
        {/* Sidebar Section */}
        <aside className="w-full md:w-[260px] border-r border-border py-6 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content Section */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
