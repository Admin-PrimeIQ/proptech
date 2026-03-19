
import errorThumb from "../../public/assets/img/others/error-thumb.png"
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Not Found (404)",
  };

export default function NotFound() {
    return (
     <>
          {/* error area start */}
          <section className="tp-error-ptb pb-120">
          <div className="container">
              <div className="row">
                  <div className="col-lg-12">
                      <div className="tp-error-wrapper text-center">
                          <div className="tp-error-thumb">
                              <Image style={{width:"100%", height:"auto"}} src={errorThumb} alt="error thumb" />
                          </div>
                          <div className="tp-error-content">
                              <h4 className="tp-section-title">You entered the wrong door...</h4>
                              <Link href="/" className="tp-btn">
                                  <span className="btn-wrap">
                                      <b className="text-1">Back to Homepage</b>
                                      <b className="text-2">Back to Homepage</b>
                                  </span>
                              </Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
         {/* error area end */}
     </>
  )}