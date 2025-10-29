"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");  // Redirect to login page after logout
  };

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
};
