
interface IFooterLinkDT{
    label:string;
    href:string
}

export const quickLinks:IFooterLinkDT[] = [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog"},
    { label: "Agency", href: "/agency" },
    { label: "Agency Details", href: "/agency-details" },
    { label: "Pricing", href: "/pricing" },
    { label: "Our FAQ", href: "/faq" },
];

export const serviceLinks:IFooterLinkDT[] = [
    { label: "Wish List", href: "/wishlist" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "Compare", href: "/compare" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Contact", href: "/contact" },
];
