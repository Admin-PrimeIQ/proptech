"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ErrorMessage from "./ErrorMassage";
import { IleaveMessageFormValues } from "@/types/custom-interface";
import { leaveMessageSchema } from "@/schemas/validationSchema";

const SIGN_IN_PATH = "/sign-in";
const PROPERTY_DETAILS_PATH = "/property-details-2";

interface LeaveMessageFormProps {
  idPropiedad?: string;
}

export default function LeaveMessageForm({ idPropiedad }: LeaveMessageFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IleaveMessageFormValues>({
    resolver: yupResolver(leaveMessageSchema),
  });

  const isAuthenticated = status === "authenticated" && !!session?.user;

  const redirectToSignIn = () => {
    if (idPropiedad) {
      const callbackUrl = encodeURIComponent(`${PROPERTY_DETAILS_PATH}/${idPropiedad}`);
      router.replace(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`);
    } else {
      router.replace(SIGN_IN_PATH);
    }
    toast.info("Inicia sesión para enviar tu mensaje");
  };

  const onSubmit = async (data: IleaveMessageFormValues) => {
    if (!idPropiedad) {
      toast.success("Mensaje enviado correctamente.");
      reset();
      return;
    }
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }
    try {
      const res = await fetch("/api/solicitudes-contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPropiedad,
          nombre: data.name.trim(),
          correo: data.email.trim(),
          telefono: data.phone?.trim() || undefined,
          mensaje: data.message?.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (res.status === 401) {
        redirectToSignIn();
        return;
      }
      if (!res.ok) {
        toast.error(json?.error ?? "Error al enviar el mensaje");
        return;
      }
      toast.success("Tu solicitud se ha enviado.");
      reset();
    } catch {
      toast.error("Error al enviar el mensaje");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-team-details-info-input-box">
        <div className="tp-team-details-info-input">
          <input type="text" {...register("name")} placeholder="Nombre completo" />
          {errors.name && <ErrorMessage message={errors.name.message} />}
        </div>
        <div className="tp-team-details-info-input">
          <input type="text" {...register("phone")} placeholder="Número de teléfono" />
          {errors.phone && <ErrorMessage message={errors.phone.message} />}
        </div>
        <div className="tp-team-details-info-input">
          <input type="text" {...register("email")} placeholder="Correo electrónico" />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>
        <div className="tp-team-details-info-input">
          <textarea placeholder="Tu mensaje" {...register("message")}></textarea>
          {errors.message && <ErrorMessage message={errors.message.message} />}
        </div>
        <button type="submit" className="tp-btn w-100">
          Mandar mensaje
        </button>
      </div>
    </form>
  );
}
