"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TechCardProps {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function TechCard({ id, name, icon, selected, onSelect }: TechCardProps) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer bg-card",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-105"
          : "border-secondary hover:border-primary/20 hover:bg-secondary/50"
      )}
    >
      <div className="w-12 h-12 relative mb-3 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt={name} width={32} height={32} className="object-contain" />
      </div>
      <span className="text-sm font-bold text-foreground">{name}</span>

      {selected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow-sm animate-in zoom-in duration-300">
          <Check className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}

interface TagProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function Tag({ label, icon, selected, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
        selected
          ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
          : "bg-white border-secondary text-foreground/70 hover:border-primary/50 hover:text-primary"
      )}
    >
      {selected ? <Check className="w-4 h-4" /> : icon}
      {label}
    </button>
  );
}
