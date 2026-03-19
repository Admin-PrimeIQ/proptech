import { StaticImageData } from "next/image";
import { JSX } from "react";
import { IFeaturedPropertyDT } from "./property-d-t";
import { FieldError } from "react-hook-form";

export interface AppContextType {
  openOffcanvas: boolean;
  setOpenOffcanvas: React.Dispatch<React.SetStateAction<boolean>>;
  toggleOffcanvas: () => void;
  toggleOpen: () => void;
  isOpen: boolean;
  isEnter:boolean;
  handleMouseEnter:() => void;
  handleMouseLeave:() => void;
}
//define interface for PageParams props
export interface PageParamsProps {
  params: Promise<{ id: number }>;
}

//define interface for Choose item props
export interface ChooseItemProps {
  icon: JSX.Element;
  title: string;
  description: string;
  isActive?: boolean;
}
//define interface for award item props
export interface AwardItemProps {
  title: string;
  date: string;
  description: string;
  image: StaticImageData;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>, selector: string) => void;
}
//define interface for counter
export interface ICounterDT {
  title?: string;
  count: number;
  unit: string;
  borderClass?: string;
  description: JSX.Element;
}
//define interface for home banner
export interface IBannerDT {
  title: string;
  subtitle: string;
  bgImage: StaticImageData
}
//define interface for FAQ
export interface IFAQItemDT {
  id: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

//define interface for feature props
export interface featuresProps {
  item: IFeaturedPropertyDT;
}

//define interface for Countries
export interface ICountryDT {
  id: number
  name: string;
  properties: number;
  image: StaticImageData;
  tag: string;
  link: string;
}
//define interface for Company Item Props
export interface CompanyItemProps {
  label: string;
  value: number;
  suffix?: string;
  index: number;
}

// Interface for review data
export interface Review {
  name: string;
  date: string;
  comment: string;
  avatar: StaticImageData;
}

//define interface for Sorting List Props
export interface ISortingHandlerProps {
  handleSorting: () => void;
}

// Fetch the data based on the provided 'id' prop
export interface IdProps {
  id: number;
};

//define interface for Property List Props
export interface IFeatureListProps {
  item: IFeaturedPropertyDT
}
//define interface for contact location
export interface ContactLocation {
  title: string;
  address: JSX.Element;
  phone: string;
  email: string;
}
//define interface for Sign Up form data
export interface ISignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  remember?: boolean;
}

// Interface for contact form data
export interface IContactFormTwoData {
  name: string;
  email: string;
  number: string;
  subject: string;
  message: string;
}

// Props for contact input field
export interface IContactInputProps {
  top_cls?: string;
  label?: string;
  id: string;
  type: string;
  placeholder: string;
  required?: boolean;
  error?: FieldError;
  value?: string;
}
// Interface for contact form data
export interface IleaveMessageFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}
// Interface for property review form data (Comparte tu opinión)
export interface IPropertyReviewFormData {
  name: string;
  email: string;
  number: string;
  message: string;
  termsAccepted: boolean;
}
//define interface for Portfolio Item Props 
export interface IPortfolio {
  image: StaticImageData;
  title: string;
  location: string;
  area: string;
  link: string;
  delay: string;
}
//define interface for pricing Props 
export interface IPricingProps {
  name: string;
  price: string;
  delay: string;
  active?: boolean | undefined
}
//define interface for Pricing Item Props 
export interface PricingItemProps {
  title: string;
  price: string;
  discount: string;
  isActive?: boolean;
};

// Progress Data Interface
export interface ProgressData {
  title: string;
  value: number;
  counter: string;
}
//define interface for feature Props
export interface featureProps {
  sectionClass?: string;
  paddingClass?: string;
  bgColor?: string;
}
//define interface for review data
export interface IReviewDT {
  id: number,
  name: string;
  date: string;
  text: string;
  image: StaticImageData
}
//define interface for Recently Viewed data
export interface IRecentlyViewedItem {
  image: StaticImageData;
  link: string;
  title: string;
  price: string;
}
//define interface for service data
export interface IServiceDT {
  icon: string;
  title: string;
  count: string;
}