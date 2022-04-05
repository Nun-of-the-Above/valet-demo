import { AdminProvider } from "../../context/admin-context";
import { useAuth } from "../../context/auth-context";
import { AdminPanel } from "../AdminPanel";
import { UserPanel } from "../UserPanel";

export function AuthenticatedApp() {
  const { user } = useAuth();

  return user.email === "admin@gmail.com" ? (
    <AdminProvider>
      <AdminPanel />
    </AdminProvider>
  ) : (
    <UserPanel />
  );
}
