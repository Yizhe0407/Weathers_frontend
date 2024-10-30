"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { countyApiUrls, countyWithTowns } from "@/lib/countyApiUrls";

interface ChooseProps {
    onSuccess: () => void;
}

export default function Choose({ onSuccess }: ChooseProps) {
    const { user } = useUser();
    const [county, setCounty] = useState<string>("");
    const [towns, setTown] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const countyNames: string[] = Object.keys(countyApiUrls);

    const handleCountyChange = (county: string) => {
        setCounty(county);
        setTown("");
    };

    if (!user) return null;

    const handleClick = async () => {
        setLoading(true);
        const username = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

        const userData = {
            username,
            email: user.emailAddresses[0].emailAddress,
            towns,
        };

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
            setLoading(false);
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
                                    {town.split('_')[0]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    )}
                </Select>
            </div>

            <Button
                variant="outline"
                className="bg-[#A79277] hover:bg-[#B8A28B] text-white hover:text-white border-none w-32"
                onClick={handleClick}
                disabled={loading}
            >
                {loading ? (
                    <Image
                        src="/images/loading-level.gif"
                        alt="Loading..."
                        width={150}
                        height={150}
                    />
                ) :
                    "確定"}
            </Button>
        </div>
    );
}
