// components/CountyTownItem.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getCountyByTown } from "@/lib/countyApiUrls";
import { Trash2, MapPin, ChevronRight } from 'lucide-react';

interface CountyTownItemProps {
    town: string;
    onDelete: (town: string) => void; // Add onDelete prop
}

export default function CountyTownItem({ town, onDelete }: CountyTownItemProps) {
    const { user } = useUser();
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
            const response = await fetch('https://weathers-backend.vercel.app/api/deleteTown', {
                method: 'DELETE',
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

    return (
        <div className="bg-[#FFF2E1] border-none p-4 rounded-lg cursor-pointer text-center text-xl w-full max-w-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center font-semibold">
                    <MapPin />
                    {county && <h3>　{county}</h3>}
                    <ChevronRight />
                    <p>{town}</p>
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
                            width={20}
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
