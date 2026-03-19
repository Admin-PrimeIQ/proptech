

export default function MapMarkerSvg({color="#292D32"}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1.71753 5.83498V13.1325C1.71753 14.5575 2.73003 15.1425 3.96003 14.4375L5.72253 13.4325C6.10503 13.215 6.74253 13.1925 7.14003 13.395L11.0775 15.3675C11.475 15.5625 12.1125 15.5475 12.495 15.33L15.7425 13.47C16.155 13.23 16.5 12.645 16.5 12.165V4.86748C16.5 3.44248 15.4875 2.85748 14.2575 3.56248L12.495 4.56748C12.1125 4.78498 11.475 4.80748 11.0775 4.60498L7.14003 2.63998C6.74253 2.44498 6.10503 2.45998 5.72253 2.67748L2.47503 4.53748C2.05503 4.77748 1.71753 5.36248 1.71753 5.83498Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.41992 3V12.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.7974 4.96509V15.0001" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}