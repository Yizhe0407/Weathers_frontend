// app/page.tsx
"use client";
import {
  SignedIn,
  SignedOut,
  useClerk,
  UserButton
} from '@clerk/nextjs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from 'next/image';
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [count, setCount] = React.useState(0)
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  })

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="flex p-8 h-full justify-center flex-col md:flex-row max-w-5xl mx-auto">
      <div className='flex flex-col pt-8 max-w-3xl mx-auto'>
        <h1 className="text-4xl font-bold p-2">SkyNet－為您打造個性化的天氣清單</h1>
        <p className="text-lg p-2">
          在 SkyNet，您可以客製化個人的天氣清單，輕鬆掌握您關注地區的最新天氣動態。無論是日常生活還是旅行計劃，我們的精準氣象資訊，讓您隨時做好萬全準備！
        </p>
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

      <div className="flex flex-col max-w-[300px] mx-auto">
        <Carousel setApi={setApi} className="flex justify-center">
          <CarouselContent>
            <CarouselItem className="flex justify-center">
              <Image src="/images/phone1.png" width={300} height={300} alt='phone' />
            </CarouselItem>
            <CarouselItem className="flex justify-center">
              <Image src="/images/phone2.png" width={300} height={300} alt='phone' />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div className="text-center text-sm text-muted-foreground">
          Slide {current} of {count}
        </div>
      </div>
    </div>
  );
}
