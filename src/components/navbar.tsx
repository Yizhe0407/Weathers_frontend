// components/navbar.tsx
"use client";
//import React, { useEffect } from 'react';
import Link from 'next/link';
//import { useRouter } from 'next/navigation';
import { Pacifico } from 'next/font/google';
import { Button } from "@/components/ui/button";
import {
    SignedIn,
    SignedOut,
    useClerk,
    //useUser,
    UserButton
} from '@clerk/nextjs';

const pacifico = Pacifico({
    weight: '400',
    subsets: ['latin'],
});

export default function Navbar() {
    //const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    // const { user } = useUser();
    // const router = useRouter();

    // useEffect(() => {
    //     const createUser = async (username: string, email: string) => {
    //         try {
    //             const response = await fetch('https://weathers-backend.vercel.app/api/createUser', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ username, email }),
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to create user');
    //             }

    //             console.log('User created successfully');
    //         } catch (error) {
    //             console.error('Error creating user:', error);
    //         }
    //     };

    //     if (isSignedIn && user) {
    //         router.push('/dashboard');
    //         const username = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    //         const email = user.emailAddresses[0].emailAddress;
    //         createUser(username, email);
    //     }
    // }, [isSignedIn, user, router]);

    return (
        <div className='flex justify-between items-center w-full bg-[#A79277] py-2 px-8'>
            <h1 className={`text-2xl text-[#FFF2E1] ${pacifico.className}`}>
                <Link href="/">SkyNet</Link>
            </h1>
            <div>
                <SignedOut>
                    <Button
                        className="bg-white text-[#ba704f] font-semibold"
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
