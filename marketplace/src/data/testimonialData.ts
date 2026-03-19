
import { ITestimonialIDT } from "@/types/testimonial-d-t";
//home testimonial image
import userImg1 from "../../public/assets/img/rent/rent-user-2.png";
import userImg2 from "../../public/assets/img/rent/rent-user-3.png";
import userImg3 from "../../public/assets/img/rent/rent-user-4.png";

//home three testimonial image
import image1 from "../../public/assets/img/testimonial/home-3/testimonial-3-1.png";
import image2 from "../../public/assets/img/testimonial/home-3/testimonial-3-2.png";

export const testimonials_home: ITestimonialIDT[] = [
    {
        id: 1,
        description: "Is it possible to Love your credit card processor? With Bhumi, yes!",
        image: userImg1,
        name: "Lana Rey",
        role: "Founder & Leader",
    },
    {
        id: 2,
        description: "Is it possible to Love your credit card processor? With Bhumi, yes!",
        image: userImg2,
        name: "Haria De",
        role: "Founder & Leader",
    },
    {
        id: 3,
        description: "Is it possible to Love your credit card processor? With Bhumi, yes!",
        image: userImg3,
        name: "Bulbi Ti",
        role: "Founder & Leader",
    },
    {
        id: 4,
        description: "Is it possible to Love your credit card processor? With Bhumi, yes!",
        image: userImg2,
        name: "Haria De",
        role: "Founder & Leader",
    },
];

export const testimonial_three_data: ITestimonialIDT[] = [
    {
        id: 5,
        image: image1,
        name: "Richard Drevid",
        description: `Whether you’re looking for a single-family home high-rise apartment, or something in between we’ll help you find it.`
    },
    {
        id: 6,
        image: image2,
        name: "Liza Olivares",
        description: `Whether you’re looking for a single-family home high-rise apartment, or something in between we’ll help you find it.`
    },
    {
        id: 7,
        image: image1,
        name: "Richard Drevid",
        description: `Whether you’re looking for a single-family home high-rise apartment, or something in between we’ll help you find it.`
    },
    {
        id: 8,
        image: image2,
        name: "Liza Olivares",
        description: `Whether you’re looking for a single-family home high-rise apartment, or something in between we’ll help you find it.`
    }
];


export const testimonial_data = [
    ...testimonials_home,
    ...testimonial_three_data,
]