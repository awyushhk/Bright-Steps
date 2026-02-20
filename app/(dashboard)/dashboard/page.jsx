import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  let role = user?.publicMetadata?.role;

  // ⭐ If role missing → move from unsafeMetadata
  if (!role && user?.unsafeMetadata?.role) {
    const client = await clerkClient();

    role = user.unsafeMetadata.role;

    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });
  }

  if (role === "parent") redirect("/dashboard/parent");
  if (role === "clinician") redirect("/dashboard/clinician");

  // fallback only if truly no role
  redirect("/sign-up?role=parent");
}
