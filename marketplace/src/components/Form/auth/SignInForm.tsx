"use client"
import { AuthGoogleSvg, AuthLockSvg, AuthUserSvg, ClosedEyeSvg, OpenEyeSvg } from "@/components/SVG";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "@/schemas/validationSchema";
import ErrorMessage from "../ErrorMassage";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface FormData {
    userNameOrEmail: string;
    password: string;
}

export default function SignInForm() {
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(signInSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const correo = data.userNameOrEmail.trim().toLowerCase();
            const res = await signIn("credentials", {
                correo,
                password: data.password,
                redirect: false,
                callbackUrl,
            });
            if (res?.error) {
                toast.error("Correo o contraseña incorrectos.");
                return;
            }
            toast.success("Sesión iniciada correctamente.");
            reset();
            if (res?.url) window.location.href = res.url;
        } catch {
            toast.error("Error al iniciar sesión.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                {/* Email or Username Field */}
                <div className="col-12">
                    <div className="tp-sign-in-input-box">
                        <div className="tp-sign-in-input p-relative">
                            <input
                                {...register("userNameOrEmail")}
                                type="text"
                                placeholder="Correo o usuario"
                            />
                            <i><AuthUserSvg /></i>
                        </div>
                        <ErrorMessage message={errors?.userNameOrEmail?.message || ""} />
                    </div>
                </div>

                {/* Password Field */}
                <div className="col-12">
                    <div className="tp-sign-in-input-box">
                        <div className="tp-sign-in-input p-relative">
                            <div className="password-input p-relative">
                                <input
                                    {...register("password")}
                                    type={showPass ? "text" : "password"}
                                    placeholder="Contraseña"
                                />
                                <div className="tp-sign-in-input-eye password-show-toggle" onClick={() => setShowPass(!showPass)}>
                                    <i><AuthLockSvg /></i>
                                    <span
                                        id="open-eye"
                                        className="open-eye open-eye-icon"
                                        style={{ display: showPass ? "block" : "none" }}
                                    >
                                        <OpenEyeSvg />
                                    </span>

                                    <span
                                        id="close-eye"
                                        className="open-close close-eye-icon"
                                        style={{ display: showPass ? "none" : "block" }}
                                    >
                                        <ClosedEyeSvg />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ErrorMessage message={errors?.password?.message || ""} />
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="col-12">
                    <div className="tp-sign-in-from-remeber">
                        <div className="row">
                            <div className="col-6">
                                <div className="tp-contact-input-remeber">
                                    <input id="remember" type="checkbox" />
                                    <label htmlFor="remember">Recordarme</label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="tp-sign-in-input-remeber text-end">
                                    <Link href="/forget">¿Olvidaste tu contraseña?</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="tp-sign-in-from-btn mb-30">
                        <button type="submit" className="tp-btn w-100 text-center" disabled={isLoading}>
                            {isLoading ? "Iniciando sesión…" : "Iniciar sesión"}
                        </button>
                    </div>

                    {/* Social Login */}
                    <div className="tp-sign-in-from-subtitle-heading">
                        <h5 className="tp-sign-in-from-subtitle">O inicia sesión con</h5>
                    </div>
                    <div className="tp-sign-in-from-btn mb-30 d-flex flex-wrap gap-2 justify-content-center">
                        <button
                            type="button"
                            className="tp-btn tp-btn-border"
                            onClick={() => signIn("google", { callbackUrl })}
                        >
                            <span><AuthGoogleSvg /></span>{" "}
                            Google
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="tp-sign-in-from-register">
                        <p>¿No tienes cuenta? <Link className="textline" href="/sign-up">Regístrate ahora</Link></p>
                    </div>
                </div>
            </div>
        </form >
    );
}
