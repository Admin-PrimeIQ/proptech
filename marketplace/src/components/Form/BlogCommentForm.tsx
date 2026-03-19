"use client";
import { blogCommentSchema } from "@/schemas/validationSchema";
import { selectWideOptions } from "@/data/dropdownData";
import { IblogCommentFormData } from "@/types/blog-d-t";
import { yupResolver } from "@hookform/resolvers/yup";
import NiceSelect from "../UI/NiceSelect";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMassage";
import { toast } from "sonner";

export default function BlogCommentForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IblogCommentFormData>({
        resolver: yupResolver(blogCommentSchema),
    });

    //select change
    const onSortChange = () => { };

    //submit form hendler
    const onSubmit = (data: IblogCommentFormData) => {
        console.log(data)
        toast.success("Form submitted successfully!");
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-lg-6">
                    <div className="tp-property-details-input">
                        <input type="text" {...register("name")} placeholder="Full name" />
                        {errors.name && <ErrorMessage message={errors.name.message} />}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="tp-property-details-input">
                        <input type="text" {...register("email")} placeholder="Email address" />
                        {errors.email && <ErrorMessage message={errors.email.message} />}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="tp-property-details-input">
                        <input type="text" {...register("number")} placeholder="Phone number" />
                        {errors.number && <ErrorMessage message={errors.number.message} />}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="tp-property-details-select tp-select">
                        <NiceSelect
                            options={selectWideOptions}
                            defaultCurrent={0}
                            onChange={onSortChange}
                            name="Sorting"
                            cls="select wide"
                        />
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="tp-property-details-input">
                        <textarea {...register("message")} placeholder="Write your message"></textarea>
                        {errors.message && <ErrorMessage message={errors.message.message} />}
                    </div>
                    <div className="tp-contact-input-remeber">
                        <input id="remeber" type="checkbox" />
                        <label htmlFor="remeber">By submitting this form I agree to terms of use</label>
                    </div>
                    <div className="tp-proeprty-details-btn">
                        <button className="tp-btn" type="submit">Submit Review</button>
                    </div>
                </div>
            </div>
        </form>
    );
}