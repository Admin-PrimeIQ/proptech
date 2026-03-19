import ForgotForm from "@/components/Form/auth/ForgotForm";
import signInThumb from "../../../../public/assets/img/others/sign-in-thumb.jpg";
import { Metadata } from "next";
import { getHomeConfig } from "@/lib/home-config";

export const metadata: Metadata = {
  title: "Reinicio de contraseña",
};

export default async function Forget() {
  const heroConfig = await getHomeConfig();
  const bgImage = heroConfig?.imagenHero?.url ?? signInThumb.src;
  return (
    <>
      {/* -- forget area start -- */}
      <section className="tp-sign-in-ptb pt-250 pb-95" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="tp-sign-in-register-box p-relative text-center">
                <div className="tp-sign-in-register-heading mb-30">
                  <h4 className="tp-sign-in-register-title">Reinicio de contraseña</h4>
                  <p>Ingrese su correo electrónico para solicitar un reinicio de contraseña.</p>
                </div>
                <div className="tp-sign-in-input-form">
                  <ForgotForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* -- forget area end -- */}
    </>
  );
}