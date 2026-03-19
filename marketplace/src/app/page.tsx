import CommonHeader from "@/layouts/Headers/CommonHeader";
import HomeOnePage from "./(homes)/home-one/page";
import BackToTop from "@/components/Common/BackToTop";
import Wrapper from "@/layouts/Wrapper";
import CommonFooter from "@/layouts/Footers/CommonFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Bhumi Real Estate React NextJs Template",
};

const Home = () => {
  return (
    <>
      <Wrapper>
        <CommonHeader />
        <main>
          <HomeOnePage />
        </main>
        <BackToTop />
        <CommonFooter />
      </Wrapper>
    </>
  );
};

export default Home;
