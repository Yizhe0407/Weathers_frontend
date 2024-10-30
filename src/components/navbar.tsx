// components/navbar.tsx
"use client";
import Link from 'next/link';
import { Pacifico } from 'next/font/google';
import { Button } from "@/components/ui/button";
import {
    SignedIn,
    SignedOut,
    useClerk,
    //useUser,
    UserButton
} from '@clerk/nextjs';
import { useAuth } from "@clerk/nextjs";

const pacifico = Pacifico({
    weight: '400',
    subsets: ['latin'],
});

export default function Navbar() {
    const { isSignedIn } = useAuth();
    const { openSignIn } = useClerk();

    return (
        <div className='flex justify-between items-center w-full bg-[#A79277] py-2 px-8'>
            <h1 className={`text-2xl text-[#FFF2E1] ${pacifico.className}`}>
                <Link href={isSignedIn ? "/dashboard" : "/"}>SkyNet</Link>
            </h1>
            <div>
                <SignedOut>
                    <Button
                        className="bg-white text-[#ba704f] hover:text-[#ba704f] font-semibold"
                        variant="outline"
                        onClick={() => openSignIn({ afterSignInUrl: "/dashboard" })}
                    >
                        登入
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
