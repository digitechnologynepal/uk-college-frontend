import React, { useEffect, useState, useRef } from "react";
import { getAllTestimonialsApi } from "../../../../apis/api";
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const COLORS = ["#FDE2E4", "#E0F7FA", "#FFF3E0", "#E8F5E9", "#F3E5F5"];

export const ClientTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await getAllTestimonialsApi();
        setTestimonials(res.data?.result || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTestimonials();
  }, []);

  const getRandomColor = (index) => COLORS[index % COLORS.length];

  if (testimonials.length === 0) return null;

  return (
    <section className="mb-24 bg-[#f0f4ff] py-16">
      <div className="max-w-6xl mx-auto relative px-6">
        <h2 className="text-4xl font-bold text-center text-[#204081] mb-12">
          Hear From Our Clients
        </h2>

        {/* Custom Arrows */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-[#204081] bg-white p-4 rounded-full shadow-lg hover:bg-[#204081] hover:text-white transition duration-300"
        >
          <FaArrowLeft size={18} />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-[#204081] bg-white p-4 rounded-full shadow-lg hover:bg-[#204081] hover:text-white transition duration-300"
        >
          <FaArrowRight size={18} />
        </button>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={testimonials.length > 1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {testimonials.map((t, i) => {
            const hasImage = !!t?.image;
            return (
              <SwiperSlide key={i} className="px-2 py-4">
                <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 p-10 mx-auto max-w-3xl flex flex-col items-center overflow-visible pt-20">
                  {/* Quote Icon */}
                  <FaQuoteLeft className="absolute top-6 left-6 text-[#204081]/20 w-12 h-12" />

                  {/* Avatar */}
                  <div className="absolute top-5">
                    {hasImage ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${t.image}`}
                        alt={t?.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white"
                        style={{ backgroundColor: getRandomColor(i) }}
                      >
                        {t?.name ? t.name[0].toUpperCase() : "U"}
                      </div>
                    )}
                  </div>

                  {/* Name & Role */}
                  <div className="flex flex-col items-center mt-20 text-center">
                    <span className="font-bold text-[#262a2b] text-lg">
                      {t?.name}
                    </span>
                    <span className="text-gray-500 text-sm">{t?.role}</span>
                  </div>

                  {/* Testimonial */}
                  <p className="mt-6 text-[#262a2b] text-lg md:text-xl text-center leading-relaxed">
                    {t?.description}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};
