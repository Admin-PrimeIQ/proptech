"use client"
import { IPropertyReviewFormData } from "@/types/custom-interface";
import { propertyReviewSchema } from "@/schemas/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ErrorMessage from "./ErrorMassage";
import { toast } from "sonner";

const SIGN_IN_PATH = "/sign-in";
const PROPERTY_DETAILS_PATH = "/property-details-2";

interface PropertyReviewFormProps {
    idPropiedad?: string | null;
}

export default function PropertyReviewForm({ idPropiedad }: PropertyReviewFormProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IPropertyReviewFormData>({
        resolver: yupResolver(propertyReviewSchema),
        defaultValues: { termsAccepted: false },
    });

    const isAuthenticated = status === "authenticated" && !!session?.user;

    const redirectToSignIn = () => {
        if (idPropiedad) {
            const callbackUrl = encodeURIComponent(`${PROPERTY_DETAILS_PATH}/${idPropiedad}`);
            router.replace(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`);
        } else {
            router.replace(SIGN_IN_PATH);
        }
        toast.info("Inicia sesión para enviar tu reseña");
    };

    const onSubmit = async (data: IPropertyReviewFormData) => {
        if (!isAuthenticated) {
            redirectToSignIn();
            return;
        }
        try {
            const body: Record<string, string> = {
                nombreCompleto: data.name.trim(),
                email: data.email.trim(),
                numeroTelefono: data.number.trim(),
                mensaje: data.message.trim(),
            };
            if (idPropiedad) body.idPropiedad = idPropiedad;
            const res = await fetch("/api/customer-reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (res.status === 401) {
                redirectToSignIn();
                return;
            }
            if (!res.ok) {
                toast.error(json?.error ?? "Error al enviar la reseña.");
                return;
            }
            toast.success("Tu reseña se ha enviado.");
            reset();
        } catch {
            toast.error("Error al enviar la reseña.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="tp-property-details-review">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tp-property-details-input">
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                {...register("name")}
                            />
                            {errors.name && <ErrorMessage message={errors.name.message} />}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-property-details-input">
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                            />
                            {errors.email && <ErrorMessage message={errors.email.message} />}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-property-details-input">
                            <input
                                type="text"
                                placeholder="Número de teléfono"
                                {...register("number")}
                            />
                            {errors.number && <ErrorMessage message={errors.number.message} />}
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="tp-property-details-input">
                            <textarea
                                placeholder="Escribe un mensaje"
                                {...register("message")}
                            />
                            {errors.message && <ErrorMessage message={errors.message.message} />}
                        </div>
                        <div className="tp-contact-input-remeber">
                            <input
                                id="review-terms"
                                type="checkbox"
                                {...register("termsAccepted")}
                            />
                            <label htmlFor="review-terms">
                                Al enviar este formulario estoy de acuerdo con sus términos de uso
                            </label>
                        </div>
                        {errors.termsAccepted && (
                            <ErrorMessage message={errors.termsAccepted.message} />
                        )}
                        <div className="tp-proeprty-details-btn">
                            <button type="submit" className="tp-btn">Enviar reseña</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
