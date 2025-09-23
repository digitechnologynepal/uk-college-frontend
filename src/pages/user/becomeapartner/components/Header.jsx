import banner from "../../../../assets/images/becomeapartner.png";

export default function Header() {
  return (
    <>
      <div className="space-y-10">
        <div className="space-y-2 md:space-y-5 text-center max-w-7xl mx-auto px-6 md:px-6 lg:px-0">
          <p className="text-[#262a2b] font-semibold text-base md:text-lg">
            Become a Partner Center of
          </p>
          <p className="text-[#d91b1a] font-bold text-3xl md:text-4xl lg:text-5xl">
            UK <span className="text-[#204081]">COLLEGES</span>
          </p>
          <p className="text-sm md:text-base text-justify lg:text-center text-[#262a2b]">
            The UK Colleges Partner Center invites education institutions,
            training providers, and academies to join hands with us in
            delivering internationally recognized UK-accredited qualifications.
            By becoming a partner, your institution can expand its academic
            portfolio, attract more students, and gain credibility through
            recognized British standards of education.
          </p>
        </div>
        <div className="w-screen h-full lg:px-0 px-6">
          <img src={banner} className="object-cover h-[30vh] md:h-full" />
        </div>
      </div>
    </>
  );
}
