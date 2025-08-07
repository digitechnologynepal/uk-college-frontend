import { useEffect, useState } from "react";
import { getCoursesApi } from "../../../../apis/api";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../../../assets/animations/no-data.json";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 animate-pulse">
    <div className="h-[220px] w-full bg-gray-200 rounded-t-2xl" />
    <div className="p-6 space-y-3">
      <div className="h-5 w-3/4 bg-gray-200 rounded" />
      <div className="h-10 w-1/2 bg-gray-200 rounded-md mt-4" />
    </div>
  </div>
);

const SkeletonHeading = () => (
  <div className="mb-10 max-w-6xl space-y-3 animate-pulse">
    <div className="h-12 w-2/3 bg-gray-200 rounded" />
    <div className="h-4 w-1/2 bg-gray-200 rounded" />
  </div>
);

const ExploreCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCoursesApi();
        if (response.data.success) {
          setCourses(response.data.result);
        } else {
          setError("Failed to fetch courses.");
        }
      } catch (err) {
        console.error("Error fetching courses", err);
        setError("Error loading courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="w-full pt-32 pb-20 px-4 md:px-[6vw] xl:px-[8vw]">
      {loading ? (
        <>
          <SkeletonHeading />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
            {Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </>
      ) : error ? (
        <div className="p-10 text-center text-red-600 text-lg">{error}</div>
      ) : (
        <>
          <div className="mb-10 max-w-6xl">
            <p className="text-left text-2xl lg:text-4xl md:text-3xl font-bold mb-3 text-[#262a2b]">
              Explore Our Courses
            </p>
            <p className="text-gray-600 text-base max-w-xl">
              Gain practical skills and knowledge through expertly crafted
              courses.
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 transition duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
                      alt={course.title}
                      className="w-full h-[220px] object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3 flex-grow">
                    <h2 className="text-xl font-bold text-[#204081] leading-snug">
                      {course.title}
                    </h2>
                    {/* Button */}
                    <div className="mt-auto">
                      <button
                        onClick={() =>
                          navigate(`/course/courseDetail/${course._id}`)
                        }
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#204081] hover:bg-[#3c65b4] transition px-4 py-2 rounded-md"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-14">
              <Lottie
                animationData={animationData}
                loop
                autoplay
                className="w-full max-w-sm"
              />
              <p className="text-gray-500 text-xl font-semibold text-center mt-10 col-span-full">
                No courses available yet.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ExploreCourse;

// import { useEffect, useState } from "react";
// import { Search } from "lucide-react";
// import { getCoursesApi, getAllCourseTypesApi } from "../../../../apis/api";
// import { useNavigate } from "react-router-dom";
// import Lottie from "lottie-react";
// import animationData from "../../../../assets/animations/no-data.json";
// import { Link } from "react-router-dom";

// const ExploreCourse = () => {
//   const [courses, setCourses] = useState([]);
//   const [courseTypes, setCourseTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingTypes, setLoadingTypes] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState(null);
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedSubType, setSelectedSubType] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   const navigate = useNavigate();

//   const knownLevels = ["Beginner", "Intermediate", "Advanced"];

//   // Fetch courses
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await getCoursesApi();
//         if (response.data.success) {
//           setCourses(response.data.result);
//         } else {
//           setError("Failed to fetch courses.");
//         }
//       } catch (err) {
//         console.error("Error fetching courses", err);
//         setError("Error loading courses.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // Fetch course types for filters
//   useEffect(() => {
//     const fetchCourseTypes = async () => {
//       try {
//         const res = await getAllCourseTypesApi();
//         if (res.data.success) {
//           setCourseTypes(res.data.result);
//         } else {
//           console.error("Failed to fetch course types");
//         }
//       } catch (error) {
//         console.error("Error fetching course types:", error);
//       } finally {
//         setLoadingTypes(false);
//       }
//     };

//     fetchCourseTypes();
//   }, []);

//   const coursesPerPage = 15;
//   // Filter courses based on selected filters and search
//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch = course.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     const matchesType = selectedType
//       ? course.courseType?.main === selectedType
//       : true;

//     const matchesSubType = selectedSubType
//       ? course.courseSubType === selectedSubType
//       : true;

//     const matchesLevel = selectedLevel ? course.level === selectedLevel : true;

//     const matchesFeatured = isFeaturedOnly ? course.isFeatured === true : true;

//     return (
//       matchesSearch &&
//       matchesType &&
//       matchesSubType &&
//       matchesLevel &&
//       matchesFeatured
//     );
//   });
//   const indexOfLastCourse = currentPage * coursesPerPage;
//   const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
//   const currentCourses = filteredCourses.slice(
//     indexOfFirstCourse,
//     indexOfLastCourse
//   );
//   const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

//   const getPaginationRange = (current, total) => {
//     const delta = 2;
//     const range = [];
//     const left = Math.max(2, current - delta);
//     const right = Math.min(total - 1, current + delta);

//     range.push(1); // Always show first page

//     if (left > 2) {
//       range.push("...");
//     }

//     for (let i = left; i <= right; i++) {
//       range.push(i);
//     }

//     if (right < total - 1) {
//       range.push("...");
//     }

//     if (total > 1) {
//       range.push(total); // Always show last page
//     }

//     return range;
//   };

//   if (loading || loadingTypes)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

//   // Get subtypes for the selected main type dynamically
//   const selectedTypeObj = courseTypes.find((ct) => ct.main === selectedType);
//   const subTypesForSelectedType = selectedTypeObj?.sub || [];

//   return (
//     <section className="w-full flex flex-col items-center mb-10">
//       {/* Hero Section */}
//       <div className="hero-section">
//         <Link to="/">Home</Link> | Explore Courses
//       </div>
//       <div className="w-full px-[5vw] sm:px-[5vw] lg:pl-0 flex flex-col lg:flex-row lg:gap-10 sm:gap-0">
//         {/* Toggle Filter Button for Mobile */}
//         <div className="lg:hidden w-full flex justify-end mt-3">
//           <button
//             className="text-sm mb-3 font-medium text-white bg-[#204081] px-4 py-2 sm:mb-3 rounded-full transition"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             {showFilters ? "Hide Filters" : "Show Filters"}
//           </button>
//         </div>

//         {/* FILTER SECTION */}
//         <div
//           className={`lg:w-[20%] md:w-[30%] bg-white p-8 h-[100vh] max-w-full md:max-w-sm shadow-lg
//             transition-all duration-300 ease-in-out ${
//               showFilters ? "block" : "hidden"
//             } lg:block lg:sticky lg:top-24`}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-bold text-[#204081]">Filter Courses</h3>
//             <button
//               onClick={() => {
//                 setSelectedType("");
//                 setSelectedSubType("");
//                 setSelectedLevel("");
//                 setIsFeaturedOnly(false);
//               }}
//               className="text-sm text-[#d91b1a] hover:underline"
//             >
//               Clear Filters
//             </button>
//           </div>

//           {/* TYPE */}
//           <div className="mb-4">
//             <label className="text-md font-medium text-gray-700">
//               Course Type
//             </label>
//             <select
//               className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#204081] focus:outline-none"
//               value={selectedType}
//               onChange={(e) => {
//                 setSelectedType(e.target.value);
//                 setSelectedSubType(""); // Reset subtype when main type changes
//               }}
//             >
//               <option value="">All</option>
//               {courseTypes.map((type) => (
//                 <option key={type._id} value={type.main}>
//                   {type.main}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SUB TYPE */}
//           {subTypesForSelectedType.length > 0 && (
//             <div className="mb-4">
//               <label className="text-md font-medium text-gray-700">
//                 Sub Type
//               </label>
//               <select
//                 className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#204081]"
//                 value={selectedSubType}
//                 onChange={(e) => setSelectedSubType(e.target.value)}
//               >
//                 <option value="">All</option>
//                 {subTypesForSelectedType.map((sub) => (
//                   <option key={sub.name} value={sub.name}>
//                     {sub.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* LEVEL */}
//           <div className="mb-4">
//             <label className="text-md font-medium text-gray-700">Level</label>
//             <select
//               className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#204081]"
//               value={selectedLevel}
//               onChange={(e) => setSelectedLevel(e.target.value)}
//             >
//               <option value="">All</option>
//               {knownLevels.map((level) => (
//                 <option key={level} value={level}>
//                   {level}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* FEATURED */}
//           <div className="items-center mt-3 gap-3">
//             <label className="text-md font-medium text-gray-700">Status</label>
//             <div className="flex mt-1 gap-3 items-center">
//               <input
//                 id="featured"
//                 type="checkbox"
//                 className="w-4 h-4 accent-[#204081]"
//                 checked={isFeaturedOnly}
//                 onChange={(e) => setIsFeaturedOnly(e.target.checked)}
//               />
//               <label
//                 htmlFor="featured"
//                 className="text-sm text-gray-700 items-center"
//               >
//                 Featured
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* COURSE LIST */}
//         <div className="flex-col lg:w-[80%] md:[w-70%]">
//           {/* Search Bar */}
//           <div className="w-full px-4 lg:py-6 sm:py-3">
//             <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
//               <div className="relative w-full">
//                 <input
//                   type="text"
//                   placeholder="Search for courses..."
//                   className="w-full p-3 pl-10 mb-3 rounded-full focus:outline-none focus:border-[#204081] focus:ring-1 focus:ring-[#204081] border border-gray-200"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <Search className="absolute right-10 top-3 text-gray-400" />
//               </div>
//             </div>
//           </div>

//           <div className="flex text-xl font-semibold text-[#262a2b] gap-2 mb-4">
//             <p>Courses: {filteredCourses.length} Results</p>
//           </div>

//           {currentCourses.length > 0 ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {currentCourses.map((course, i) => (
//                 <div className="rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer flex flex-col">
//                   {/* Image + Badge */}
//                   <div className="relative">
//                     <img
//                       src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
//                       alt={course.title}
//                       className="w-full h-[220px] object-cover"
//                     />
//                     {course.isFeatured && (
//                       <div className="absolute top-4 left-4 bg-green-600 text-white py-1 px-3 rounded-full text-xs font-semibold shadow-md">
//                         Featured
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-6 flex flex-col gap-4 flex-grow">
//                     <h3 className="text-lg font-bold text-[#204081] transition">
//                       {course.title}
//                     </h3>

//                     <div className="mt-auto">
//                       <button
//                         onClick={() =>
//                           navigate(`/course/courseDetail/${course._id}`)
//                         }
//                         className="inline-flex items-center gap-2 text-sm text-white bg-[#204081] hover:bg-[#3c65b4] transition px-4 py-2 rounded-md"
//                       >
//                         View Details →
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center w-full py-10">
//               <Lottie
//                 animationData={animationData}
//                 loop={true}
//                 autoplay={true}
//                 className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
//               />
//               <p className="mt-4 text-xl text-gray-500 font-medium">
//                 No courses found.
//               </p>
//             </div>
//           )}

//           {totalPages > 1 && (
//             <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
//               {getPaginationRange(currentPage, totalPages).map(
//                 (page, index) => (
//                   <button
//                     key={index}
//                     onClick={() =>
//                       typeof page === "number" && setCurrentPage(page)
//                     }
//                     className={`px-3 py-1 text-sm rounded-full font-semibold ${
//                       currentPage === page
//                         ? "bg-[#204081] text-white"
//                         : "bg-gray-300 text-gray-800 hover:bg-gray-400"
//                     } ${
//                       page === "..."
//                         ? "cursor-default pointer-events-none font-bold"
//                         : ""
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ExploreCourse;
