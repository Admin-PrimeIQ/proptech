
import CommonHeader from '@/layouts/Headers/CommonHeader';
import BackToTop from '@/components/Common/BackToTop';
import Wrapper from '@/layouts/Wrapper';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Wrapper>
                <CommonHeader wrapClass='tp-header-transparent'/>
                {children}
                <BackToTop />
            </Wrapper>
        </>
    )
}
