"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
// import Choose from "@/components/Choose";

export default function Page() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isSignedIn) {
            router.push("/"); // Redirect to the sign-in page if not authenticated
        }
    }, [isSignedIn, router]);


    return (
        <div className="p-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Add</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-64 rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Select place</DialogTitle>
                    </DialogHeader>
                    {/* <Choose /> */}
                </DialogContent>
            </Dialog>
        </div>
    );
}