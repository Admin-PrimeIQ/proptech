
import BackToTop from '@/components/Common/BackToTop';
import FooterStyleTwo from '@/layouts/Footers/FooterStyleTwo';
import CommonHeader from '@/layouts/Headers/CommonHeader';
import Wrapper from '@/layouts/Wrapper';
import React from 'react';

export default function FavoritosLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Wrapper>
                <CommonHeader />
                {children}
                <FooterStyleTwo />
                <BackToTop />
            </Wrapper>
        </>
    )
}
