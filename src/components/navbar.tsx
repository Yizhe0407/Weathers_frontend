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
        <div className='flex justify-between items-center w-full bg-sky-500 py-2 px-8'>
            <h1 className='text-2xl'>
                <Link href="/">Weathers</Link>
            </h1>
            <div>
                <SignedOut>
                    <SignInButton>
                        <Button className="bg-white text-black text-md" variant="outline" color="" size="lg">
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
