import { useEffect, useState } from "react";
import { AboutUsSection } from "./landing-components/AboutUsSection";
import { getBannerApi } from "../../../apis/api";
import { RecentNewsSection } from "./landing-components/RecentNewsSection";
import { ChooseUs } from "./landing-components/ChooseUs";

export const Landing = ({ institutionProfile }) => {
  const [heroImage, setHeroImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const res = await getBannerApi();
        if (res.data.success && res.data.result.length > 0) {
          const banner = res.data.result[0];

          const updateImage = () => {
            const isMobile = window.innerWidth <= 820; // Change image when below 820px
            setHeroImage(
              `${process.env.REACT_APP_API_URL}/uploads/${
                isMobile ? banner.mobileImage : banner.desktopImage
              }`
            );
          };

          updateImage();
          window.addEventListener("resize", updateImage);

          return () => window.removeEventListener("resize", updateImage);
        }
      } catch (err) {
        console.error("Error fetching banner image", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <div className="w-full h-[90vh] animate-pulse rounded-lg bg-gray-200"></div>
        ) : (
          heroImage && (
            <img
              // initial={{ y: -10 }}
              // animate={{ y: 10 }}
              // transition={{
              //   type: "smooth",
              //   repeatType: "mirror",
              //   duration: 2,
              //   repeat: Infinity,
              // }}
              // initial={{ opacity: 0, scale: 1.05 }}
              // animate={{ opacity: 1, scale: 1 }}
              // transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity, repeatType: "mirror" }}
              src={heroImage}
              // className="w-full h-auto object-cover"
              className="w-[100vw] h-[100vh] object-cover"
              alt="Hero"
            />
          )
        )}
      </div>
      <AboutUsSection />
      <ChooseUs />
      {/* <OurMotto /> */}
      <RecentNewsSection />
    </>
  );
};
