import WhyPartnerWithUs from "./components/WhyPartnerWithUs";
import Benefits from "./components/Benefits";
import PartnershipProcess from "./components/PartnershipProcess";
import JoinUs from "./components/JoinUs";
import Header from "./components/Header";

const BecomeAPartner = () => {
  return (
    <>
      <section className="flex flex-col gap-12 lg:gap-20 items-center justify-center my-28 px-6 md:px-[6vw] xl:px-[8vw]">
        <Header />
        <WhyPartnerWithUs />
        <Benefits />
        <PartnershipProcess />
        <JoinUs />
      </section>
    </>
  );
};

export default BecomeAPartner;
