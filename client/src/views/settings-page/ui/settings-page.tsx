"use client";
import { Main } from "@shared/ui/main";

import { ProfileForm } from "./profile-form";
import { DiaTextReveal } from "@/shared/ui/dia-text-reveal";

export default function SettingsPage() {
  return (
    <>
      <Main fixed className="">
        <DiaTextReveal
          className="text-2xl font-bold tracking-tight md:text-3xl mb-2"
          text="Settings"
          colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
        />

        <ProfileForm />
      </Main>
    </>
  );
}
