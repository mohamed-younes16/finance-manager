"use client";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

const SignOutButton = ({ children }: { children: ReactNode }) => {
  return (
    <div  className="w-full" onClick={() => signOut({ redirect: true ,})}>
      {children}
    </div>
  );
};

export default SignOutButton;
