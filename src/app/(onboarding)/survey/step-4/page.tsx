"use client";

import { useRouter } from "next/navigation";
import { Leaf, TrendingUp, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingHeader } from "../../_components/onboarding-header";
import { SelectionOption } from "../../_components/selection-option";
import { useOnboardingData } from "../layout";
import { PATH } from "../../../../constants/path";

const TIMES = [
  {
    id: "casual",
    title: "15 phút (Dạo chơi)",
    description: "Duy trì thói quen nhẹ nhàng",
    icon: <Leaf className="w-5 h-5" />,
    rightIcon: <Leaf className="w-4 h-4 opacity-50" />,
  },
  {
    id: "serious",
    title: "30 phút (Nghiêm túc)",
    description: "Tiến bộ vững chắc mỗi ngày",
    icon: <TrendingUp className="w-5 h-5" />,
    rightIcon: <TrendingUp className="w-4 h-4 opacity-50" />,
  },
  {
    id: "intense",
    title: "60+ phút (Cấp tốc)",
    description: "Đạt mục tiêu trong thời gian ngắn",
    icon: <Zap className="w-5 h-5" />,
    rightIcon: <Zap className="w-4 h-4 opacity-50" />,
  },
];

export default function OnboardingStep4() {
  const router = useRouter();
  const { data, setData } = useOnboardingData();

  const handleSelectTime = (time: string) => {
    setData((prev) => ({ ...prev, time }));
  };

  const goNext = () => {
    router.push(`${PATH.ONBOARDING}/step5`);
  };

  return (
    <>
      <OnboardingHeader
        step={4}
        totalSteps={6}
        progress={(4 / 6) * 100}
      />
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="text-center mb-10 mt-8">
              <h2 className="text-3xl font-extrabold text-foreground mb-3 leading-tight">
                Mỗi ngày bạn định dành bao nhiêu thời gian?
              </h2>
              <p className="text-muted-foreground">
                Chúng tôi sẽ điều chỉnh lộ trình học phù hợp với mục tiêu và lịch trình của bạn.
              </p>
            </div>

            <div className="w-full mb-12">
              {TIMES.map((time) => (
                <SelectionOption
                  key={time.id}
                  {...time}
                  selected={data.time === time.id}
                  onSelect={handleSelectTime}
                />
              ))}
            </div>

            <div className="w-full text-center">
              <Button
                onClick={goNext}
                disabled={!data.time}
                size="lg"
                className="w-full rounded-3xl py-8 text-xl font-bold shadow-xl shadow-primary/30 animate-in fade-in zoom-in duration-500"
              >
                Tạo lộ trình với AI <Sparkles className="ml-2 w-5 h-5" />
              </Button>
              <p className="mt-6 text-xs text-muted-foreground/60">
                Bạn có thể thay đổi mục tiêu này bất kỳ lúc nào trong cài đặt.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
