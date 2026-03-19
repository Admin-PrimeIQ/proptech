import { StaticImageData } from "next/image";

export interface SocialLinkProps {
  facebookLink: string;
  twitterLink?: string;
  linkedinLink: string;
  behanceLink?:string;
  instagramLink?:string
}

export interface ITeamDT {
  id: number;
  image: StaticImageData;
  designation?: string;
  name: string;
  socialLinks: SocialLinkProps;
  phone?:string;
  email?:string;
  listedProperty?:string
  price?:number;
  bedRoom?:string;
  bathsRoom?:string;
  livingArea?:number;
  address?:string;
}

export interface TeamSectionProps {
  teamMembers: ITeamDT[];
  sectionTitle: string;
  pointTitles: string[];
}