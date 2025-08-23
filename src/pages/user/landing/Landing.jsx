import { useEffect, useState } from "react";
import { AboutUsSection } from "./landing-components/AboutUsSection";
import { getBannerApi } from "../../../apis/api";
import { RecentNewsSection } from "./landing-components/RecentNewsSection";
import { ChooseUs } from "./landing-components/ChooseUs";
import model from "../../../assets/images/model.png";
import ncc from "../../../assets/images/nccs.png";
import ofqual from "../../../assets/images/ofqual.png";
import { ClientTestimonial } from "./landing-components/ClientTestimonial";

export const Landing = ({ institutionProfile }) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBannerApi();
        if (res.data.success && res.data.result.length > 0) {
          setBanners(res.data.result.slice(0, 2)); // max 2 banners
        }
      } catch (err) {
        console.error("Error fetching banners", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Switch banner infos if more than 1
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const currentBanner = banners[currentIndex];

  return (
    <>
      <div>
        <section className="relative top-20 mb-40 w-full text-white">
          <div className="relative w-full min-h-[60vh] sm:min-h-[80vh] md:min-h-[70vh] lg:min-h-[90vh] flex flex-col lg:flex-row items-center px-6 md:px-12 lg:px-20">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-custom-gradient" />

            {/* Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-14 h-14 sm:w-20 sm:h-20 bg-white/10 rounded-full animate-float top-10 left-6 sm:left-10"></div>
              <div className="absolute w-20 h-20 sm:w-32 sm:h-32 bg-white/5 rounded-full animate-float-slow top-1/4 right-10 sm:right-20"></div>
              <div className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-white/15 rounded-full animate-float bottom-10 left-1/4"></div>
            </div>

            {/* Text Content */}
            <div className="relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 mt-12 lg:mt-0">
              <h1
                key={currentIndex}
                className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight opacity-0 animate-slide-in-right"
              >
                {currentBanner?.title || ""}
              </h1>
              <p
                key={`desc-${currentIndex}`}
                className="mt-3 sm:mt-4 md:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl lg:leading-relaxed max-w-xl md:max-w-2xl opacity-0 animate-slide-in-right-slow"
              >
                {currentBanner?.description || ""}
              </p>

              {/* Logos */}
              <div className="mt-6 md:mt-8 lg:mt-10 flex gap-4 sm:gap-6 items-center">
                <img
                  src={ncc}
                  className="h-6 sm:h-8 md:h-10 lg:h-14 object-contain"
                />
                {/* <div className="border-r-2 border-white h-6 sm:h-8 md:h-10 lg:h-14" />
                <img
                  src={ofqual}
                  className="h-6 sm:h-8 md:h-10 lg:h-14 object-contain"
                /> */}
              </div>
            </div>

            {/* Right Model Image */}
            <div className="absolute bottom-0 left-1/2 lg:left-auto lg:right-20 transform -translate-x-1/2 lg:translate-x-0 z-10 w-full lg:w-1/2 flex justify-center lg:justify-end">
              <img
                src={model}
                alt="Model"
                className="max-h-[40vh] sm:max-h-[50vh] md:max-h-[40vh] lg:max-h-[75vh] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </section>
      </div>
      <AboutUsSection />
      <ChooseUs />
      <ClientTestimonial />
      <RecentNewsSection />
    </>
  );
};
