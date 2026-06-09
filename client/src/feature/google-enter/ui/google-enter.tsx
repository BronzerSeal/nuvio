import { authClient } from "@/shared/lib/auth";
import Image from "next/image";

export default function GoogleEnter({
  text = "Enter with Google",
}: {
  text?: string;
}) {
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/dashboard",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={handleGoogleSignIn}
      className="flex gap-1 text-[14px] font-semibold text-gray-700 items-center cursor-pointer w-full justify-center"
    >
      <Image src={`/google.png`} width={23} height={23} alt="Google enter" />
      <div>{text}</div>
    </div>
  );
}
