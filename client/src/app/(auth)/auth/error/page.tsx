"use client";

import AuthErrorPage from "@/views/auth-error-page";
import { Suspense } from "react";

const AuthErrorRoute = () => {
  return (
    <Suspense>
      <AuthErrorPage />
    </Suspense>
  );
};

export default AuthErrorRoute;
