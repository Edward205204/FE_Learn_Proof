"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingHeader } from "../../_components/onboarding-header";
import { TechCard, Tag } from "../../_components/tech-components";
import { useOnboardingData } from "../layout";
import { PATH } from "../../../../constants/path";

const TECHNOLOGIES = [
  { id: "nextjs", name: "Next.js", icon: "https://cdn.worldvectorlogo.com/logos/next-js.svg" },
  { id: "typescript", name: "TypeScript", icon: "https://cdn.worldvectorlogo.com/logos/typescript.svg" },
  { id: "nodejs", name: "Node.js", icon: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" },
  { id: "flutter", name: "Flutter", icon: "https://cdn.worldvectorlogo.com/logos/flutter.svg" },
  { id: "golang", name: "Golang", icon: "https://cdn.worldvectorlogo.com/logos/golang-gopher.svg" },
  { id: "rust", name: "Rust", icon: "https://cdn.worldvectorlogo.com/logos/rust.svg" },
  { id: "vuejs", name: "Vue.js", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzcT2qdg7hhXLOX4srNBB0PNhgyXGE8_qT1w&s" },
  { id: "docker", name: "Docker", icon: "https://cdn.worldvectorlogo.com/logos/docker.svg" },
];

const SUGGESTIONS = ["React.js", "Python", "JavaScript", "Tailwind CSS"];

export default function OnboardingStep2() {
  const router = useRouter();
  const { data, setData } = useOnboardingData();
  const [search, setSearch] = useState("");

  const handleToggleTech = (tech: string) => {
    setData((prev) => ({
      ...prev,
      techs: prev.techs.includes(tech)
        ? prev.techs.filter((t) => t !== tech)
        : [...prev.techs, tech],
    }));
  };

  const filteredTechs = TECHNOLOGIES.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const goNext = () => {
    router.push(`${PATH.ONBOARDING}/step3`);
  };

  const goBack = () => {
    router.push(`${PATH.ONBOARDING}/step1`);
  };

  return (
    <>
      <OnboardingHeader
        step={2}
        totalSteps={6}
        progress={(2 / 6) * 100}
      />
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <div className="text-center mb-8 mt-8">
              <h2 className="text-3xl font-extrabold text-foreground mb-3 leading-tight">
                Bạn muốn học ngôn ngữ hay framework nào?
              </h2>
              <p className="text-muted-foreground">
                Chọn ít nhất một công nghệ để bắt đầu hành trình của bạn.
              </p>
            </div>

            <div className="relative w-full max-w-2xl mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input
                placeholder="Tìm kiếm ngôn ngữ hoặc framework (ví dụ: React, Python)..."
                className="pl-12 pr-4 py-6 rounded-2xl border-secondary bg-white shadow-sm focus-visible:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full mb-10">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-foreground">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Gợi ý cho bạn
              </div>
              <div className="flex flex-wrap gap-3">
                {SUGGESTIONS.map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    selected={data.techs.includes(tag.toLowerCase())}
                    onClick={() => handleToggleTech(tag.toLowerCase())}
                  />
                ))}
              </div>
            </div>

            <div className="w-full mb-12">
              <h3 className="text-sm font-bold text-foreground mb-4">Tất cả công nghệ</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {filteredTechs.map((tech) => (
                  <TechCard
                    key={tech.id}
                    {...tech}
                    selected={data.techs.includes(tech.id)}
                    onSelect={handleToggleTech}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between w-full pt-6 border-t border-secondary mt-4">
              <Button variant="ghost" onClick={goBack} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
              </Button>
              <Button
                onClick={goNext}
                disabled={data.techs.length === 0}
                size="lg"
                className="rounded-full px-12 py-7 text-lg font-bold shadow-xl shadow-primary/25"
              >
                Tiếp tục <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
