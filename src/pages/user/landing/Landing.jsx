import { useEffect, useState } from "react";
import { AboutUsSection } from "./landing-components/AboutUsSection";
import { getBannerApi } from "../../../apis/api";
import { RecentNewsSection } from "./landing-components/RecentNewsSection";
import { ChooseUs } from "./landing-components/ChooseUs";
import webbanner from "../../../assets/images/wbanner.png";
import mobbanner from "../../../assets/images/mbanner.png";
// import model from "../../../assets/images/girl-reading-book.png";
import model from "../../../assets/images/banner-girl.png";
import { ClientTestimonial } from "./landing-components/ClientTestimonial";

export const Landing = ({ institutionProfile }) => {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const res = await getBannerApi();
        if (res.data.success && res.data.result.length > 0) {
          const banner = res.data.result[0];

          setBannerTitle(banner.title || "");
          setBannerDescription(banner.description || "");

          const updateImage = () => {
            const isMobile = window.innerWidth <= 820; // Change image when below 820px
            // setHeroImage(
            //   `${process.env.REACT_APP_API_URL}/uploads/${
            //     isMobile ? banner.mobileImage : banner.desktopImage
            //   }`
            // );
            setHeroImage(isMobile ? mobbanner : webbanner);
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
            <section className="hero-section">
              <div className="hero-container">
                <img src={heroImage} alt="Hero" className="hero-bg" />

                {/* Overlay */}
                <div className="hero-overlay"></div>

                {/* Model */}
                <img src={model} alt="Model" className="hero-model" />

                {/* Text */}
                <div className="hero-text">
                  <h1>{bannerTitle}</h1>
                  <p>{bannerDescription}</p>
                </div>
              </div>
            </section>
          )
        )}
      </div>
      <AboutUsSection />
      <ChooseUs />
      <ClientTestimonial/>
      {/* <OurMotto /> */}
      <RecentNewsSection />
    </>
  );
};
