import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ContentView from "react-froala-wysiwyg/FroalaEditorView";
import { Link, useParams } from "react-router-dom";
import { getServiceBySlugApi, getServicesApi } from "../../../../apis/api";

export const ServiceDescription = () => {
  const { slug } = useParams();
  const [service, setService] = useState();
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const navRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServicesApi();
        if (response?.data?.success && Array.isArray(response?.data?.result)) {
          setAllServices(response?.data?.result);
          setLoading(false);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.log("service description error", err.message);
      }
    };
    fetchServices();
  }, []);

  async function getService() {
    setLoading(true);
    try {
      const response = await getServiceBySlugApi(slug);
      if (response?.data?.success) {
        setService(response?.data?.result);
        setLoading(false);
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        setNotFound(true);
      }
    }
  }

  useEffect(() => {
    checkScroll();
  }, [allServices]);

  const checkScroll = () => {
    if (navRef.current) {
      setCanScrollLeft(navRef.current.scrollLeft > 0);
      setCanScrollRight(
        navRef.current.scrollLeft + navRef.current.clientWidth <
          navRef.current.scrollWidth
      );
    }
  };

  const scrollNav = (direction) => {
    if (navRef.current) {
      const scrollAmount = 300;
      navRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  useEffect(() => {
    getService();
  }, [slug]);

  if (loading)
    return (
      <div className="text-lg h-screen w-full border min-h-screen flex items-center justify-center">
        <span className="font-semibold">Loading...</span>
      </div>
    );
  if (notFound)
    return (
      <div className="text-lg h-screen w-full border min-h-screen flex items-center justify-center">
        <span className="font-semibold text-[#d91b1a]">
          Service is currently not available...
        </span>
      </div>
    );

  return (
    <section className="w-full flex flex-col items-center">
      <div className="bg-[#223219] w-full flex flex-col items-center text-white ">
        <div className="py-10 mt-16 text-center">
          <h1 className="text-4xl font-bold mt-8">Our Services</h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto gap-5 pt-10 pb-20">
        <div className="w-full lg:w-96 p-4 lg:p-6 bg-[#f5f7f0] max-h-fit border lg:sticky lg:block hidden lg:top-32 top-0">
          <nav className="flex flex-col">
            {allServices?.map((service) => (
              <Link
                to={`/service-description/${service?.slug}`}
                className={`flex w-full items-center p-3 rounded cursor-pointer transition-colors ${
                  service?.slug === slug
                    ? "bg-[#3a5a2c] text-white"
                    : "bg-white text-[#3a5a2c] hover:bg-gray-100"
                }`}
              >
                <div className="w-9 h-9 flex items-center justify-center mr-2">
                  <img
                    className="w-[50px] rounded-md"
                    src={`${process.env.REACT_APP_API_URL}/uploads/${service?.image}`}
                  />
                </div>
                <span className="font-medium text-[15px]">
                  {service?.title}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="w-full relative overflow-hidden block lg:hidden md:px-14 px-3">
          <div className="bg-[#f5f7f0] relative p-3 hide-scrollbar flex items-center">
            <button
              onClick={() => scrollNav("left")}
              disabled={!canScrollLeft}
              className={`z-10 h-[70px] bg-[#3a5a2c] p-2 shadow-md transition-opacity ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronLeft color="white" size={20} />
            </button>

            <nav
              ref={navRef}
              className="flex overflow-auto hide-scrollbar whitespace-nowrap scroll-smooth"
              onScroll={checkScroll}
            >
              {allServices?.map((service) => (
                <Link
                  key={service?.slug}
                  to={`/service-description/${service?.slug}`}
                  className={`flex items-center min-w-[300px] py-3 px-3 rounded cursor-pointer transition-colors ${
                    service?.slug === slug
                      ? "bg-[#3a5a2c] text-white"
                      : "bg-white text-[#3a5a2c] hover:bg-gray-100"
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center mr-2">
                    <img
                      className="w-[50px] rounded-md"
                      src={`${process.env.REACT_APP_API_URL}/uploads/${service?.image}`}
                      alt={service?.title}
                    />
                  </div>
                  <span className="font-medium">{service?.title}</span>
                </Link>
              ))}
            </nav>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollNav("right")}
              disabled={!canScrollRight}
              className={`z-10 h-[70px] bg-[#3a5a2c] p-2 shadow-md transition-opacity ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronRight className="text-white" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="w-full mb-6 rounded-lg overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${service?.descriptionImage}`}
                alt={service?.title}
                className="w-full h-[400px] object-cover lg:object-none"
              />
            </div>
            {service?.quote && (
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-6 text-center">
                <p className="text-amber-900 font-medium">{service?.quote}</p>
              </div>
            )}
            <div
              className="space-y-6 text-gray-700 font-medium leading-[1.6]"
              style={{ fontFamily: '"Raleway", sans-serif' }}
            >
              <ContentView model={service?.description} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
