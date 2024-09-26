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
        <div onClick={handleClick} className=" bg-[#FFF2E1] border-none p-4 rounded-lg cursor-pointer text-center text-xl w-full max-w-xl">
            <h3 className="font-semibold">{county}</h3>
            <p>{town}</p>
        </div>
    );
}
