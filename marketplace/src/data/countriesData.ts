
import { ICountryDT } from "@/types/custom-interface";
import countriesImg1 from "../../public/assets/img/countries/countries-thumb-1.jpg";
import countriesImg2 from "../../public/assets/img/countries/countries-thumb-2.jpg";
import countriesImg3 from "../../public/assets/img/countries/countries-thumb-3.jpg";
import countriesImg4 from "../../public/assets/img/countries/countries-thumb-4.jpg";


const countriesData: ICountryDT[] = [
    {
        id:1,
        name: "Washington, USA",
        properties: 25,
        image: countriesImg1,
        tag: "Trusted",
        link: "/propiedades",
    },
    {
        id:2,
        name: "Basil Brown Drive",
        properties: 30,
        image: countriesImg2,
        tag: "Verified",
        link: "/propiedades",
    },
    {
        id:3,
        name: "Boundary Street",
        properties: 25,
        image: countriesImg3,
        tag: "Trusted",
        link: "/propiedades",
    },
    {
        id:4,
        name: "North Parramatta",
        properties: 18,
        image: countriesImg4,
        tag: "Trusted",
        link: "/propiedades",
    },
    {
        id:5,
        name: "Basil Brown Drive",
        properties: 30,
        image: countriesImg2,
        tag: "Verified",
        link: "/propiedades",
    },
];

export default countriesData;