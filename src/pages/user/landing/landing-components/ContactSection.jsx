import React, { useState } from "react";
import { sendContactFormApi } from "../../../../apis/api";
import hightLogo from "../../../../assets/images/white-logo.png";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/images/uk-colleges-logo-white.png";
import Accreditation1 from "../../../../assets/images/qualifi.png";
import Accreditation2 from "../../../../assets/images/ncc.png";

export const ContactSection = () => {
  // const [formData, setFormData] = useState({
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     mobileNumber: "",
  //     message: "",
  // });

  // const [message, setMessage] = useState("");
  // const [error, setError] = useState("");

  // const handleChange = (e) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setMessage("");
  //     setError("");

  //     try {
  //         const response = await sendContactFormApi(formData);
  //         if (response.data.success) {
  //             setMessage("Your consultation request has been submitted successfully.");
  //             setFormData({
  //                 firstName: "",
  //                 lastName: "",
  //                 email: "",
  //                 mobileNumber: "",
  //                 message: "",
  //             });
  //         } else {
  //             setError("Submission failed. Please try again.");
  //         }
  //     } catch (err) {
  //         setError("An error occurred while submitting the form.");
  //     }
  // };

  return (
    <>
      <div className="bg-[#204081] pt-[10px] pb-[20px] relative z-0">
        {/* <div>
          <img
            className="footer-image-container"
            src="/assets/images/footerImage.png"
            alt="img"
            style={{
              height: "280px",
              zIndex: "1",
              position: "absolute",
              bottom: "25px",
              right: "20px",
            }}
          />
        </div> */}
        <div className="pt-5 mb-5 pl-[2vw] flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
          <img src={Logo} alt="logo" className="footer-logo h-[18vh]" />
          {/* <div className="h-max left-[50%] rounded-lg">
            <img
              src={Logo}
              alt="logo"
              className="footer-logo h-[18vh]"
            />
            <div className="container px-[50px] flex justify-center items-center h-full">
              <p className="w-[50vw] text-left text-[0.8rem] font-bold">
                Accreditation
              </p>
            </div>
          </div> */}
        </div>

        <div className="px-[12vw] flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left gap-10">
          {/* Pages */}
          <div>
            <p className="font-bold text-white text-2xl mb-6">Pages</p>
            <ul className="font-secondary leading-[40px] text-white">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/aboutus"}>About Us</Link>
              </li>
              <li>
                <Link to={"/contact"}>Contact Us</Link>
              </li>
              <li>
                <Link to={"/user/blogs"}>Qualifi Online Courses</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-white text-2xl mb-6">Contact</p>
            <ul className="font-secondary text-white leading-[40px]">
              <li>Putalisadak, Kathmandu, Nepal</li>
              <li>Tel: +977 980-1224282</li>
              <li>Fax: +977 980-1224282</li>
              <li className="font-medium">info@theukcolleges.com</li>
            </ul>
          </div>

          {/* Accreditation */}
          <div className="bg-white p-5 w-[30%] h-[30%] rounded-lg flex flex-col items-center justify-center">
            <p className="font-bold text-[#204081] text-2xl mb-6">
              Accreditation
            </p>
            <div className="md:self-end flex flex-col items-center justify-center">
              <img
                src={Accreditation1}
                alt="logo"
                className="footer-logo h-[10vh] rounded-lg mb-2 shadow-md p-3"
              />
              <img
                src={Accreditation2}
                alt="logo"
                className="footer-logo h-[10vh] rounded-lg shadow-md p-3"
              />
            </div>
          </div>
        </div>

        <div className="w-[80%] mx-auto px-4 pt-5 mt-[20px] border-t">
          <div className="flex flex-wrap justify-between items-center text-sm text-white gap-2 max-w-7xl mx-auto">
            <div className="font-medium sm:mt-0 mt-2 text-center flex">
              <p>Copyright © UK Colleges All Rights Reserved</p>
              <span className="text-white mx-3">|</span>
              <p>A part of SoftEd Group</p>
            </div>
            {/* <p className="font-medium sm:mt-0 mt-2 text-center">
              Copyright © UK Colleges | A part of SoftEd Group | All Rights
              Reserved.
            </p> */}
            <p className="font-medium text-center">
              Designed and Developed by
              <a
                className="hover:underline pl-1"
                target="_blank"
                rel="noopener noreferrer"
                href="https://digitechnologynepal.com/"
              >
                Digi Technology Nepal
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// <section className="w-full bg-[#223219]" id="contact">
//             <div className="max-w-7xl mx-auto px-4">
//                 <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12">
//                     <div className="hidden lg:flex flex-1 p-6 lg:p-10 text-white flex-col items-center lg:items-start my-auto">
//                         <div className="text-center lg:text-left mx-auto sm:mx-auto lg:mx-0">
//                             <div className="max-w-[200px] mb-6">
//                                 <img loading="lazy" src={hightLogo} alt="Hight Logo" className="w-full object-contain" />
//                             </div>
//                             <h2 className="sm:text-2xl md:text-4xl lg:text-6xl font-semibold mt-8">
//                                 Shape a <span className="text-[#EBA21C]">better</span>
//                             </h2>
//                             <h2 className="sm:text-2xl md:text-4xl lg:text-6xl font-semibold mt-4">
//                                 <span className="text-[#EBA21C]">future</span> with high
//                             </h2>
//                             <h2 className="sm:text-2xl md:text-4xl lg:text-6xl font-semibold mt-4">point consultancy</h2>
//                         </div>
//                     </div>

//                     <div className="flex-1 p-6 lg:p-12 max-w-[80%] mx-auto">
//                         <h2 className="text-xl lg:text-2xl font-bold mb-4 text-white text-center lg:text-left">
//                             Book A Consultation
//                         </h2>
//                         <p className="text-sm lg:text-base mb-6 text-white text-center lg:text-left">
//                             Please provide your information, and we will get in touch with you shortly.
//                         </p>

//                         {message && <p className="text-green-500 text-center mb-4">{message}</p>}
//                         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//                         <form onSubmit={handleSubmit}>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                 <div className="flex flex-col text-white">
//                                     <label className="flex gap-1" htmlFor="firstName">First Name <span className="text-2xl">*</span></label>
//                                     <input
//                                         type="text"
//                                         name="firstName"
//                                         value={formData.firstName}
//                                         onChange={handleChange}
//                                         placeholder="First Name"
//                                         required
//                                         className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md text-black"
//                                     />
//                                 </div>
//                                 <div className="flex flex-col text-white">
//                                     <label className="flex gap-1" htmlFor="lastName">Last Name <span className="text-2xl">*</span></label>
//                                     <input
//                                         type="text"
//                                         name="lastName"
//                                         value={formData.lastName}
//                                         onChange={handleChange}
//                                         placeholder="Last Name"
//                                         required
//                                         className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md text-black"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                 <div className="flex flex-col text-white">
//                                     <label className="flex gap-1" htmlFor="email">Email Address <span className="text-2xl">*</span></label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         placeholder="Email Address"
//                                         required
//                                         className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md text-black"
//                                     />
//                                 </div>
//                                 <div className="flex flex-col text-white">
//                                     <label className="flex gap-1" htmlFor="mobileNumber">Mobile Number <span className="text-2xl">*</span></label>
//                                     <input
//                                         type="text"
//                                         name="mobileNumber"
//                                         value={formData.mobileNumber}
//                                         onChange={handleChange}
//                                         placeholder="Mobile Number"
//                                         required
//                                         className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md text-black"
//                                     />
//                                 </div>
//                             </div>

//                             {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                 <select
//                                     name="query"
//                                     value={formData.query}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md"
//                                 >
//                                     <option value="">-- Select Query --</option>
//                                     <option value="Product Inquiry">Product Inquiry</option>
//                                     <option value="Study Plan">Study Plan</option>
//                                     <option value="Counselling Mode">Counselling Mode</option>
//                                     <option value="Funding">Funding</option>
//                                     <option value="Study Level">Study Level</option>
//                                 </select>

//                                 <select
//                                     name="preferredDestination"
//                                     value={formData.preferredDestination}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md"
//                                 >
//                                     <option value="">-- Select Destination --</option>
//                                     <option value="New York">New York</option>
//                                     <option value="Australia">Australia</option>
//                                     <option value="Canada">Canada</option>
//                                 </select>
//                             </div> */}

//                             <div className="flex flex-col text-white">
//                                 <label className="flex gap-1" htmlFor="message">Message <span className="text-2xl">*</span></label>
//                                 <textarea
//                                     name="message"
//                                     value={formData.message}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="Enter Message"
//                                     className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#223219] h-48 text-black"
//                                 ></textarea>
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full sm:w-auto mt-4 px-8 py-3 border border-white text-white hover:bg-white hover:text-black font-bold rounded"
//                             >
//                                 Submit
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </section>
