import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t bg-white px-6 py-12 md:px-10 
      /* Viền áp dụng oklch từ source  */
      border-[oklch(0.92_0.004_286.32)] 
      dark:bg-[oklch(0.141_0.005_285.823)] 
      dark:border-[oklch(0.274_0.006_286.033)]">
      
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[oklch(0.577_0.245_27.325)]">
            <Image src="/images/leaner/logo (2).png" alt="Learn Proof Logo" width={56} height={56} className="object-contain" />
            <h2 className="text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] text-lg font-bold">
              Learn Proof
            </h2>
          </div>
          <p className="text-sm text-[oklch(0.552_0.016_285.938)] leading-relaxed">
            Empowering the next generation of digital professionals with high-quality educational resources.
          </p>
          <div className="flex gap-4 text-[oklch(0.552_0.016_285.938)]">
            <Twitter size={18} className="hover:text-[oklch(0.577_0.245_27.325)] cursor-pointer" />
            <Github size={18} className="hover:text-[oklch(0.577_0.245_27.325)] cursor-pointer" />
            <Linkedin size={18} className="hover:text-[oklch(0.577_0.245_27.325)] cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Platform</h4>
          <ul className="flex flex-col gap-2 text-sm text-[oklch(0.552_0.016_285.938)]">
            <li><a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">All Courses</a></li>
            <li><a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">Mentorship</a></li>
            <li><a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">Certificates</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Company</h4>
          <ul className="flex flex-col gap-2 text-sm text-[oklch(0.552_0.016_285.938)]">
            <li><a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">About Us</a></li>
            <li><a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">Newsletter</h4>
          <p className="mb-4 text-sm text-[oklch(0.552_0.016_285.938)]">
            Get the latest updates and course offers.
          </p>
          <form className="flex flex-col gap-2" >
            <div className="relative">
              <Input 
                className="w-full pl-10 bg-[oklch(0.967_0.001_0)] dark:bg-[oklch(0.21_0.006_285.885)] 
                  border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]
                  /* Bo góc md cho Input  */
                  rounded-[calc(0.5rem-2px)] focus-visible:ring-[oklch(0.577_0.245_27.325)]" 
                placeholder="Email address" 
                type="email"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.552_0.016_285.938)]" size={16} />
            </div>
            <Button 
              type="submit"
              className="w-full font-bold text-white transition-all hover:opacity-90
                /* Màu Primary  và Bo góc md  */
                bg-[oklch(0.577_0.245_27.325)] rounded-[calc(0.5rem-2px)]">
              Join Newsletter
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1200px] border-t pt-8 text-center text-xs text-[oklch(0.552_0.016_285.938)]
        border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]">
        © {new Date().getFullYear()} Learn Proof Inc. All rights reserved.
      </div>
    </footer>
  );
}
