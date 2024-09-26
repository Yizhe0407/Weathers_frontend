// components/navbar.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'

export default function Navbar() {
    return (
        <div className='flex justify-between items-center w-full bg-[#A79277] py-2 px-8'>
            <h1 className='text-2xl text-[#FFF2E1]'>
                <Link href="/">SkyNet</Link>
            </h1>
            <div>
                <SignedOut>
                    <SignInButton>
                        <Button className="bg-[#F5F5F5] text-black text-md" variant="outline" color="" size="lg">
                            登入
                        </Button>
                    </SignInButton>
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
    )
}
