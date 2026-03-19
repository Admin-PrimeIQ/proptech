import { StaticImageData } from "next/image";

export interface IBlogDT {
  id: number;
  image: StaticImageData;
  category: string;
  readTime?: string;
  title: string;
  authorImage?: StaticImageData;
  authorName?: string;
  authorRole?: string;
  delay: string;
  date?: string,
  month?: string;
  description?: string
}

//define interface for Comment item 
export interface ICommentDT {
  id: number;
  author: string;
  date: string;
  text: string;
  image: StaticImageData;
  isChild?: boolean;
}
//define interface for recent post blog sidebar
export interface RecentPost {
  id: number;
  image: StaticImageData;
  title: string;
  date: string;
}

// Interface for blog comment form data
export interface IblogCommentFormData {
  name: string;
  email: string;
  number: string;
  message: string;
}
// Interface for contact two form data
export interface IContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  caseDetails: string;
}