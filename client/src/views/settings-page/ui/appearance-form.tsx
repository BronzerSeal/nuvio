import { AnimatedThemeToggler } from "@/shared/ui/animated-theme-toggler";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function AppearanceForm() {
  return (
    <Card className="mt-2 bg-background  rounded-lg">
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
  );
}
