"use client";

import { useSession, useUser } from "@clerk/nextjs";

export function UserDetails() {
  const { user } = useUser();
  const { session } = useSession();

  if (!user || !session) return null;

  return (
    <div>
        <p>Username : {user.firstName} {user.lastName}</p>
        <p>Email : {user.emailAddresses[0].emailAddress}</p>
        {/* <p>User ID : {user.id}</p>
        <p>Session ID : {session.id}</p> */}
    </div>
  );
}