
export default function MyPropertiesSvg({ width = 18, height = 18, color = "currentColor" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
            <path
                d="M1.5 16.5H16.5"
                stroke={color}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.21094 16.5009L2.24844 7.47841C2.24844 7.02091 2.46594 6.58595 2.82594 6.30095L8.07594 2.21344C8.61594 1.79344 9.37344 1.79344 9.92094 2.21344L15.1709 6.29344C15.5384 6.57844 15.7484 7.01341 15.7484 7.47841V16.5009"
                stroke={color}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinejoin="round"
            />
            <path
                d="M11.625 8.25H6.375C5.7525 8.25 5.25 8.7525 5.25 9.375V16.5H12.75V9.375C12.75 8.7525 12.2475 8.25 11.625 8.25Z"
                stroke={color}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
