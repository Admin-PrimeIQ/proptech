"use client";

import { IContactFormTwoData } from "@/types/custom-interface";
import { contactSchema } from "@/schemas/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMassage";
import { toast } from "sonner";

export default function ContactFormTwo() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IContactFormTwoData>({
        resolver: yupResolver(contactSchema),
    });

    const onSubmit = () => {
        toast.success("Thank you for reaching out! We've received your message and will respond soon.");
        reset();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
                <div className="tp-contact-inner-form">
                    <div className="row">
                        <div className="col-xl-6 col-lg-6">
                            <div className="tp-sign-in-input-box">
                                <div className="tp-contact-input p-relative">
                                    <input type="text" {...register("name")} placeholder="Full name" />
                                    <ErrorMessage message={errors.name?.message || ""} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6">
                            <div className="tp-sign-in-input-box">
                                <div className="tp-contact-input p-relative">
                                    <input type="email" {...register("email")} placeholder="Email address" />
                                    <ErrorMessage message={errors.email?.message || ""} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6">
                            <div className="tp-sign-in-input-box">
                                <div className="tp-contact-input p-relative">
                                    <input type="text" {...register("number")} placeholder="Phone number" />
                                    <ErrorMessage message={errors.number?.message || ""} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6">
                            <div className="tp-sign-in-input-box">
                                <div className="tp-contact-input p-relative">
                                    <input type="text" {...register("subject")} placeholder="Subject" />
                                    <ErrorMessage message={errors.subject?.message || ""} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                        <div className="tp-sign-in-input-box">
                            <div className="tp-contact-input p-relative">
                                <textarea {...register("message")} placeholder="Write your message"></textarea>
                            <ErrorMessage message={errors.message?.message || ""} />
                            </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="tp-contact-btn-box d-flex flex-wrap justify-content-between align-items-center">
                                <label>
                                    We are committed to protecting your privacy. We will never collect information <br />
                                    about you without your explicit consent.
                                </label>
                                <div className="tp-contact-btn">
                                    <button type="submit" className="tp-btn">Send message</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="ajax-response mt-1 mb-0"></p>
                </div>
            </form>
        </>
    );
}
