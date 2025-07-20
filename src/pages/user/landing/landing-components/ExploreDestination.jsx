//All Courses
import { useEffect, useState } from "react";
import { Search, ChevronDown, MapPin, Globe, X } from "lucide-react";
import {
  getCountriesApi,
  getUniversitiesApi,
  submitApplicationApi,
} from "../../../../apis/api";
import { toast } from "react-hot-toast";

const CountryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await getUniversitiesApi();
        if (response.data.success) {
          setUniversities(response.data.result);
        } else {
          setError("Failed to fetch universities.");
        }
      } catch (err) {
        setError("An error occurred while fetching universities.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await getCountriesApi();
        if (response.data.success) {
          setCountries(response.data.result);
        } else {
          setError("Failed to fetch countries.");
        }
      } catch (err) {
        console.error("Error fetching countries", err);
      }
    };

    fetchUniversities();
    fetchCountries();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectUniversity = (university) => {
    setSelectedUniversity(university);
    setIsOpen(false);
  };

  const openModal = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsBeingSubmitted(true);
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("email", e.target.email.value);
    formData.append("mobileNumber", e.target.mobile.value);
    formData.append("queries", selectedQuery || "N/A");
    formData.append("country", selectedCountry?.name);
    formData.append("university", selectedUniversity?.uniName);
    formData.append("message", e.target.message.value);

    submitApplicationApi(formData)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
        }
        closeModal();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        setIsBeingSubmitted(false);
      });
  };

  // 🔍 Filter countries based on selected university
  const filteredCountries = countries.filter((country) => {
    const matchesUni = selectedUniversity
      ? country.country === selectedUniversity.uniName
      : true;
    const matchesSearch = country.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesUni && matchesSearch;
  });

  // 🏫 Filter universities dropdown
  const filteredUniversities = universities.filter((university) =>
    university.uniName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="w-full bg-[#e7efff] flex flex-col items-center mb-10">
      {/* Hero Section */}
      <div className="bg-[#204081] w-full flex flex-col items-center text-white">
        <div className="py-10 mt-16 text-center">
          <h1 className="text-4xl font-bold mt-8">All Courses</h1>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="w-full  p-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar and Button */}
          <div className="flex flex-col sm:flex-row gap-4 my-3 justify-center">
            <div className="relative w-full sm:w-[80%]">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-3 pl-10 rounded-full focus:outline-none focus:border-[#204081] focus:ring-1 focus:ring-[#204081]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="lg:flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform bg-[#204081] text-white hover:bg-[#4671c8] hover:shadow-lg hover:scale-105"
            >
              <Search className=" text-white" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[20%] relative">
              <div
                className="flex items-center justify-between w-full px-4 cursor-pointer max-w-[150px]"
                onClick={toggleDropdown}
              >
                <span>Filters</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 max-h-[300px] overflow-y-auto">
                  <div className="relative w-full mb-2">
                    {/* <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 pl-10 border border-gray-200 rounded-md focus:outline-none focus:border-[#223219]"
                    /> */}
                  </div>
                  <h4 className="text-gray-600 text-sm font-semibold">
                    All Programs:
                  </h4>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredUniversities.map((university) => (
                      <div
                        key={university._id}
                        onClick={() => handleSelectUniversity(university)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        {university.uniName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Countries Display Section */}
      <div className="w-full mt-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country._id}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden flex flex-col"
                >
                  {/* Banner Image with Optional Tag */}
                  <div className="relative">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${country.countryImage}`}
                      alt={country.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* {country.featured && (
                      <div className="absolute top-0 left-0 bg-[#44b02e] text-white text-xs font-semibold px-3 py-1 rounded-br-lg shadow-md">
                        Study Abroad
                      </div>
                    )} */}

                    <div className="absolute top-0 left-0 bg-[#44b02e] text-white text-xs font-semibold px-3 py-1 rounded-br-lg shadow-md">
                      Study Abroad
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-xl font-semibold text-[#1c1c1c] mb-2">
                        {country.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Discover academic excellence and vibrant culture in{" "}
                        {country.name}.
                      </p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => openModal(country)}
                        className="w-full bg-[#204081] text-white py-2.5 rounded-lg font-medium hover:bg-[#e7efff] transition duration-300 shadow-sm"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-[#d91b1a] col-span-full text-lg font-medium">
                No countries found for this university.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-3 sm:p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full sm:w-[600px]">
            <form onSubmit={handleSubmit}>
              <h3 className="text-2xl text-center mb-5">Application Form</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    value={selectedUniversity?.uniName || ""}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2">Country</label>
                  <input
                    type="text"
                    value={selectedCountry?.name || ""}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2">Query</label>
                  <select
                    name="queries"
                    value={selectedQuery}
                    onChange={(e) => setSelectedQuery(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Query</option>
                    <option value="Admission">Admission</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Visa">Visa</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold mb-2">
                  Additional Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-[45%] bg-gray-300 text-black py-2 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isBeingSubmitted}
                  className="w-full sm:w-[45%] bg-[#204081] text-white py-2 rounded-lg"
                >
                  {isBeingSubmitted ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CountryDropdown;

// import { ChevronDown, Globe, MapPin, Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { getCountriesApi, getUniversitiesApi, submitApplicationApi } from "../../../../apis/api"; // Adjust the import path accordingly

// const CountryDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isRegionOpen, setIsRegionOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [recentCountries, setRecentCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedRegion, setSelectedRegion] = useState(null);
//   const [universities, setUniversities] = useState([]); // State to store universities data
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
//   const [selectedUniversity, setSelectedUniversity] = useState(null); // Selected university state
//   const [selectedQuery, setSelectedQuery] = useState("");
//   const [countries, setCountries] = useState([])
//   const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);

//   const filteredCountries = countries.filter((country) =>
//     country.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const response = await getUniversitiesApi(); // Your provided API endpoint
//         if (response.data.success) {
//           setUniversities(response.data.result); // Store fetched data in state
//         } else {
//           setError("Failed to fetch universities.");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching universities.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUniversities();
//     fetchCountries();
//   }, []);

//   const fetchCountries = async () => {
//     try {
//       const response = await getCountriesApi();
//       if (response.data.success) {
//         setCountries(response.data.result);
//       }
//     } catch (error) {
//       console.error("Error fetching countries", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // filter universities based on both university name and country
//   const filteredUniversities = universities.filter((university) => {
//     return (
//       university.uniName.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       (selectedCountry ? university.country === selectedCountry.name : true)
//     );
//   })

//   // const filteredUniversities = universities.filter((university) =>
//   //   university.uniName.toLowerCase().includes(searchQuery.toLowerCase()) // Filter universities based on searchQuery
//   // );

//   // Filter universities based on selected country
//   const filteredCountryUniversities = filteredUniversities.filter((university) =>
//     selectedCountry ? university.country === selectedCountry.name : true
//   );

//   const toggleDropdown = () => setIsOpen(!isOpen);
//   const toggleRegionDropdown = () => setIsRegionOpen(!isRegionOpen);

//   const handleSelectCountry = (country) => {
//     setSelectedCountry(country);
//     setIsOpen(false);
//     if (!recentCountries.includes(country.name)) {
//       setRecentCountries([country.name, ...recentCountries].slice(0, 3));
//     }
//   };

//   const handleSelectRegion = (region) => {
//     setSelectedRegion(region);
//     setIsRegionOpen(false); // Close the region dropdown after selection
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsBeingSubmitted(true);
//     const formData = new FormData();
//     formData.append("name", e.target.name.value);
//     formData.append("email", e.target.email.value);
//     formData.append("mobileNumber", e.target.mobile.value);
//     formData.append("queries", selectedQuery || "N/A");
//     formData.append("country", selectedCountry?.name);
//     formData.append("university", selectedUniversity);  // This will now send the university ID
//     formData.append("message", e.target.message.value);

//     submitApplicationApi(formData)
//       .then((response) => {
//         if (response.data.success) {
//           toast.success(response.data.message);
//         }
//         closeModal();
//       })
//       .catch((error) => {
//         console.error("Error submitting form:", error);
//       })
//       .finally(() => {
//         setIsBeingSubmitted(false);
//       })
//   };

//   const openModal = (university) => {
//     setSelectedUniversity(university._id); // Set selected university ID when opening modal
//     setSelectedCountry({ name: university.country });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   if (loading) {
//     return <div>Loading universities...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <section className="w-full flex flex-col items-center mb-10">
//       {/* Hero Section */}
//       <div className="bg-[#204081] w-full flex flex-col items-center text-white ">
//         <div className="py-10 mt-16 text-center">
//           <h1 className="text-4xl font-bold mt-8">...</h1>
//         </div>
//       </div>

// {/* Search and Filter Section */}
// <div className="w-full bg-[#EEF5E9] p-4">
//   <div className="max-w-7xl mx-auto">
//     {/* Search by Keyword */}
//     <h2 className="text-sm sm:text-base font-semibold text-neutral-800 text-start mb-4">
//       Search by Keyword
//     </h2>
//     {/* Search Bar and Button */}
//     <div className="flex flex-col sm:flex-row justify-start gap-4 mb-4">
//       <div className="relative w-full sm:w-[80%]">
//         <input
//           type="text"
//           placeholder="Enter keyword..."
//           className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//       </div>
//       <button
//         type="button"
//         className="w-full sm:w-[20%] bg-[#223219] text-white py-3 rounded-lg hover:bg-[#1a2612] transition duration-300 shadow-md"
//       >
//         Search
//       </button>
//     </div>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="w-full sm:w-[20%] relative">
//               <div
//                 className="flex items-center justify-between w-full px-4 rounded-lg cursor-pointer max-w-[150px]"
//                 onClick={toggleDropdown}
//               >
//                 <span>{selectedCountry ? selectedCountry.name : "All Regions"}</span>
//                 <ChevronDown
//                   className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
//                 />
//               </div>
//               {isOpen && (
//                 <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 max-h-[300px] overflow-y-auto">
//                   <div className="relative w-full mb-2">
//                     <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full p-2 pl-10 border border-gray-200 rounded-md focus:outline-none focus:border-[#223219]"
//                     />
//                   </div>
//                   {/* {recentCountries.length > 0 && (
//                     <div className="mb-3">
//                       <div className="flex justify-between items-center mb-2">
//                         <h4 className="text-gray-600 text-sm font-semibold">Recent:</h4>
//                         <button
//                           onClick={() => setRecentCountries([])}
//                           className="text-xs text-red-500 hover:underline"
//                         >
//                           Clear All
//                         </button>
//                       </div>
//                       {recentCountries.map((recent, index) => (
//                         <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer">
//                           <div
//                             onClick={() => handleSelectCountry(countries.find((c) => c.name === recent))}
//                             className="flex items-center gap-2"
//                           >
//                             <span className="text-lg">{countries.find((c) => c.name === recent)?.flag}</span>
//                             {recent}
//                           </div>
//                           <X
//                             className="w-4 h-4 text-gray-500 hover:text-red-500 cursor-pointer"
//                             onClick={() => setRecentCountries(recentCountries.filter((name) => name !== recent))}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )} */}
//                   <h4 className="text-gray-600 text-sm font-semibold">All Regions:</h4>
//                   <div className="max-h-40 overflow-y-auto">
//                     {filteredCountries.map((country, index) => (
//                       <div
//                         key={index}
//                         onClick={() => handleSelectCountry(country)}
//                         className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
//                       >
//                         <span className="text-lg"><img className="w-6 h-6" src={`${process.env.REACT_APP_API_URL}/uploads/${country.flag}`} alt="" /></span>
//                         {country.name}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Universities Display Section */}
//       <div className="w-full mt-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredUniversities.length > 0 ? (
//               filteredUniversities.map((university) => (
//                 <div key={university._id} className="bg-white p-5 border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start">
//                   <img
//                     src={`${process.env.REACT_APP_API_URL}/uploads/${university.uniImg}`}
//                     alt={university.uniName}
//                     className="w-20 h-20 object-contain rounded-xl mb-3"
//                   />
//                   <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#486F32] text-start">{university.uniName}</h3>
//                   <div className="flex items-start text-sm sm:text-base text-gray-600 mt-1">
//                     <MapPin size={16} className="text-gray-500 mr-2 font-semibold" />
//                     <span>Location: </span>
//                     <span className="ml-1">{university.city}, {university.country}</span>
//                   </div>
//                   <div className="flex items-start text-sm sm:text-base text-gray-600 mt-1">
//                     <Globe size={16} className="text-gray-500 mr-2" />
//                     <span>Website: </span>
//                     <a
//                       href={university.website}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="ml-2 text-blue-600 text-[14px] sm:text-[16px] font-semibold underline"
//                     >
//                       {university.website}
//                     </a>
//                   </div>
//                   <button onClick={() => openModal(university)} className="w-full bg-white text-black border border-[#213219] py-2 mt-3 rounded-lg hover:bg-[#213219] hover:text-white transition duration-300">
//                     Apply Now
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div>No universities found for this search.</div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal Popup */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-3 sm:p-6">
//           <div className="bg-white rounded-xl shadow-lg p-8 w-full sm:w-[600px]">
//             <form onSubmit={handleSubmit}>
//               <h3 className="text-2xl text-center mb-5">Application Form</h3>

//               {/* Form Grid Layout */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//                 {/* Left Column */}
//                 <div>
//                   <label className="text-sm font-semibold mb-2" htmlFor="name">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Enter your full name"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]"
//                   />
//                 </div>

//                 {/* Right Column */}
//                 <div>
//                   <label className="text-sm font-semibold mb-2" htmlFor="mobile">Mobile Number</label>
//                   <input
//                     type="tel"
//                     name="mobile"
//                     placeholder="Enter your mobile number"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]"
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="text-sm font-semibold mb-2" htmlFor="country">Country</label>
//                   <select name="country" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]">
//                     <option value="">Select Country</option>
//                     <option value="United States">United States</option>
//                     <option value="Canada">Canada</option>
//                     <option value="United Kingdom">United Kingdom</option>
//                     <option value="Australia">Australia</option>
//                     <option value="Nepal">Nepal</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold mb-2" htmlFor="university">University</label>
//                   <select
//                     name="university"
//                     required
//                     value={selectedUniversity || ""}
//                     onChange={(e) => setSelectedUniversity(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]"
//                   >
//                     <option value="">Select University</option>
//                     {universities.map((university) => (
//                       <option key={university._id} value={university._id}>{university.uniName}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="mb-4">
//                   <label className="text-sm font-semibold mb-2" htmlFor="queries">Query</label>
//                   <select
//                     name="queries"
//                     required
//                     value={selectedQuery}
//                     onChange={(e) => setSelectedQuery(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]"
//                   >
//                     <option value="">Select Query</option>
//                     <option value="Admission">Admission</option>
//                     <option value="Scholarship">Scholarship</option>
//                     <option value="Visa">Visa</option>
//                     <option value="Accommodation">Accommodation</option>
//                     <option value="Others">Others</option>
//                   </select>

//                 </div>
//               </div>

//               {/* select country */}

//               <div className="mb-4">
//                 <label className="text-sm font-semibold mb-2" htmlFor="message">Additional Message</label>
//                 <textarea
//                   name="message"
//                   placeholder="Enter any additional message"
//                   rows="4"
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#223219] focus:ring-1 focus:ring-[#223219]"
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-center gap-3">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="w-full sm:w-[45%] bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition duration-300"
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="submit"
//                   className="w-full sm:w-[45%] bg-[#223219] text-white py-2 rounded-lg hover:bg-[#1a2612] transition duration-300"
//                   disabled={isBeingSubmitted}
//                 >
//                   {isBeingSubmitted ? "Submitting Application..." : "Submit Application"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </section>
//   );
// };

// export default CountryDropdown;
