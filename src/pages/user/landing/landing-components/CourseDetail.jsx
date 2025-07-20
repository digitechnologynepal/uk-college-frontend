import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseByIdApi } from "../../../../apis/api";

const SkeletonCourseDetail = () => (
  <section className="text-[#262a2b] pt-[5%] max-w-7xl mx-auto px-6 py-20 animate-pulse">
    {/* Hero Section Skeleton */}
    <div className="relative h-[440px] bg-gray-200 rounded-md mb-16" />

    {/* Main Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-16">
      {/* Left Column */}
      <div className="space-y-20">
        {/* Course Overview */}
        <div>
          <div className="h-10 bg-gray-200 rounded w-48 mb-6" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-5/6" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
          </div>
        </div>

        {/* Course Modules */}
        <div>
          <div className="h-10 bg-gray-200 rounded w-48 mb-10" />
          <div className="space-y-10 border-l-2 border-dashed border-gray-200 pl-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-gray-400 border-4 border-white shadow-md" />
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
                  <div className="h-7 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="flex gap-4 mb-3">
                    <div className="h-5 bg-gray-200 rounded w-20" />
                    <div className="h-5 bg-gray-200 rounded w-20" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <aside className="h-fit lg:sticky lg:top-32">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-40" />

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 border border-gray-200 rounded-md p-4"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  </section>
);

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseByIdApi(id);
        if (res.data.success) {
          setCourse(res.data.result);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <p className="p-8 text-center text-gray-500 font-medium text-lg">
        <SkeletonCourseDetail />
      </p>
    );
  if (!course)
    return (
      <p className="p-8 text-center text-red-600 font-semibold text-lg">
        Course not found.
      </p>
    );

  const toggleModule = (idx) => {
    setExpandedModules((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <>
      {/* Main Content */}
      <main className="text-[#262a2b] bg-white pt-[5%]">
        {/* Hero Section */}
        <section className="relative h-[440px] bg-black">
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
            alt={course.title}
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="max-w-3xl">
              <h1 className="text-white text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-lg">
                {course.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-16">
          {/* Left Column (Content) */}
          <div className="space-y-20">
            {/* Course Description */}
            <section>
              <h2 className="text-3xl font-bold text-[#204081] mb-6 flex items-center gap-2">
                Course Overview
              </h2>
              <div
                className=" text-gray-700"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </section>

            {/* Modules Timeline */}
            {Array.isArray(course.modules) && course.modules.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-[#204081] mb-10 flex items-center gap-2">
                  Course Modules
                </h2>
                <div className="relative border-l-2 border-dashed border-[#204081] pl-6 space-y-10">
                  {course.modules.map((mod, idx) => (
                    <div key={idx} className="relative group">
                      <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#204081] border-4 border-gray-50 group-hover:scale-110 transition-transform shadow-md" />
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#262a2b]">
                          {mod.name}
                        </h3>
                        <div className="text-md text-[#262a2b] mt-1 flex gap-4 flex-wrap">
                          <p>
                            <strong>Weeks:</strong> {mod.durationWeeks}
                          </p>
                          <p>
                            <strong>Hours:</strong> {mod.durationHours}
                          </p>
                        </div>
                        {mod.description && (
                          <p className="text-lg text-[#262a2b] mt-2 text-justify">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column (Sticky Summary) */}
          <aside className="h-fit lg:sticky lg:top-32">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-2">
              <p className="text-xl font-bold text-[#204081] flex items-center">
                Quick Summary
              </p>

              {/* Modules Overview */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-[#262a2b]">
                  Modules Overview
                </h4>
                {course.modules?.map((mod, i) => (
                  <div
                    key={i}
                    className="bg-[#f1f6ff] border border-gray-200 rounded-md p-3 transition"
                  >
                    <p className="font-bold text-[#204081]">{mod.name}</p>
                    <p className="text-sm text-[#262a2b] mt-1">
                      Learning Weeks: {mod.durationWeeks} weeks
                      <div className="mb-2" />
                      Learning Hours: {mod.durationHours} hours of study
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default CourseDetail;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   getCourseByIdApi,
//   getCurriculumsByCourseIDApi,
// } from "../../../../apis/api";

// import {
//   ChartNoAxesColumnIncreasing,
//   CircleArrowDown,
//   CircleArrowUp,
//   Clock3,
//   File,
//   Megaphone,
//   UsersRound,
// } from "lucide-react";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [curriculums, setCurriculums] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeSection, setActiveSection] = useState("Description");
//   const [showTabMenu, setShowTabMenu] = useState(true);
//   const [showDesc, setShowDesc] = useState(false);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const res = await getCourseByIdApi(id);
//         if (res.data.success) {
//           setCourse(res.data.result);
//         }
//       } catch (err) {
//         console.error("Error fetching course:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchCurriculums = async () => {
//       try {
//         const res = await getCurriculumsByCourseIDApi(id);
//         if (res.data.success) {
//           setCurriculums(res.data.curriculum);
//         }
//       } catch (err) {
//         console.error("Error fetching curriculum:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//     fetchCurriculums();
//   }, [id]);

//   if (loading) return <p className="p-8">Loading...</p>;
//   if (!course) return <p className="p-8 text-red-500">Course not found.</p>;

//   const workingHours = [
//     { day: "Monday", time: "9:30 am - 6.00 pm" },
//     { day: "Tuesday", time: "9:30 am - 6.00 pm" },
//     { day: "Wednesday", time: "9:30 am - 6.00 pm" },
//     { day: "Thursday", time: "9:30 am - 6.00 pm" },
//     { day: "Friday", time: "9:30 am - 5.00 pm" },
//     { day: "Saturday", time: "Closed" },
//     { day: "Sunday", time: "Closed" },
//   ];

//   const additionalDetails = [
//     {
//       label: "Enrolled Students",
//       value: course.studentEnrolled,
//       icon: <UsersRound size={24} className="text-[#204081]" />,
//     },
//     {
//       label: "Lectures",
//       value: curriculums.reduce(
//         (total, group) => total + (group.curriculum?.length || 0),
//         0
//       ),
//       icon: <Megaphone size={24} className="text-[#204081]" />,
//     },
//     {
//       label: "Duration",
//       value: `${course.duration}`,
//       icon: <Clock3 size={24} className="text-[#204081]" />,
//     },
//     {
//       label: "Level",
//       value: course.level,
//       icon: (
//         <ChartNoAxesColumnIncreasing size={24} className="text-[#204081]" />
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="bg-[#204081] w-full flex flex-col items-center text-white">
//         <div className="py-20"></div>
//       </div>

//       <div className="px-4 md:px-[6vw] xl:px-[8vw]">
//         <div className="pt-10 flex justify-between">
//           <p className="text-left text-4xl font-bold text-[#262a2b]">
//             {course.title}
//           </p>
//           {/* <p className="mt-2 text-sm text-gray-500">Level: {course.level}</p> */}
//           {/* <button
//             className={`flex lg:flex items-center gap-2 px-4 py-2 rounded-md shadow-md transition-all duration-300 ease-in-out transform
//              bg-green-500 text-white font-semibold lg:text-lg md:text-sm sm:text-xs hover:bg-green-400 hover:shadow-lg hover:scale-105`}
//           >
//             Get Course: Rs. {course.price}
//           </button> */}
//         </div>
//         <div className="flex flex-col lg:flex-row pt-5 gap-6">
//           <div className="w-full lg:w-[75%] pb-10">
//             <img
//               src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
//               alt={course.title}
//               className="w-full h-auto max-h-[400px] object-cover rounded-lg"
//             />

//             <div className="flex justify-end lg:hidden px-2 mb-2">
//               <button
//                 onClick={() => setShowTabMenu((prev) => !prev)}
//                 className="mt-4 text-sm font-medium text-white bg-[#204081] px-4 py-2 rounded-full hover:bg-[#16335f] transition"
//               >
//                 {showTabMenu ? "Hide Tabs" : "Show Tabs"}
//               </button>
//             </div>

//             {showTabMenu && (
//               <div
//                 className="shadow-md rounded-lg bg-white border-none cursor-pointer
//                 mx-auto w-full flex flex-wrap justify-center gap-4 md:gap-4 md:my-4 py-2 my-4 px-2"
//               >
//                 {["Description", "Curriculum", "FAQs", "Reviews"].map((tab) => {
//                   const isActive = activeSection === tab;
//                   return (
//                     <div
//                       key={tab}
//                       onClick={() => setActiveSection(tab)}
//                       className={`group relative text-center py-2 px-3 cursor-pointer text-xs sm:text-xs md:text-base transition-colors duration-300
//                         ${
//                           isActive
//                             ? "text-[#d91b1a] md:text-[#204081] font-bold"
//                             : "text-[#204081]"
//                         }
//                       `}
//                     >
//                       {tab}
//                       {/* Underline: visible on md+ only */}
//                       <span
//                         className={`hidden md:block absolute left-0 bottom-0 h-[3px] bg-[#d91b1a] rounded-full transition-all duration-300 ease-in-out
//                           ${
//                             isActive
//                               ? "w-full opacity-100"
//                               : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
//                           }
//                         `}
//                       ></span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//             {activeSection === "Description" && (
//               <p
//                 className="font-medium bg-white p-10 mb-4 text-[#262a2b] rounded-lg"
//                 dangerouslySetInnerHTML={{
//                   __html: course.description,
//                 }}
//               />
//             )}

//             {activeSection === "Curriculum" && (
//               <div className="bg-white p-10 mb-4 text-[#262a2b] rounded-lg">
//                 {curriculums && curriculums.length > 0 ? (
//                   <ul className="list-disc pl-6 space-y-4 text-[#262a2b]">
//                     {curriculums.map((c, index) => (
//                       <li key={c._id}>
//                         <p className="font-bold text-lg">
//                           {c.curriculumTitle || " "}
//                         </p>
//                         <ul className="list-circle pl-4 mt-2 space-y-1">
//                           {c.curriculum.map((item, i) => (
//                             <li
//                               key={i}
//                               className="flex flex-col gap-1 group mb-2 border-b-2"
//                             >
//                               <div className="flex items-center justify-between gap-2 hover:text-[#4671c8] my-3">
//                                 <div className="flex items-center gap-3 ">
//                                   <File size={16} />
//                                   <p className="font-medium">{item.name}</p>
//                                 </div>

//                                 {item.description && (
//                                   <button
//                                     onClick={() => setShowDesc((prev) => !prev)}
//                                     className="text-[#262a2b] hover:text-[#4671c8] transition"
//                                   >
//                                     {showDesc ? (
//                                       <CircleArrowUp size={20} />
//                                     ) : (
//                                       <CircleArrowDown size={20} />
//                                     )}
//                                   </button>
//                                 )}
//                               </div>

//                               {showDesc && item.description && (
//                                 <p className="bg-gray-100 p-5 font-medium ml-7 mb-3 text-[#262a2b] transition-all duration-300">
//                                   {item.description}
//                                 </p>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-[#262a2b] font-medium">
//                     No curriculum found for this course.
//                   </p>
//                 )}
//               </div>
//             )}

//             {activeSection === "FAQs" && (
//               <div className="bg-white p-10 mb-4 text-[#262a2b] rounded-lg">
//                 FAQs
//               </div>
//             )}

//             {activeSection === "Reviews" && (
//               <div className="bg-white p-10 mb-4 text-[#262a2b] rounded-lg">
//                 Reviews
//               </div>
//             )}
//           </div>

//           <div className="w-full lg:w-[25%]">
//             <div className="p-6 bg-white rounded-lg shadow-md w-full flex flex-col gap-4">
//               <p className="text-xl font-semibold text-[#204081]">
//                 Additional Information
//               </p>{" "}
//               {additionalDetails.map((item, index) => (
//                 <span
//                   key={index}
//                   className="flex items-center font-medium text-[#262a2b]"
//                 >
//                   <span className="mr-3">{item.icon}</span>
//                   {item.label}:{" "}
//                   <p className="font-semibold ml-2">{item.value}</p>
//                 </span>
//               ))}
//             </div>
//             {/* Working Hours */}
//             {/* <div className="p-6 bg-white rounded-lg shadow-md w-full flex flex-col gap-4">
//               <p className="text-xl font-semibold text-[#204081]">
//                 WORKING HOURS
//               </p>

//               <div className="divide-y divide-dashed divide-gray-300">
//                 {workingHours.map((item) => {
//                   const isClosed = item.time === "Closed";
//                   return (
//                     <div
//                       key={item.day}
//                       className={`flex justify-between items-center py-2 px-1 group w-full text-[#262a2b] hover:bg-[#f4f6ff] ${
//                         isClosed
//                           ? "hover:text-[#e84040]"
//                           : "hover:text-[#4671c8]"
//                       }`}
//                     >
//                       <span className="font-medium mr-20">{item.day}</span>

//                       {!isClosed ? (
//                         <span className="text-sm font-medium">{item.time}</span>
//                       ) : (
//                         <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
//                           Closed
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CourseDetail;
