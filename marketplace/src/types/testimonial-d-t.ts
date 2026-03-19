import { StaticImageData } from "next/image";

export interface ITestimonialIDT {
    id:number;
    image: StaticImageData;
    name: string;
    description: string;
    role?:string
}