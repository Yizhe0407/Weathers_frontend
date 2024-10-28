// app/page.tsx
"use client";
import {
  SignedIn,
  SignedOut,
  useClerk,
  UserButton
} from '@clerk/nextjs';
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  })

  return (
    <div className="flex flex-col justify-center p-4 h-full">
      <h1 className="text-4xl font-bold p-2">歡迎來到 SkyNet</h1>
      <h2 className="text-xl font-bold p-2">登入或註冊來建立屬於自己天氣清單</h2>
      <div className='p-2'>
        <SignedOut>
          <Button
            className="bg-[#ba704f] text-white font-semibold border-none"
            variant="outline"
            onClick={() => openSignIn({ afterSignInUrl: "/dashboard" })}
          >
            開始使用
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-8 h-8',
              },
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
}
