"use client";

import { useState } from "react";
import { AuthUserSvg } from "@/components/SVG";
import { forgotSchema } from "@/schemas/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../ErrorMassage";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

interface FormData {
  email: string;
}

export default function ForgotForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(forgotSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email.trim().toLowerCase() }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(json?.error ?? "Error al enviar el correo. Intenta de nuevo.");
        return;
      }

      toast.success(json?.message ?? "Si el correo está registrado, recibirás una nueva contraseña.");
      reset();
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="tp-sign-in-input-box">
            <div className="tp-sign-in-input p-relative">
              <input
                {...register("email")}
                type="email"
                placeholder="Ingrese su correo"
              />
              <i><AuthUserSvg /></i>
            </div>
            <ErrorMessage message={errors?.email?.message || ""} />
          </div>
        </div>
        <div className="col-12">
          <div className="tp-sign-in-from-btn mb-30">
            <button
              type="submit"
              className="tp-btn w-100 text-center"
              disabled={loading}
            >
              {loading ? "Enviando…" : "Enviar correo"}
            </button>
          </div>
          <div className="tp-sign-in-from-register">
            <p>
              ¿Recuerda su contraseña? <Link href="/sign-in">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
