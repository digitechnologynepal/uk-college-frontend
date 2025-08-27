import React, { useEffect, useState, useRef } from "react";
import { getAllTestimonialsApi } from "../../../../apis/api";
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";

const COLORS = ["#204081", "#d91b1a", "#f56a79", "#627594", "#8c7c62"];

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

  const leftVariant = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const rightVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="py-16 bg-[#e7efff]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-16">
        {/* Left Column - Title */}
        <motion.div
          className="lg:w-[50%]"
          variants={leftVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold lg:font-extrabold text-[#204081] mb-0 md:mb-3 lg:mb-5 text-left">
            Voices of Experience
            <span className="block h-1 w-16 bg-[#d91b1a] rounded mt-2"></span>
          </h2>
          <p className="font-medium mt-4 text-md lg:text-xl text-gray-600 text-left">
            Hear what our community have to say about learning and collaborating
            with us.
          </p>
        </motion.div>

        {/* Right Column - Swiper */}
        <motion.div
          className="relative w-full lg:w-[50%]"
          variants={rightVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Custom Arrows */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-[#204081] bg-white p-1 md:p-3 lg:p-3 rounded-full shadow-lg hover:bg-[#204081] hover:text-white transition duration-300"
          >
            <FaArrowLeft size={16} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-[#204081] bg-white p-1 md:p-3 lg:p-3 rounded-full shadow-lg hover:bg-[#204081] hover:text-white transition duration-300"
          >
            <FaArrowRight size={16} />
          </button>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={testimonials.length > 1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {testimonials.map((t, i) => {
              const hasImage = !!t?.image;
              return (
                <SwiperSlide key={i} className="px-2 py-4">
                  <div className="justify-between h-max bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-md flex flex-col space-y-6 hover:shadow-lg transition duration-300">
                    <div>
                      <FaQuoteLeft className="text-[#d91b1a]/50 w-8 h-8 mb-6" />
                      <p className="text-gray-700 text-xs lg:text-base text-justify">
                        {t?.description}
                      </p>
                    </div>

                    <div>
                      <div className="border-t border-gray-200"></div>
                      <div className="flex justify-items-end items-center space-x-4 mt-2">
                        {hasImage ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/uploads/${t.image}`}
                            alt={t?.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                            style={{ backgroundColor: getRandomColor(i) }}
                          >
                            {t?.name ? t.name[0].toUpperCase() : "U"}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-[#204081] text-sm md:text-base">
                            {t?.name}
                          </span>
                          <span className="text-gray-500 text-xs md:text-sm">
                            {t?.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="custom-pagination mt-3 flex gap-3 justify-center" />
        </motion.div>
      </div>
    </section>
  );
};
