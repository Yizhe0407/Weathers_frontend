// components/CountyTownItem.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCountyByTown } from "@/lib/countyApiUrls";
import { Trash2, MapPin, ChevronRight } from 'lucide-react';

interface CountyTownItemProps {
    town: string;
    onDelete: (town: string) => void; // Add onDelete prop
}

export default function CountyTownItem({ town, onDelete }: CountyTownItemProps) {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const county = getCountyByTown(town);

    if (!user) return null;

    const deletePlace = async () => {
        setLoading(true);
        const delInfo = {
            email: user.emailAddresses[0].emailAddress,
            town
        };
        try {
            const response = await fetch('https://weathers-backend.vercel.app/api/del', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(delInfo),
            });

            if (response.ok) {
                console.log(`${town} deleted successfully`);
                onDelete(town); // Call onDelete to update parent state
            } else {
                console.error('Failed to delete town');
            }
        } catch (error) {
            console.error('Error deleting town:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        if (county) {
            // Navigate to the new page with county and town as parameters
            router.push(`/countyTown?county=${county}&town=${town.split('_')[0]}`);
        } else {
            console.error(`County not found for town: ${town}`);
        }
    };


    return (
        <div onClick={handleClick} className="bg-[#FFF2E1] shadow shadow-[#a79277] hover:shadow-lg border-none p-4 rounded-lg cursor-pointer text-center text-xl w-full max-w-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center font-semibold">
                    <MapPin />
                    {county && <h3>　{county}</h3>}
                    <ChevronRight />
                    <p>{town.split('_')[0]}</p>
                </div>
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation();
                        deletePlace();
                    }}
                    className="border-none px-2 hover:bg-[#ead8c0] hover:text-[#BA704F]"
                    disabled={loading}
                >
                    {loading ? (
                        <Image
                            src="/images/loading.gif"
                            alt="Loading..."
                            width={25}
                            height={25}
                        />
                    ) : (
                        <Trash2 />
                    )}
                </Button>
            </div>
        </div>
    );
}
