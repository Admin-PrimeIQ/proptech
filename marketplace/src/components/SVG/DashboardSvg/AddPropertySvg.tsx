

export default function AddPropertySvg({ width = 18, height = 18, color = "currentColor" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
            <g clipPath="url(#clip0_5827_106)">
                <path
                    d="M6 12H4.0725C2.355 12 1.5 11.145 1.5 9.4275V4.0725C1.5 2.355 2.355 1.5 4.0725 1.5H7.5C9.2175 1.5 10.0725 2.355 10.0725 4.0725"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13.9258 16.5H10.4983C8.78078 16.5 7.92578 15.645 7.92578 13.9275V8.5725C7.92578 6.855 8.78078 6 10.4983 6H13.9258C15.6433 6 16.4983 6.855 16.4983 8.5725V13.9275C16.4983 15.645 15.6433 16.5 13.9258 16.5Z"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M11.1523 11.25H13.5973"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12.375 12.4723V10.0273"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_5827_106">
                    <rect width="18" height="18" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
