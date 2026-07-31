import { AnimatedThemeToggler } from "@/shared/ui/animated-theme-toggler";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { DiaTextReveal } from "@/shared/ui/dia-text-reveal";
import React from "react";

const AccountSettingsPage = () => {
  return (
    <div className="p-2">
      <DiaTextReveal
        className="text-xl font-bold tracking-tight"
        text="General Settings"
        colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
      />

      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>

        <CardContent className="flex items-center gap-3">
          <AnimatedThemeToggler className="cursor-pointer" />

          <div>
            <h3 className="font-medium">Theme</h3>
            <p className="text-muted-foreground text-sm">
              Choose between light and dark mode.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsPage;
