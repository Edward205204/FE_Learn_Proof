"use client";

import { Progress } from "@/components/ui/progress";

interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
}

export function OnboardingHeader({
  step,
  totalSteps,
  progress,
}: OnboardingHeaderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto pt-6 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold italic rotate-12">
            L
          </div>
          <span className="text-xl font-bold tracking-tight">LearnProof</span>
        </div>

      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground/80">
          Bước {step}: {getStepTitle(step)}
        </span>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {step}/{totalSteps}
        </span>
      </div>
      <Progress value={progress} className="h-2 bg-secondary" />
    </div>
  );
}

function getStepTitle(step: number) {
  switch (step) {
    case 1:
      return "Chọn lĩnh vực";
    case 2:
      return "Chọn công nghệ";
    case 3:
      return "Trình độ hiện tại";
    case 4:
      return "Thời gian cam kết";
    case 5:
      return "AI phân tích";
    default:
      return "";
  }
}
