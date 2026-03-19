"use client";
import { getCurrentYear } from "@/components/Utils/getCurrentYear";
import { useConfiguracionGeneral } from "@/hooks/useConfiguracionGeneral";

export default function FooterCopyright() {
    const { configuracion, loading } = useConfiguracionGeneral();
    
    return (
        <div className="tp-footer-copyright-ptb pt-20 pb-20">
            <div className="row">
                <div className="col-lg-12">
                    <div className="tp-footer-copyright text-center">
                        <p>© {getCurrentYear()} {loading ? "..." : (configuracion.nombreEmpresa || "Bhumi")}. All images are for demo purposes.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
