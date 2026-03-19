import { Metadata } from "next";
import signInThumb from "../../../../public/assets/img/others/sign-in-thumb.jpg";
import SignInForm from "@/components/Form/auth/SignInForm";
import { getHomeConfig } from "@/lib/home-config";

export const metadata: Metadata = {
   title: "Iniciar sesión",
 };

export default async function SignIn() {
   const heroConfig = await getHomeConfig();
   const bgImage = heroConfig?.imagenHero?.url ?? signInThumb.src;
   return (
      <>
         {/* sign in area start */}
         <section className="tp-sign-in-ptb" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-6">
                     <div className="tp-sign-in-register-box p-relative text-center">
                        <div className="tp-sign-in-register-heading mb-30">
                           <h4 className="tp-sign-in-register-title">Hola de nuevo</h4>
                           <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
                        </div>
                        <div className="tp-sign-in-input-form">
                           <SignInForm />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         {/* sign in area end */}
      </>
   )
}