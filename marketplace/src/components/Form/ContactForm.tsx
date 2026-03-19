"use client";

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { IContactFormValues } from '@/types/blog-d-t';
import { contactTwoSchema } from '@/schemas/validationSchema';
import ErrorMessage from './ErrorMassage';

interface ContactFormProps {
  btnClass?: string;
}

export default function ContactForm({ btnClass = "tp-contact-btn" }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IContactFormValues>({
    resolver: yupResolver(contactTwoSchema),
  });

  const onSubmit = () => {
    toast.success("Your message has been sent successfully!");
    reset();
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row tp-gx-20">
        <div className="col-lg-6">
          <div className="tp-contact-input">
            <input type="text" {...register("firstName")} placeholder="First name" />
            {errors.firstName && <ErrorMessage message={errors.firstName.message} />}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="tp-contact-input">
            <input type="text" {...register("lastName")} placeholder="Last name" />
            {errors.lastName && <ErrorMessage message={errors.lastName.message} />}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="tp-contact-input">
            <input type="email" {...register("email")} placeholder="Email address" />
            {errors.email && <ErrorMessage message={errors.email.message} />}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="tp-contact-input">
            <input type="text" {...register("phone")} placeholder="Phone number" />
            {errors.phone && <ErrorMessage message={errors.phone.message} />}
          </div>
        </div>

        <div className="col-lg-12">
          <div className="tp-contact-input">
            <textarea placeholder="Your message" {...register("caseDetails")}></textarea>
            {errors.caseDetails && <ErrorMessage message={errors.caseDetails.message} />}
          </div>
        </div>
      </div>

      <div className={btnClass}>
        <button type="submit" className="tp-btn">Send Message</button>
      </div>
    </form>
  );
}
