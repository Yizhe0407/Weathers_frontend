import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { username, emailAddress, county, town } = await request.json();
    console.log("Received data:", { username, emailAddress, county, town });

    try {
        if (!username || !emailAddress || !county || !town) {
            throw new Error("All fields are required");
        }

        // Step 1: Fetch countyId based on the provided county name
        const countyRecord = await sql`
            SELECT id FROM "County" WHERE name = ${county};
        `;
        if (countyRecord.rows.length === 0) {
            return NextResponse.json({ error: "Invalid county" }, { status: 400 });
        }
        const countyId = countyRecord.rows[0].id;

        // Step 2: Fetch townId based on the provided town name and countyId
        const townRecord = await sql`
            SELECT id FROM "Town" WHERE name = ${town} AND "countyId" = ${countyId};
        `;
        if (townRecord.rows.length === 0) {
            return NextResponse.json({ error: "Invalid town for the specified county" }, { status: 400 });
        }
        // const townId = townRecord.rows[0].id;

        // Step 3: Check if the user already exists
        const existingUser = await sql`
            SELECT * FROM "User" WHERE username = ${username} OR "email_address" = ${emailAddress};
        `;

        if (existingUser.rows.length > 0) {
            // Step 4: Update user with the new countyId
            await sql`
                UPDATE "User"
                SET "countyId" = ${countyId}
                WHERE username = ${existingUser.rows[0].username} OR "email_address" = ${existingUser.rows[0].email_address};
            `;
            return NextResponse.json({ message: "User data updated successfully" }, { status: 200 });
        } else {
            // Step 5: Insert a new user with the countyId
            await sql`
                INSERT INTO "User" (username, "email_address", "countyId")
                VALUES (${username}, ${emailAddress}, ${countyId});
            `;
            return NextResponse.json({ message: "Data saved successfully" }, { status: 200 });
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error saving data:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Unexpected error:", error);
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}
