"use client";

import { SessionProvider as Session } from "next-auth/react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <Session>{children}</Session>;
};

export default AuthProvider;