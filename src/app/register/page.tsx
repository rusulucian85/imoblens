import { redirect } from "next/navigation";

// In NextAuth v5, sign-up and sign-in share the same flow (OAuth creates the
// user on first login; magic link likewise). Send /register to /login.
export default function RegisterPage() {
  redirect("/login");
}
