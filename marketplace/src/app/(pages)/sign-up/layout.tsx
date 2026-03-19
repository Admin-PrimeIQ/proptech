import BackToTop from '@/components/Common/BackToTop';
import CommonFooter from '@/layouts/Footers/CommonFooter';
import CommonHeader from '@/layouts/Headers/CommonHeader';
import Wrapper from '@/layouts/Wrapper';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Wrapper>
                <CommonHeader wrapClass='tp-header-transparent'/>
                {children}
                <CommonFooter className='pt-100' />
                <BackToTop />
            </Wrapper>
        </>
    )
}
