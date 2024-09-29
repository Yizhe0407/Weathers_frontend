// components/CountyTownItem.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCountyByTown } from "@/lib/countyApiUrls";
import { Trash2, MapPin, ChevronRight } from 'lucide-react';
//import LoadingGif from "@/public/images/loading.gif"; // Make sure to import your loading gif component

interface CountyTownItemProps {
    town: string;
}

export default function CountyTownItem({ town }: CountyTownItemProps) {
    const { user } = useUser();
    const router = useRouter();
    const county = getCountyByTown(town); // Get the county by town
    const [loading, setLoading] = useState(false); // State to track loading state

    if (!user) return null;

    const deletePlace = async () => {
        setLoading(true); // Start loading
        const delInfo = {
            email: user.emailAddresses[0].emailAddress,
            town
        };
        try {
            const response = await fetch('https://weathers-backend.vercel.app/api/deleteTown', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(delInfo), // 傳送要刪除的城鎮
            });

            if (response.ok) {
                console.log(`${town} deleted successfully`);
                router.refresh(); // 刷新當前頁面以反映刪除後的狀態
            } else {
                console.error('Failed to delete town');
            }
        } catch (error) {
            console.error('Error deleting town:', error);
        } finally {
            setLoading(false); // Stop loading after the operation
        }
    };

    const handleClick = () => {
        if (county) {
            // Navigate to the new page with county and town as parameters
            router.push(`/countyTown?county=${county}&town=${town}`);
        } else {
            console.error(`County not found for town: ${town}`);
        }
    };

    return (
        <div onClick={handleClick} className="bg-[#FFF2E1] border-none p-4 rounded-lg cursor-pointer text-center text-xl w-full max-w-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center font-semibold">
                    <MapPin />
                    {county && <h3>　{county}</h3>} {/* 確保找到縣市時才顯示 */}
                    <ChevronRight />
                    <p>{town}</p>
                </div>
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡以避免觸發父級的點擊事件
                        deletePlace(); // 執行刪除操作
                    }}
                    className="border-none px-2 hover:bg-[#ead8c0] hover:text-[#BA704F]"
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <Image
                            src="/images/loading.gif" // Path to your GIF in the public folder
                            alt="Loading..." // Meaningful text as it's conveying the state
                            width={20} // You should set width and height for next/image
                            height={20}
                        />
                    ) : (
                        <Trash2 />
                    )}
                </Button>
            </div>
        </div>
    );
}
