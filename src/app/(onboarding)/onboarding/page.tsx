"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PATH } from "../../../constants/path";

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`${PATH.ONBOARDING}/step1`);
  }, [router]);

  return null;
}
