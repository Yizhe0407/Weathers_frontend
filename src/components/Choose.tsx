"use client";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { countyApiUrls, countiesWithTowns } from "@/lib/countyApiUrls";

export default function Choose() {
    const { user } = useUser();
    const [county, setCounty] = useState<string>("");
    const [town, setTown] = useState<string>("");

    console.log(countyApiUrls, town);

    const handleCountyChange = (county: string) => {
        setCounty(county);
        setTown(""); // Reset town when county changes
    };

    if (!user) return null;

    const handleClick = async () => {

        const username = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

        const userData = {
            username,
            emailAddress: user.emailAddresses[0].emailAddress,
            county,
            town,
        };
        
        console.log(userData);

        // Send the data to the backend via a POST request
        try {
            const response = await fetch("/api/saveUserLocation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log("Data saved successfully");
            } else {
                console.error("Failed to save data");
            }
        } catch (error) {
            console.error("Error while saving data:", error);
        }
    };

    return (
        <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="w-32">
                <Select onValueChange={handleCountyChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>北部</SelectLabel>
                            <SelectItem value="基隆市">基隆市</SelectItem>
                            <SelectItem value="臺北市">臺北市</SelectItem>
                            <SelectItem value="新北市">新北市</SelectItem>
                            <SelectItem value="桃園市">桃園市</SelectItem>
                            <SelectItem value="新竹市">新竹市</SelectItem>
                            <SelectItem value="新竹縣">新竹縣</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>中部</SelectLabel>
                            <SelectItem value="苗栗縣">苗栗縣</SelectItem>
                            <SelectItem value="臺中市">臺中市</SelectItem>
                            <SelectItem value="彰化縣">彰化縣</SelectItem>
                            <SelectItem value="南投縣">南投縣</SelectItem>
                            <SelectItem value="雲林縣">雲林縣</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>南部</SelectLabel>
                            <SelectItem value="嘉義市">嘉義市</SelectItem>
                            <SelectItem value="嘉義縣">嘉義縣</SelectItem>
                            <SelectItem value="臺南市">臺南市</SelectItem>
                            <SelectItem value="高雄市">高雄市</SelectItem>
                            <SelectItem value="屏東縣">屏東縣</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>東部</SelectLabel>
                            <SelectItem value="宜蘭縣">宜蘭縣</SelectItem>
                            <SelectItem value="花蓮縣">花蓮縣</SelectItem>
                            <SelectItem value="臺東縣">臺東縣</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-32">
                <Select onValueChange={setTown} disabled={!county}>
                    <SelectTrigger>
                        <SelectValue placeholder={county ? "選擇鄉鎮" : "請先選擇縣市"} />
                    </SelectTrigger>
                    {county && (
                        <SelectContent>
                            <SelectGroup>
                                {countiesWithTowns[county]?.map((town) => (
                                    <SelectItem key={town} value={town}>
                                        {town}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    )}
                </Select>
            </div>

            <Button variant="outline" className="w-32" onClick={handleClick}>
                確認
            </Button>
        </div>
    );
}
