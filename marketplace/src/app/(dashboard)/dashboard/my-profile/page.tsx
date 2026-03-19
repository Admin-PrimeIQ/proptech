import { redirect } from "next/navigation";
import UserProfileForm from "@/components/Form/UserProfileForm";
import MyProfileHeader from "@/components/Dashboard/MyProfileHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getSessionWithRoles, isAdminFromSession } from "@/lib/auth-helpers";
import { getOrCreateVendedorForUserId } from "@/lib/api-propiedades";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default async function MyProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { session: sessionWithRoles, roles, idUsuario } = await getSessionWithRoles();
  const isAdmin = isAdminFromSession(sessionWithRoles);
  const userName = session.user.nombreCompleto ?? session.user.correo ?? "Usuario";

  let solicitudesCount: number | null = null;
  let vendedorIdPublic: string | null = null;
  let fotoUrl: string | null = null;
  const idUsuarioPublic = session.user.idPublic ?? null;

  // Perfil del usuario (nombre, correo, teléfono) para el formulario
  let profileData: { nombreCompleto: string; correo: string; telefono: string } | null = null;
  if (idUsuario != null) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: BigInt(idUsuario) },
      select: { nombreCompleto: true, correo: true, telefono: true },
    });
    if (usuario) {
      profileData = {
        nombreCompleto: usuario.nombreCompleto ?? "",
        correo: usuario.correo,
        telefono: usuario.telefono ?? "",
      };
    }
  }

  // Vendedor y foto de perfil para todos los roles (subida de imagen general)
  if (idUsuario != null) {
    const vendedor = await getOrCreateVendedorForUserId(BigInt(idUsuario));
    const vendedorFull = await prisma.vendedor.findUnique({
      where: { id: vendedor.id },
      include: { foto: true },
    });
    if (vendedorFull) {
      vendedorIdPublic = vendedorFull.idPublic;
      fotoUrl = vendedorFull.foto?.url ?? null;
      if (!isAdmin) {
        solicitudesCount = await prisma.solicitudContacto.count({
          where: { propiedad: { idVendedor: vendedor.id } },
        });
      }
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className="tp-dashboard-profile-wrapper">
          <MyProfileHeader
            userName={userName}
            solicitudesCount={solicitudesCount}
            isAdmin={isAdmin}
            vendedorIdPublic={vendedorIdPublic}
            fotoUrl={fotoUrl}
            idUsuarioPublic={idUsuarioPublic}
          />
          {/* Profile form information */}
          <UserProfileForm initialProfile={profileData} />
          {/* Profile form information */}
        </div>
      </DashboardLayout>
    </>
  );
}
