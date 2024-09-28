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
import Choose from "@/components/Choose";
import CountyTownItem from "@/components/CountyTownItem";

// API now returns an array of strings, so we update the ApiResponse type accordingly
interface ApiResponse {
    towns: string[]; // API returns an array of town strings
}

export default function Page() {
    const { user } = useUser();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [userTowns, setUserTowns] = useState<string[]>([]); // State stores towns as strings now
    const [loading, setLoading] = useState(true);

    const email = user?.emailAddresses?.[0]?.emailAddress;

    const fetchUserTowns = useCallback(async () => {
        try {
            // 檢查 localStorage 中是否有快取的數據
            const cachedTowns = localStorage.getItem(email || "");
            if (cachedTowns) {
                setUserTowns(JSON.parse(cachedTowns));
                setLoading(false);
                return;
            }

            // 如果沒有快取的數據，則發送 API 請求
            const response = await fetch(`https://weathers-backend.vercel.app/api/data?email=${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data: ApiResponse = await response.json();

                // 更新狀態並將數據存入 localStorage
                setUserTowns(data.towns);
                localStorage.setItem(email || "", JSON.stringify(data.towns));
            } else {
                console.error("Failed to fetch user towns");
            }
        } catch (error) {
            console.error("Error fetching user towns:", error);
        } finally {
            setLoading(false);
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
    
        // 清除 localStorage 中的快取，強制更新數據
        if (email) {
            localStorage.removeItem(email); // 移除之前快取的數據
        }
    
        fetchUserTowns(); // 重新從 API 獲取最新的數據
    };

    if (loading) {
        return <div className="p-4 text-center text-2xl animate-pulse">Loading...</div>;
    }

    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-[#A79277] border-none text-white text-lg hover:bg-[#EAD8C0] w-full max-w-xl" onClick={() => setOpen(true)}>
                        新增
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-64 bg-[#D1BB9E] border-none rounded-lg" style={{ top: '35%' }}>
                    <DialogHeader>
                        <DialogTitle>選擇地區</DialogTitle>
                    </DialogHeader>
                    <Choose onSuccess={handleDialogClose} />
                </DialogContent>
            </Dialog>

            <div className="mt-4 grid grid-cols gap-4 w-full max-w-xl">
                {userTowns.map((town, index) => (
                    <CountyTownItem
                        key={`${town}-${index}`} // Ensure unique key by combining town name and index
                        town={town} // Pass only the town string directly
                    />
                ))}
            </div>
        </div>
    );
}
