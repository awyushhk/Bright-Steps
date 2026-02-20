import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "No user" }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // If role already in publicMetadata, nothing to do
  if (user.publicMetadata?.role) {
    return NextResponse.json({ success: true, role: user.publicMetadata.role });
  }

  const role = user.unsafeMetadata?.role;

  if (!role) {
    return NextResponse.json({ error: "No role found" }, { status: 400 });
  }

  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });

  return NextResponse.json({ success: true, role });
}