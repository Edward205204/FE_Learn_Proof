"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface SelectionOptionProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  rightIcon?: ReactNode;
  selected: boolean;
  onSelect: (id: string) => void;
  variant?: "pink" | "blue" | "yellow" | "green";
}

export function SelectionOption({
  id,
  title,
  description,
  icon,
  rightIcon,
  selected,
  onSelect,
  variant = "pink",
}: SelectionOptionProps) {
  const variantStyles = {
    pink: "bg-primary/10 text-primary hover:bg-primary/20",
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    yellow: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
  };

  return (
    <div
      onClick={() => onSelect(id)}
      className={cn(
        "flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer mb-4",
        selected
          ? "border-primary bg-primary/[0.02] ring-2 ring-primary/10"
          : "border-secondary hover:border-primary/20 bg-white"
      )}
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", variantStyles[variant])}>
        {icon}
      </div>
      
      <div className="flex-1">
        <h4 className="text-base font-bold text-foreground lead-tight">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {rightIcon && <div className="text-muted-foreground/30">{rightIcon}</div>}
        <div className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          selected ? "bg-primary border-primary text-white" : "border-secondary"
        )}>
          {selected && <Check className="w-4 h-4" />}
        </div>
      </div>
    </div>
  );
}
