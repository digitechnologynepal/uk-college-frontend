import { useState, useEffect } from "react";
import {
  sendContactFormApi,
  getInstitutionProfileApi,
} from "../../../../apis/api";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";
import { Mail, Phone } from "lucide-react";

export default function JoinUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });
  const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [institution, setInstitution] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    const isValidMobile = /^\d{10}$/.test(formData.mobileNumber);
    if (!isValidMobile) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsBeingSubmitted(true);
    try {
      const response = await sendContactFormApi(formData);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          message: "",
        });
        setTimeout(() => setSuccessMessage(""), 1500);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsBeingSubmitted(false);
    }
  };

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const res = await getInstitutionProfileApi();
        if (res.data.success) {
          setInstitution(res.data.result);
        }
      } catch (err) {
        console.error("Failed to fetch institution profile", err);
      }
    };
    fetchInstitution();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto w-full">
        <div className="p-8 md:p-12 lg:p-16 bg-[#204081] rounded-lg hover:shadow-xl duration-300 transition">
          <div className="flex md:flex-row flex-col gap-5 lg:gap-10">
            {/* Left side */}
            <div className="space-y-5 md:w-1/2">
              <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl text-white leading-tight">
                Join Our Global Network Today
              </h1>

              {/* Institution profile details */}
              {institution && (
                <div className="space-y-3 text-white mt-6 text-sm md:text-base">
                  {institution?.email && (
                    <li className="font-medium flex items-center gap-2 break-all">
                      <Mail size={17} />
                      <a
                        href={`mailto:${institution.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline underline-offset-4"
                      >
                        {institution.email}
                      </a>
                    </li>
                  )}

                  {institution?.number && (
                    <a
                      className="font-medium flex items-center gap-2 hover:underline underline-offset-4"
                      href={`tel:${institution.number}`}
                    >
                      <Phone size={17} /> {institution.number}
                    </a>
                  )}

                  <div className="flex gap-3 mt-6">
                    {institution?.facebook && (
                      <a
                        href={institution.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
                      >
                        <FaFacebookF size={18} />
                      </a>
                    )}
                    {institution?.insta && (
                      <a
                        href={institution.insta}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
                      >
                        <FaInstagram size={18} />
                      </a>
                    )}
                    {institution?.whatsapp && (
                      <a
                        href={`https://wa.me/${institution.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
                      >
                        <FaWhatsapp size={18} />
                      </a>
                    )}
                    {institution?.linkedin && (
                      <a
                        href={institution.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-2 bg-white/10 hover:bg-[#f56a79] hover:text-white rounded-full transition backdrop-blur-md"
                      >
                        <FaLinkedinIn size={18} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right form */}
            <div className="space-y-6 md:w-1/2">
              {successMessage && (
                <div className="p-4 bg-green-100 text-green-700 rounded">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-white text-sm md:text-base">
                  We invite you to take next step in transforming your
                  institution into a <br />{" "}
                  <b className="underline underline-offset-2">UK ACCREDITED</b>{" "}
                  education partner
                </p>
                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    pattern="\d{10}"
                    maxLength={10}
                    inputMode="numeric"
                    title="Please enter a valid 10-digit mobile number"
                  />
                </div>

                {/* Message */}
                <FloatingTextarea
                  label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isBeingSubmitted}
                  className="w-full py-4 bg-[#d91b1a] text-white font-semibold rounded-lg hover:bg-[#b31515] active:bg-[#941010] transition"
                >
                  {isBeingSubmitted ? "Sending..." : "Join Us"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Floating Input
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
}) => {
  const handleKeyDown = (e) => {
    if (
      name === "mobileNumber" &&
      !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key) &&
      !/^\d$/.test(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        required={required}
        placeholder=" "
        maxLength={name === "mobileNumber" ? 10 : undefined}
        inputMode={name === "mobileNumber" ? "numeric" : undefined}
        className="peer w-full rounded-lg border border-gray-300 px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d91b1a] focus:border-[#d91b1a]"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-[#d91b1a] peer-focus:text-sm cursor-text select-none"
      >
        {label}
      </label>
    </div>
  );
};

// Floating Textarea
const FloatingTextarea = ({ label, name, value, onChange, required }) => (
  <div className="relative">
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={5}
      placeholder=" "
      className="peer w-full resize-none rounded-lg border border-gray-300 px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d91b1a] focus:border-[#d91b1a]"
    />
    <label
      htmlFor={name}
      className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-2 peer-focus:text-[#d91b1a] peer-focus:text-sm cursor-text select-none"
    >
      {label}
    </label>
  </div>
);
