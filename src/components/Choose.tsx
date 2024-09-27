"use client";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { countyApiUrls, countyWithTowns } from "@/lib/countyApiUrls";

interface ChooseProps {
    onSuccess: () => void; // 接收关闭Dialog的函数
}

export default function Choose({ onSuccess }: ChooseProps) {
    const { user } = useUser();
    const [county, setCounty] = useState<string>("");
    const [town, setTown] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);  // 新增 loading 狀態
    const countyNames: string[] = Object.keys(countyApiUrls);

    const handleCountyChange = (county: string) => {
        setCounty(county);
        setTown(""); // Reset town when county changes
    };

    if (!user) return null;

    const handleClick = async () => {
        setLoading(true);  // 請求開始，設置 loading 為 true
        const username = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

        const userData = {
            username,
            email: user.emailAddresses[0].emailAddress,
            county,
            town,
        };

        // Send the data to the backend via a POST request
        try {
            const response = await fetch("https://weathers-backend.vercel.app/api/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log("Data saved successfully");
                onSuccess();
            } else {
                console.error("Failed to save data");
            }
        } catch (error) {
            console.error("Error while saving data:", error);
        } finally {
            setLoading(false);  // 請求完成，無論成功與否都將 loading 設置為 false
        }
    };

    return (
        <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="w-32 bg-[#FFF2E1] border-none rounded-lg">
                <Select onValueChange={handleCountyChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                        {countyNames.map((county) => (
                            <SelectItem key={county} value={county}>
                                {county}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-32 bg-[#FFF2E1] border-none rounded-lg">
                <Select onValueChange={setTown} disabled={!county}>
                    <SelectTrigger>
                        <SelectValue placeholder={county ? "選擇鄉鎮" : "請先選擇縣市"} />
                    </SelectTrigger>
                    {county && (
                        <SelectContent>
                            {countyWithTowns[county]?.map((town) => (
                                <SelectItem key={town} value={town}>
                                    {town}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    )}
                </Select>
            </div>

            <Button
                variant="outline"
                className="bg-[#A79277] hover:bg-[#EAD8C0] text-white border-none w-32"
                onClick={handleClick}
                disabled={loading}  // 當 loading 為 true 時按鈕無法點擊
            >
                {loading ? "Loading..." : "確認"}  
            </Button>
        </div>
    );
}
