import { ReactNode } from "react";
import Sidebar from "./subComponents/DashboardSidebar";
import CommonHeader from "./Headers/CommonHeader";
import Wrapper from "./Wrapper";
import BackToTop from "@/components/Common/BackToTop";
import PermissionGuard from "./PermissionGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Wrapper>
                <CommonHeader />
                <main>
                    <div className="tp-dashboard-wrapper">
                        <Sidebar />
                        <div className="tp-dashboard-main">
                            <PermissionGuard>{children}</PermissionGuard>
                        </div>
                    </div>
                </main>
                <BackToTop />
            </Wrapper>
        </>
    );
}
