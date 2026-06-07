"use client";
import { authClient } from "@/shared/lib/auth";

export default function Home() {
  const testSignIn = async () => {
    const res = await authClient.signUp.email({
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
    });

    console.log("sign In: ", res);
  };

  const testLogin = async () => {
    const res = await authClient.signIn.email({
      email: "test@test.com",
      password: "12345678",
    });

    console.log("login: ", res);

    const session = await authClient.getSession();
    console.log("session: ", session);
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col items-center">
      <button
        onClick={testSignIn}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test sign in
      </button>
      <button
        onClick={testLogin}
        className="bg-red-500 hover:bg-red-700 mt-3 text-white font-bold py-2 px-4 rounded"
      >
        Test Login
      </button>
    </div>
  );
}
