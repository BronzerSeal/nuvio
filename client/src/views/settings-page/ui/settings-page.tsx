"use client";
import { Main } from "@shared/ui/main";

import { ProfileForm } from "./profile-form";
import { DiaTextReveal } from "@/shared/ui/dia-text-reveal";
import { AppearanceForm } from "./appearance-form";
import { useParams } from "next/navigation";
import EmptyState from "@/shared/ui/empty-state";

export default function SettingsPage() {
  const { settingsType } = useParams() as {
    settingsType: "profile" | "appearance" | undefined;
  };
  return (
    <>
      <Main fixed className="">
        <DiaTextReveal
          className="text-2xl font-bold tracking-tight md:text-3xl mb-2"
          text="Settings"
          colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
        />

        {settingsType === "profile" && <ProfileForm />}
        {settingsType === "appearance" && <AppearanceForm />}
        {settingsType === undefined ||
          (settingsType !== "profile" && settingsType !== "appearance" && (
            <EmptyState text="Not found SECTION" />
          ))}
      </Main>
    </>
  );
}
