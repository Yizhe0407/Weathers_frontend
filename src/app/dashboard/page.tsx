"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePlus } from 'lucide-react';
import Choose from "@/components/Choose";
import { Skeleton } from "@/components/ui/skeleton";
import CountyTownItem from "@/components/CountyTownItem";

export default function Page() {
    const { user } = useUser();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [towns, setTowns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // Track loading state

    const email = user?.emailAddresses?.[0]?.emailAddress;

    const fetchUserTowns = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`https://weathers-backend.vercel.app/api/data/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                const townNames = data.map((item: { town: string }) => item.town);
                setTowns(townNames);
            } else {
                console.error("Failed to fetch user towns");
            }
        } catch (error) {
            console.error("Error fetching user towns:", error);
        } finally {
            setLoading(false); // End loading
        }
    }, [email]);

    useEffect(() => {
        if (!isSignedIn) {
            router.push("/");
        } else if (email) {
            fetchUserTowns();
        }
    }, [isSignedIn, router, email, fetchUserTowns]);

    const handleDialogClose = () => {
        setOpen(false);
        fetchUserTowns(); // Refresh data
    };

    const handleTownDelete = (deletedTown: string) => {
        setTowns((prevTowns) => prevTowns.filter((town) => town !== deletedTown));
    };

    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-[#A79277] hover:bg-[#B8A28B] border-none text-white hover:text-white text-lg w-full max-w-xl flex justify-center items-center space-x-2"
                        onClick={() => setOpen(true)}
                    >
                        <SquarePlus />
                        <span>新增</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-64 bg-[#D1BB9E] border-none rounded-lg" style={{ top: '35%' }}>
                    <DialogHeader>
                        <DialogTitle className="text-center">選擇地區</DialogTitle>
                    </DialogHeader>
                    <Choose onSuccess={handleDialogClose} />
                </DialogContent>
            </Dialog>

            <div className="mt-4 grid grid-cols gap-4 w-full max-w-xl">
                {loading ? (
                    // Display skeletons while loading
                    Array.from({ length: 3 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-[72px] w-full max-w-xl rounded-xl bg-[#fff2e1]" />
                    ))
                ) : (
                    // Display town items once loaded
                    towns.map((town, index) => (
                        <CountyTownItem
                            key={`${town}-${index}`}
                            town={town}
                            onDelete={handleTownDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
