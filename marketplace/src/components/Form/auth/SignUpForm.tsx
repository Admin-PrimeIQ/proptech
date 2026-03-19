"use client"
import { AuthEmailSvg, AuthFacebookSvg, AuthGoogleSvg, AuthLockSvg, AuthUserSvg, ClosedEyeSvg, OpenEyeSvg } from "@/components/SVG";
import { ISignUpFormData } from "@/types/custom-interface";
import { signUpSchema } from "@/schemas/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../ErrorMassage";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ISignUpFormData>({
        resolver: yupResolver(signUpSchema),
    });

    const onSubmit = async (data: ISignUpFormData) => {
        setIsLoading(true);
        try {
            const correo = data.email.trim().toLowerCase();
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo,
                    password: data.password,
                    nombreCompleto: data.username?.trim() || null,
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                toast.error(json.error ?? "Error al registrarse.");
                return;
            }
            toast.success("Cuenta creada. Iniciando sesión…");
            const signInRes = await signIn("credentials", {
                correo,
                password: data.password,
                redirect: false,
                callbackUrl: "/dashboard",
            });
            if (signInRes?.error) {
                toast.success("Cuenta creada. Inicia sesión manualmente.");
                reset();
                return;
            }
            reset();
            if (signInRes?.url) window.location.href = signInRes.url;
        } catch {
            toast.error("Error al registrarse.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-12">
                    <div className="tp-sign-in-input-box">
                        <div className="tp-sign-in-input p-relative">
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                {...register("username")}
                            />
                            <i><AuthUserSvg /></i>
                        </div>
                        <ErrorMessage message={errors?.username?.message || ""} />
                    </div>
                </div>

                <div className="col-12">
                    <div className="tp-sign-in-input-box">
                        <div className="tp-sign-in-input p-relative">
                            <input
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Formato de correo inválido"
                                    }
                                })}
                            />
                            <i><AuthEmailSvg /></i>
                        </div>
                        <ErrorMessage message={errors?.email?.message || ""} />
                    </div>
                </div>
                <div className="col-12">
                    <div className="tp-sign-in-input-box">
                        <div className="tp-sign-in-input p-relative">
                            <div className="password-input p-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    {...register("password")}
                                />
                                <div
                                    className="tp-sign-in-input-eye password-show-toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    <i><AuthLockSvg /></i>
                                    <span
                                        id="open-eye"
                                        className="open-eye open-eye-icon"
                                        style={{ display: showPassword ? "block" : "none" }}
                                    >
                                        <OpenEyeSvg />
                                    </span>

                                    <span
                                        id="close-eye"
                                        className="open-close close-eye-icon"
                                        style={{ display: showPassword ? "none" : "block" }}
                                    >
                                        <ClosedEyeSvg />
                                    </span>

                                </div>
                            </div>
                        </div>
                        <ErrorMessage message={errors?.password?.message || ""} />
                    </div>
                </div>

                <div className="col-12">
                    <div className="tp-sign-in-input-box">
                        <div className="tp-sign-in-input p-relative">
                            <div className="password-input p-relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirmar contraseña"
                                    {...register("confirmPassword")}
                                />
                                <div
                                    className="tp-sign-in-input-eye password-show-toggle"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    <i><AuthLockSvg /></i>
                                    <span
                                        id="open-eye"
                                        className="open-eye open-eye-icon"
                                        style={{ display: showConfirmPassword ? "block" : "none" }}
                                    >
                                        <OpenEyeSvg />
                                    </span>

                                    <span
                                        id="close-eye"
                                        className="open-close close-eye-icon"
                                        style={{ display: showConfirmPassword ? "none" : "block" }}
                                    >
                                        <ClosedEyeSvg />
                                    </span>

                                </div>
                            </div>
                        </div>
                        <ErrorMessage message={errors?.confirmPassword?.message || ""} />
                    </div>
                </div>

                <div className="col-12">
                    <div className="tp-sign-in-from-remeber">
                        <div className="row">
                            <div className="col-6">
                                <div className="tp-contact-input-remeber">
                                    <input id="remember" type="checkbox" {...register("remember")} />
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                            </div>
                            <div className="col-6 text-end">
                                <div className="tp-sign-in-input-remeber text-end">
                                    <Link href="/forget">¿Olvidaste tu contraseña?</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tp-sign-in-from-btn mb-30">
                        <button type="submit" className="tp-btn w-100 text-center" disabled={isLoading}>
                        {isLoading ? "Registrando…" : "Registrarse"}
                    </button>
                    </div>
                    <div className="tp-sign-in-from-subtitle-heading">
                        <h5 className="tp-sign-in-from-subtitle">O regístrate con</h5>
                    </div>
                    <div className="tp-sign-in-from-btn mb-30 d-flex flex-wrap gap-2 justify-content-center">
                        <button
                            type="button"
                            className="tp-btn tp-btn-border"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        >
                            <span><AuthGoogleSvg /></span>{" "}
                            Google
                        </button>
                        <button
                            type="button"
                            className="tp-btn tp-btn-border"
                            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
                        >
                            <span><AuthFacebookSvg /></span>{" "}
                            Facebook
                        </button>
                    </div>
                    <div className="tp-sign-in-from-register">
                        <p>¿Ya tienes cuenta? <Link className="textline" href="/sign-in">Iniciar sesión</Link></p>
                    </div>
                </div>
            </div>
        </form>
    );
}
