import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/animate-tabs";
import { Card } from "@shared/ui/card";
import LoginForm from "./login-form";
import RegisterPage from "./register-form";
import ParticleConstellation from "@/shared/ui/particle-constellation-bg";
import Image from "next/image";

const EnterPage = () => {
  return (
    <div className="min-h-screen px-2  flex flex-col items-center justify-center">
      <ParticleConstellation className="absolute" />

      <Image
        src="/logo-text.png"
        width={160}
        height={100}
        alt="Logo"
        className="mb-2 z-10"
        priority
      />

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
