
import React from 'react';

    export default function CartSvg({width="22", height="22"}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            enableBackground= 'new 0 0 512 512' 
            xmlSpace="preserve"
            className=""
        >
            <g>
                <path
                    d="M28 6h-5a1 1 0 0 0 0 2h5a1 1 0 0 1 .982 1.207l-2.1 8.04a1 1 0 0 1-.963.753H10.791L8.438 8H15a1 1 0 0 0 0-2H7.967l-.995-4.229A1 1 0 0 0 6 1H2a1 1 0 0 0 0 2h3.207l3.535 15.026A2.994 2.994 0 0 0 6 21a3.026 3.026 0 0 0 3 3h17a1 1 0 0 0 0-2H9a1.019 1.019 0 0 1-1-1 1 1 0 0 1 1-1h16.92a3 3 0 0 0 2.9-2.247l2.107-8.068A3.006 3.006 0 0 0 28 6zM23 25a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1zM12 25a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"
                    fill="currentColor"
                    opacity="1"
                />
                <path
                    d="M19 4a1 1 0 0 0-1 1v5.586l-.293-.293a1 1 0 0 0-1.414 1.414l2 2a1.014 1.014 0 0 0 1.416 0l2-2a1 1 0 0 0-1.414-1.414l-.295.293V5a1 1 0 0 0-1-1z"
                    fill="currentColor"
                    opacity="1"
                />
            </g>
        </svg>
    );
};


