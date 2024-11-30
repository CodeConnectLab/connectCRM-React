"use client";
import React from "react";
import Signin from "@/components/Auth/Signin";
import SignUp from "@/components/Auth/SignUp";
// import DarkModeSwitcher from "@/components/Header/DarkModeSwitcher";

export default function LoginPage({ isSignIn = true }: { isSignIn: boolean }) {
  return (
    <>
      {/* <div className="flex justify-end">
        <DarkModeSwitcher />
      </div> */}
      {isSignIn ? <Signin /> : <SignUp />} {/* </div> */}
    </>
  );
}