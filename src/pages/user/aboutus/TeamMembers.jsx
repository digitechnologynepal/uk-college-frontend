import React, { useEffect, useState } from "react";
import { getAllTeamMembersApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { FaEnvelope, FaThreads } from "react-icons/fa6";

const SkeletonTeam = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 max-w-7xl mx-auto">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-lg overflow-hidden shadow-md  h-max"
        >
          <div className="bg-gray-200 h-60 w-full" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
            <div className="flex space-x-2 justify-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamMembers = async () => {
    try {
      const res = await getAllTeamMembersApi();
      if (res.data.success) setTeamMembers(res.data.result);
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  if (loading) return <SkeletonTeam />;
  if (teamMembers.length === 0) return null;

  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto text-center mb-3 lg:mb-5">
        <h2 className="relative text-3xl sm:text-4xl font-bold lg:font-extrabold text-[#262a2b] mb-0 md:mb-3 lg:mb-5">
          Meet Our Team
        </h2>
        <p className="font-medium mt-2 lg:mt-4 text-md lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Talented minds behind our success
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3 lg:gap-y-7 max-w-7xl">
        {teamMembers.map((member) => (
          <div
            key={member._id}
            className="group bg-white rounded-lg overflow-hidden shadow-md  flex flex-col justify-between h-full cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${member.image}`}
                alt={member.name}
                className="w-full h-60 object-cover sm:h-64 md:h-56 lg:h-52 xl:h-48"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Info Section */}
            <div className="px-5 py-4 text-center">
              <h3 className="text-base font-semibold text-[#262a2b] my-1">
                {member.name}
              </h3>
              <p className="text-[#262a2b] capitalize text-sm mb-4">
                {member.role}
              </p>

              {/* Social Icons */}
              <div className="rounded-lg bg-[#e7efff] p-1 lg:p-2 flex flex-wrap justify-center items-center text-gray-600">
                {member.facebook && (
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    className="p-2 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
                  >
                    <FaFacebookF />
                  </a>
                )}
                {member.insta && (
                  <a
                    href={member.insta}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    className="p-2 rounded-full hover:bg-pink-100 hover:text-pink-500 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
                  >
                    <FaInstagram />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
                  >
                    <FaLinkedinIn />
                  </a>
                )}
                {member.threadLink && (
                  <a
                    href={member.threadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={member.threadLink}
                    className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
                  >
                    <FaThreads />
                  </a>
                )}
                {member.number && (
                  <a
                    href={`tel:${member.number}`}
                    title={member.number}
                    className="p-2 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
                  >
                    <FaPhoneAlt />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    title={member.email}
                    className="p-2 rounded-full hover:bg-rose-100 hover:text-rose-500 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
                  >
                    <FaEnvelope />
                  </a>
                )}
                {member.whatsapp && (
                  <a
                    href={`tel:${member.whatsapp}`}
                    title={`WhatsApp: ${member.whatsapp}`}
                    className="p-2 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
                  >
                    <FaWhatsapp />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
