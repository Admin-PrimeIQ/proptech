import { ITeamDT } from "@/types/team-d-t";
import teamImg1 from "../../public/assets/img/team/team-thumb-1.jpg";
import teamImg2 from "../../public/assets/img/team/team-thumb-2.jpg";
import teamImg3 from "../../public/assets/img/team/team-thumb-3.jpg";
import teamImg4 from "../../public/assets/img/team/team-thumb-4.jpg";
import teamImg5 from "../../public/assets/img/team/team-thumb-6.jpg";

//home three team image
import teamImg6 from "../../public/assets/img/team/home-3/team-thumb-1.jpg";
import teamImg7 from "../../public/assets/img/team/home-3/team-thumb-2.jpg";
import teamImg8 from "../../public/assets/img/team/home-3/team-thumb-3.jpg";
//team agency image 
import AgencyImg1 from "../../public/assets/img/team/team/agent-1.jpg";
import AgencyImg2 from "../../public/assets/img/team/team/agent-2.jpg";
import AgencyImg3 from "../../public/assets/img/team/team/agent-3.jpg";
import AgencyImg4 from "../../public/assets/img/team/team/agent-4.jpg";
import AgencyImg5 from "../../public/assets/img/team/team/agent-5.jpg";

// Related Agency Image
import AgencyImg6 from "../../public/assets/img/listing/home-3/thumb-1.jpg";
import AgencyImg7 from "../../public/assets/img/listing/home-3/thumb-2.jpg";
import AgencyImg8 from "../../public/assets/img/listing/home-3/thumb-3.jpg";
import AgencyImg9 from "../../public/assets/img/listing/home-3/thumb-4.jpg";

// team agent image
import teamAgentImg1 from "../../public/assets/img/team/team/team-1.jpg";
import teamAgentImg2 from "../../public/assets/img/team/team/team-2.jpg";
import teamAgentImg3 from "../../public/assets/img/team/team/team-3.jpg";
import teamAgentImg4 from "../../public/assets/img/team/team/team-4.jpg";
import teamAgentImg5 from "../../public/assets/img/team/team/team-5.jpg";

