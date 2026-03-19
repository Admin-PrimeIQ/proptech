import React from 'react';

    export default function Preloader() {
    return (
        <>
            {/* -- pre loader area start -- */}
            <div id="loading">
                <div className="loader-mask">
                    <div className="loader">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            {/* -- pre loader area end -- */}
        </>
    );
};
