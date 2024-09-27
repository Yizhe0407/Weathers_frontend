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

// 定義接口，為 userCounties、county 和 town 指定類型
interface Town {
    id: string;
    town: string;
}

interface County {
    id: string;
    county: string;
    towns: Town[];
}

export default function Page() {
    const { user } = useUser();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false); // 控制Dialog的開關狀態
    const [userCounties, setUserCounties] = useState<County[]>([]); // 明確指定 userCounties 的類型
    const [loading, setLoading] = useState(true); // 狀態管理loading

    // 確保 user 存在後再取email
    const email = user?.emailAddresses?.[0]?.emailAddress;

    // 使用 useCallback 來記住 fetchUserCounties，當 email 改變時，函數會被更新
    const fetchUserCounties = useCallback(async () => {
        try {
            const response = await fetch(`https://weathers-backend.vercel.app/api/data?email=${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data: County[] = await response.json(); // 明確指定返回資料的類型為 County 陣列
                console.log(data);
                setUserCounties(data); // 保存到 state
            } else {
                console.error("Failed to fetch user counties");
            }
        } catch (error) {
            console.error("Error fetching user counties:", error);
        } finally {
            setLoading(false); // 資料加載完成
        }
    }, [email]); // email 作為 useCallback 的依賴項

    useEffect(() => {
        if (!isSignedIn) {
            router.push("/"); // 如果未通過驗證，跳轉到登入頁面
        } else if (email) {
            fetchUserCounties(); // 當用戶已登入並且 email 存在時，獲取 county 和 town 資料
        }
    }, [isSignedIn, router, email, fetchUserCounties]); // 將 fetchUserCounties 添加到依賴數組

    const handleDialogClose = () => {
        setOpen(false); // 關閉 Dialog
        fetchUserCounties(); // 每次關閉 Dialog 時重新獲取資料，更新顯示
    };

    if (loading) {
        return <div className="p-4 text-center text-2xl animate-pulse">Loading...</div>; // 在資料加載過程中顯示 Loading
    }

    // 使用 CountyTownItem 來渲染每個縣市和鄉鎮
    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <Dialog open={open} onOpenChange={setOpen}> {/* 控制 Dialog 的開關 */}
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-[#A79277] border-none text-white text-lg hover:bg-[#EAD8C0] w-full max-w-xl" onClick={() => setOpen(true)}>
                        新增
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-64 bg-[#D1BB9E] border-none rounded-lg" style={{ top: '35%' }}>
                    <DialogHeader>
                        <DialogTitle>選擇地區</DialogTitle>
                    </DialogHeader>
                    <Choose onSuccess={handleDialogClose} /> {/* 將關閉 Dialog 的函數傳遞給 Choose 組件 */}
                </DialogContent>
            </Dialog>

            {/* 使用 map 遍歷用戶的縣市和鄉鎮數據，分開顯示 */}
            <div className="mt-4 grid grid-cols gap-4 w-full max-w-xl">
                {userCounties.map((county) => (
                    county.towns.map((town) => (
                        <CountyTownItem
                            key={`${county.county}-${town}`} // 使用 county 名称和 town 名称生成唯一的 key
                            county={county.county}
                            town={town} 
                        />
                    ))
                ))}
            </div>



        </div>
    );
}