//home main data data
const teamAgentData: ITeamDT[] = [
  //home main team agent data start
  {
    id: 1,
    image: teamImg1,
    name: "Henry Pitter",
    designation: "Lead Designer",
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  {
    id: 2,
    image: teamImg2,
    name: "Lara Dutta",
    designation: "Project Manager",
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  {
    id: 3,
    image: teamImg3,
    name: "Richard Drevid",
    designation: "CEO & Founder",
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  {
    id: 4,
    image: teamImg4,
    name: "Nishi Gurain",
    designation: "Senior UI/UX Designer",
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  {
    id: 5,
    image: teamImg5,
    name: "Sophia Miller",
    designation: "Marketing Head",
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  //home main team agent data end
  //home three agent data start
  {
    id: 6,
    name: "Richard Drevid",
    designation: "CEO of Bhumi",
    image: teamImg6,
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  {
    id: 7,
    name: "Buli Tito",
    designation: "CEO of Bhumi",
    image: teamImg7,
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  {
    id: 8,
    name: "Adita Amin",
    designation: "CEO of Bhumi",
    image: teamImg8,
    socialLinks: {
      facebookLink: "https://www.facebook.com/",
      twitterLink: "https://x.com/",
      linkedinLink: "https://www.linkedin.com/",
    }
  },
  //home three agent data end
  //agent data for agent inner page
  {
    id: 9,
    name: "Henry Pitterson",
    designation: "Cushman & Wakefield",
    phone: "+999 123 456 7890",
    email: "henry.p@gmail.com",
    image: teamAgentImg1,
    listedProperty: "5 Listed Properties",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 10,
    name: "Samantha Smith",
    designation: "Coldwell Banker",
    phone: "+999 234 567 8901",
    email: "samantha.s@gmail.com",
    image: teamAgentImg2,
    listedProperty: "3 Listed Properties",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 11,
    name: "Trevis Head",
    designation: "ERA Real Estate",
    phone: "+999 345 678 9012",
    email: "trevis.h@gmail.com",
    image: teamAgentImg3,
    listedProperty: "6 Listed Properties",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 12,
    name: "Olivia Thompson",
    designation: "Century 21",
    phone: "+1 702 555 4567",
    email: "olivia.thompson@example.com",
    image: teamAgentImg4,
    listedProperty: "4 Listed Properties",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 13,
    name: "Subha Sadika",
    designation: "Keller Williams",
    phone: "+999 567 890 1234",
    email: "subha.s@gmail.com",
    image: teamAgentImg5,
    listedProperty: "2 Listed Properties",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  }
  //agent data for agent inner page
]
export default teamAgentData;

export const teamAgencyData: ITeamDT[] = [
  //agency data for agency inner page
  {
    id: 1,
    name: "Henry Pitterson",
    designation: "Cushman & Wakefield",
    phone: "+999 325 654 8596",
    email: "hi@gmail.com",
    image: AgencyImg1,
    listedProperty: "4 Listed Property",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 2,
    name: "Henry Pitterson",
    designation: "Coldwell Banker",
    phone: "+999 325 654 8596",
    email: "bhumi@gmail.com",
    image: AgencyImg2,
    listedProperty: "3 Listed Property",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 3,
    name: "Trevis Head",
    designation: "ERA Real Estate",
    phone: "+999 325 654 8596",
    email: "bhumi@gmail.com",
    image: AgencyImg3,
    listedProperty: "3 Listed Property",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 4,
    name: "Sagor Mahmud",
    designation: "Coldwell Banker",
    phone: "+999 325 654 8596",
    email: "bhumi@gmail.com",
    image: AgencyImg4,
    listedProperty: "3 Listed Property",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  {
    id: 5,
    name: "Subha Sadika",
    designation: "Keller Williams",
    phone: "+999 325 654 8596",
    email: "bhumi@gmail.com",
    image: AgencyImg5,
    listedProperty: "4 Listed Property",
    socialLinks: {
      facebookLink: "https://facebook.com",
      behanceLink: "https://behance.net",
      linkedinLink: "https://linkedin.com/in",
      instagramLink: "https://instagram.com"
    }
  },
  //agency data for agency end
  //Related team agency data start
  {
    id: 6,
    name: "Rustic farmhouse",
    address: "Level 7 Northpoint Tower",
    price: 1234,
    bedRoom: '05',
    bathsRoom: '03',
    livingArea: 1200,
    image: AgencyImg6,
    socialLinks: {
      facebookLink: "#",
      behanceLink: "#",
      linkedinLink: "#",
      instagramLink: "#"
    }
  },
  {
    id: 7,
    name: "Hawa vobon",
    address: "Level 7 Northpoint Tower",
    price: 1154,
    bedRoom: '05',
    bathsRoom: '03',
    livingArea: 1400,
    image: AgencyImg7,
    socialLinks: {
      facebookLink: "#",
      behanceLink: "#",
      linkedinLink: "#",
      instagramLink: "#"
    }
  },
  {
    id: 8,
    name: "Hotel bijoynogor",
    address: "Level 7 Northpoint Tower",
    price: 1568,
    bedRoom: '05',
    bathsRoom: '03',
    livingArea: 1300,
    image: AgencyImg8,
    socialLinks: {
      facebookLink: "#",
      behanceLink: "#",
      linkedinLink: "#",
      instagramLink: "#"
    }
  },
  {
    id: 9,
    name: "Gulshan partyhouse",
    address: "Level 7 Northpoint Tower",
    price: 2330,
    bedRoom: '05',
    bathsRoom: '03',
    livingArea: 1700,
    image: AgencyImg9,
    socialLinks: {
      facebookLink: "#",
      behanceLink: "#",
      linkedinLink: "#",
      instagramLink: "#"
    }
  }
  //Related team agency data end

];


