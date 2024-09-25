// components/CountyTownItem.tsx
"use client";

import { useRouter } from "next/navigation";

interface CountyTownItemProps {
    county: string;
    town: string;
}

export default function CountyTownItem({ county, town }: CountyTownItemProps) {
    const router = useRouter();

    const handleClick = () => {
        // 跳轉到新頁面，並將 county 和 town 作為路由參數傳遞
        router.push(`/countyTown?county=${county}&town=${town}`);
    };

    return (
        <div onClick={handleClick} className="border p-4 rounded-lg cursor-pointer w-40">
            <h3 className="font-semibold">County: {county}</h3>
            <p>Town: {town}</p>
        </div>
    );
}
