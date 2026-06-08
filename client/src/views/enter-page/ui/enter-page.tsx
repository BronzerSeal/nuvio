import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/animate-tabs";
import { Card } from "@shared/ui/card";
import LoginForm from "./login-form";
import RegisterPage from "./register-page";
import { StarsBackground } from "@/shared/ui/stars-bg";
import { cn } from "@/shared/lib/utils";
import { useTheme } from "next-themes";
import ParticleConstellation from "@/shared/ui/particle-constellation-bg";

const EnterPage = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="min-h-screen px-2  flex flex-col items-center justify-center">
      <ParticleConstellation className="absolute" />
      {/* <StarsBackground
        starColor={resolvedTheme === "dark" ? "#FFF" : "#000"}
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-xl",
          "dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]",
        )}
      /> */}

      <h1 className="text-3xl font-bold pb-3 z-10 ">NUVIO</h1>

      <div className="flex w-full max-w-sm flex-col z-10 ">
        <Tabs defaultValue="login">
          <Card className="shadow-none py-0 ">
            <TabsContents className="pt-3">
              <TabsContent value="login" className="flex flex-col gap-6">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="flex flex-col gap-6">
                <RegisterPage />
              </TabsContent>
            </TabsContents>
          </Card>
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default EnterPage;
