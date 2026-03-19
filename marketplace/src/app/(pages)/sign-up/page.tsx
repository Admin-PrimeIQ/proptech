import signUpThumb from "../../../../public/assets/img/others/sign-in-thumb.jpg";
import SignUpForm from "@/components/Form/auth/SignUpForm";
import { Metadata } from "next";
import { getHomeConfig } from "@/lib/home-config";

export const metadata: Metadata = {
   title: "Registrarse",
 };

export default async function SignUp() {
   const heroConfig = await getHomeConfig();
   const bgImage = heroConfig?.imagenHero?.url ?? signUpThumb.src;
   return (
      <>
         {/* -- sign in area start -- */}
          <section className="tp-sign-in-register-ptb tp-register-compact" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-6">
                     <div className="tp-sign-in-register-box p-relative text-center">
                        <div className="tp-sign-in-register-heading">
                           <h4 className="tp-sign-in-register-title">¡Regístrate ahora!</h4>
                        </div>
                        <div className="tp-sign-in-input-form">
                          <SignUpForm/>
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