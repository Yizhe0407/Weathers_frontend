// components/CountyTownItem.tsx
"use client";

import { useRouter } from "next/navigation";
import { getCountyByTown } from "@/lib/countyApiUrls";

interface CountyTownItemProps {
    town: string;
}

export default function CountyTownItem({ town }: CountyTownItemProps) {
    const router = useRouter();
    const county = getCountyByTown(town); // Get the county by town

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
            {county && <h3 className="font-semibold">{county}</h3>} {/* Display the county if found */}
            <p>{town}</p>
        </div>
    );
}
