import { getSessionUser } from "@/lib/auth/session";
import { AdminShell } from "./_components/AdminShell";
import { LoginForm } from "./_components/LoginForm";

// The session is verified on the server; the API routes verify it again on every call.
export default async function AdminPage() {
  const user = await getSessionUser();
  return user ? <AdminShell user={user} /> : <LoginForm />;
}
