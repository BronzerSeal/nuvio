"use client";

import EnterPage from "@/views/enter-page";

export default function Home() {
  // const testSignIn = async () => {
  //   const res = await authClient.signUp.email({
  //     name: "Test User",
  //     email: "test@test.com",
  //     password: "12345678",
  //   });

  //   console.log("sign In: ", res);
  // };

  // const testLogin = async () => {
  //   const res = await authClient.signIn.email({
  //     email: "test@test.com",
  //     password: "12345678",
  //   });

  //   console.log("login: ", res);

  //   const session = await authClient.getSession();
  //   console.log("session: ", session);
  // };

  return <EnterPage />;
}
