import { eq } from "drizzle-orm";
import { PasswordForm, ProfileForm } from "@/features/edit-profile";
import { requireUser } from "@/shared/lib/auth/session.service";
import { db, user as userTable } from "@/shared/lib/db";

// page
export async function ProfilePage() {
  const user = await requireUser();
  const [row] = await db.select().from(userTable).where(eq(userTable.id, user.id));
  // return
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="page-title">Профіль</h1>
      {row ? (
        <>
          <ProfileForm name={row.name} email={row.email} phone={row.phone ?? ""} />
          <PasswordForm />
        </>
      ) : (
        <p className="card text-sm text-muted">Профіль керується через Clerk.</p>
      )}
    </div>
  );
}
