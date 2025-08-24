import { useEffect, useState } from "react";
import { getMottoApi } from "../../../apis/api";
import { motion } from "framer-motion";
import { TbTargetArrow } from "react-icons/tb";

const OurMotto = () => {
  const [mottoData, setMottoData] = useState(null);

  useEffect(() => {
    const fetchMottoData = async () => {
      try {
        const response = await getMottoApi();
        if (response.data.success) {
          setMottoData(response.data.result);
        } else {
          console.error("Failed to fetch motto data.");
        }
      } catch (error) {
        console.error("Error fetching motto data:", error);
      }
    };

    fetchMottoData();
  }, []);

  if (!mottoData) {
    return (
      <section className="w-full pb-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="h-10 w-2/3 mx-auto bg-gray-300 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-8 bg-white border border-gray-200 shadow-lg animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="h-4 w-3/4 bg-gray-300 mx-auto rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-300 mx-auto rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pb-32">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative text-3xl md:text-4xl font-extrabold text-[#262a2b] mb-14"
        >
          {mottoData.motoTitle}
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200"
          >
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-[#204081]/10">
              <TbTargetArrow size={40} className="text-[#204081]" />
            </div>
            <h3 className="text-xl font-bold text-[#204081] mb-3">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed text-base text-justify">
              {mottoData.mission.text}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200"
          >
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-[#d91b1a]/10">
              <TbTargetArrow size={40} className="text-[#d91b1a]" />
            </div>
            <h3 className="text-xl font-bold text-[#d91b1a] mb-3">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed text-base text-justify">
              {mottoData.vision.text}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurMotto;
