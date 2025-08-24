import { Mail, MapPin, PhoneCall } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  getInstitutionProfileApi,
  sendContactFormApi,
} from "../../../../apis/api";

const SkeletonContactUs = () => (
  <div className="min-h-screen flex items-center justify-center px-4 py-28 pt-36">
    <section
      className="
        bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-max
        overflow-hidden 
        grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-20 p-10
        sm:grid-cols-1
        animate-pulse
      "
    >
      {/* Left Info Panel Skeleton */}
      <div className="flex flex-col justify-between space-y-8">
        <div>
          {/* Title */}
          <div className="h-12 bg-gray-200 rounded w-48 mb-6" />
          {/* Description */}
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-6" />

          {/* Contact Info Cards */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gray-200 rounded-full flex items-center justify-center w-12 h-12" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="rounded-md shadow-sm h-56 bg-gray-200" />
      </div>

      {/* Right Form Panel Skeleton */}
      <div className="flex flex-col justify-center space-y-8">
        {/* Heading */}
        <div className="h-10 bg-gray-200 rounded w-48" />

        {/* Success / Error messages placeholder (hidden since loading) */}
        <div className="h-0" />

        {/* Form */}
        <form className="space-y-6 max-h-max pr-2">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>

          {/* Message textarea */}
          <div className="h-32 bg-gray-200 rounded w-full" />

          {/* Submit Button */}
          <div className="h-12 bg-gray-200 rounded w-full" />
        </form>
      </div>
    </section>
  </div>
);

const ContactUs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });

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
    const fetchData = async () => {
      try {
        const response = await getInstitutionProfileApi();
        if (!response.data?.success) throw new Error("Failed to fetch data");
        setData(response.data.result);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <SkeletonContactUs />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-28 pt-36">
      <section
        className="
          bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-max
          overflow-hidden 
          grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-20 p-10
          sm:grid-cols-1
        "
      >
        {/* Left Info Panel */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-[#204081] mb-6">
              Let's Connect
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed text-base sm:text-lg md:text-lg">
              We'd love to hear from you. Whether you have a question or just
              want to say hi.
            </p>
            <div className="space-y-6">
              <ContactInfoCard
                icon={<MapPin className="w-6 h-6 text-[#d91b1a]" />}
                label="Location"
                value={data?.location || "Not Available"}
              />
              <ContactInfoCard
                icon={<PhoneCall className="w-6 h-6 text-[#d91b1a]" />}
                label="Phone"
                value={data?.number || "Not Available"}
              />
              <ContactInfoCard
                icon={<Mail className="w-6 h-6 text-[#d91b1a]" />}
                label="Email"
                value={data?.email || "Not Available"}
              />
            </div>
          </div>

          <div className="mt-10 rounded-md shadow-sm h-50 sm:h-56 md:h-50 relative">
            {data?.locationForMap ? (
              <>
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-10 h-10 border-4 border-[#204081] border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-500 text-sm ml-3">
                      Loading map...
                    </span>
                  </div>
                )}
                <iframe
                  src={data.locationForMap}
                  title="Map"
                  aria-label="Institution Map"
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                Map not available
              </div>
            )}
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-semibold text-[#204081] mb-8">
            Send us a message
          </h2>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-h-max pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            <FloatingTextarea
              label="Your Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={isBeingSubmitted}
              className="w-full py-4 bg-[#204081] text-white font-semibold rounded-lg hover:bg-[#183a6f] active:bg-[#102b54] transition"
            >
              {isBeingSubmitted ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const ContactInfoCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="p-3 bg-[#d91b1a] bg-opacity-10 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-[#204081] font-semibold">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

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
        className="peer w-full rounded-md border border-gray-300 px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d91b1a] focus:border-[#d91b1a]"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[#d91b1a] peer-focus:text-sm cursor-text select-none"
      >
        {label}
      </label>
    </div>
  );
};

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
      className="peer w-full resize-none rounded-md border border-gray-300 px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d91b1a] focus:border-[#d91b1a]"
    />
    <label
      htmlFor={name}
      className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[#d91b1a] peer-focus:text-sm cursor-text select-none"
    >
      {label}
    </label>
  </div>
);

export default ContactUs;
