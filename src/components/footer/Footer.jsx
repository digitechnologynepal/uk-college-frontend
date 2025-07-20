import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInstitutionProfileApi } from "../../apis/api";
import Logo from "../../assets/images/uk-colleges-logo-white.png";
import Accreditation1 from "../../assets/images/qualifi.png";
import Accreditation2 from "../../assets/images/ncc.png";

export const Footer = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const hidePaths = [
    "/login",
    "/admin/dashboard",
    "/admin/aboutus",
    "/admin/achievements",
    "/admin/stats",
    "/admin/applied-students",
    "/admin/test-preparation",
    "/admin/manage-courses",
    "/admin/manage-gallery",
    "/admin/course-application",
    "/admin/queries",
    "/admin/whychooseus",
    "/admin/country",
    "/admin/news",
    "/admin/manage-group",
    "/admin/manage-team-members",
    "/admin/procedures",
    "/admin/manage-clients",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInstitutionProfileApi();
        console.log("API Response:", response);

        if (response.data?.success) {
          setData(response.data.result);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (hidePaths.includes(location.pathname)) return null;

  return (
    <footer className="bg-gradient-to-t from-[#02153b] to-[#204081] text-white pt-12 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-4 sm:grid-cols-2">
        {/* Logo & Tagline */}
        <div>
          <img src={Logo} alt="logo" className="h-24 mb-4" />
          <p className="text-sm text-white mb-4">
            Delivering recognized global education. Transforming futures.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-2">
            {data?.facebook && (
              <a
                href={data.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
              >
                <FaFacebookF size={18} />
              </a>
            )}
            {data?.insta && (
              <a
                href={data.insta}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
              >
                <FaInstagram size={18} />
              </a>
            )}
            {data?.whatsapp && (
              <a
                href={`https://wa.me/${data.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
              >
                <FaWhatsapp size={18} />
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
              >
                <FaLinkedinIn size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Pages */}
        <div>
          <h4 className="text-lg font-semibold mb-4 uppercase text-white">
            Quick Links
          </h4>
          <ul className="space-y-3 text-base">
            <li>
              <Link
                to="/"
                className="hover:font-medium hover:underline underline-offset-4 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/aboutus"
                className="hover:font-medium hover:underline underline-offset-4 transition"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:font-medium hover:underline underline-offset-4 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 uppercase text-white">
            Contact
          </h4>
          <ul className="space-y-3 text-base">
            {data?.location && (
              <li className="font-medium flex items-center gap-2">
                <MapPin size={17} /> {data.location}
              </li>
            )}
            {data?.email && (
              <li className="font-medium flex items-center gap-2">
                <Mail size={17} /> {data.email}
              </li>
            )}
            {data?.number && (
              <li className="font-medium flex items-center gap-2">
                <Phone size={17} /> {data.number}
              </li>
            )}
          </ul>
        </div>

        {/* Accreditation */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white uppercase">
            Accreditation
          </h4>
          <div className="space-y-4">
            <img
              src={Accreditation1}
              className="bg-white rounded-md p-2 h-14 object-contain"
              alt="accreditation"
            />
            <img
              src={Accreditation2}
              className="bg-white rounded-md p-2 h-14 object-contain"
              alt="accreditation"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-white/40 pt-6 pb-4 px-6 text-center text-sm text-white">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-3">
          <p>© {new Date().getFullYear()} UK Colleges. All rights reserved.</p>
          <p>
            Designed by{" "}
            <a
              href="https://digitechnologynepal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4 font-semibold"
            >
              Digi Technology Nepal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
