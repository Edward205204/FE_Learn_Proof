"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "../../_components/onboarding-header";
import { AIProcessingScreen } from "../../_components/ai-processing";
import { PATH } from "../../../../constants/path";

export default function OnboardingStep5() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`${PATH.ONBOARDING}/finish`);
    }, 5000); // Wait for the animation to "finish"
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <OnboardingHeader
        step={5}
        totalSteps={6}
        progress={(5 / 6) * 100}
      />
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AIProcessingScreen />
        </div>
      </main>
    </>
  );
}
