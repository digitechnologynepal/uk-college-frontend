import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { EditCourseModal } from "./EditCourseModal";

const CourseTable = ({ data, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [updated, setUpdated] = useState(false);

  const renderDuration = (course) => {
    if (!Array.isArray(course.modules)) return "-";
    return course.modules.map((mod, index) => (
      <div key={index} style={{ marginBottom: 4 }}>
        <strong>{mod.name}:</strong> {mod.durationWeeks} weeks,{" "}
        {mod.durationHours} hours
      </div>
    ));
  };

  // Render module names from new structure
  const renderModules = (course) => {
    if (Array.isArray(course.modules)) {
      return course.modules.map((mod) => mod.name).join(", ");
    }
    return "-";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: "800px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={styles.th}>S.N</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Level</th>
            <th style={styles.th}>Modules</th>
            <th style={styles.th}>Duration</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((course, index) => (
            <tr key={course._id}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{course.title}</td>
              <td style={styles.td}>
                {Array.isArray(course.level) ? course.level.join(", ") : "-"}
              </td>
              <td style={styles.td}>{renderModules(course)}</td>
              <td style={styles.td}>{renderDuration(course)}</td>
              <td style={{ ...styles.td, textAlign: "center" }}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowEditModal(true);
                    }}
                    className="icon-primary bg-blue-600 hover:bg-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(course._id)}
                    className="icon-primary bg-red-600 hover:bg-red-600"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <EditCourseModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCourse(null);
          }}
          setUpdated={setUpdated}
          selectedCourse={selectedCourse}
        />
      )}
    </div>
  );
};

const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f9f9f9",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    verticalAlign: "top",
  },
};

export default CourseTable;

// import { Edit, Trash } from "lucide-react";
// import { useState } from "react";
// import { EditCourseModal } from "./EditCourseModal";

// const CourseTable = ({ data, onDelete }) => {
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [updated, setUpdated] = useState(false);

//   const limitHTMLWords = (html, limit) => {
//     const textOnly = html.replace(/<[^>]+>/g, "");
//     const words = textOnly.split(/\s+/);
//     const trimmedText =
//       words.length > limit ? words.slice(0, limit).join(" ") + "..." : textOnly;
//     return { __html: trimmedText };
//   };

//   return (
//     <div style={{ overflowX: "auto" }}>
//       <table
//         style={{
//           borderCollapse: "collapse",
//           width: "100%",
//           minWidth: "1000px",
//         }}
//       >
//         <thead>
//           <tr style={{ backgroundColor: "#f2f2f2" }}>
//             <th style={styles.th}>S.N</th>
//             <th style={styles.th}>Title</th>
//             <th style={styles.th}>Course Main Type</th>
//             <th style={styles.th}>Course Sub Type</th>
//             <th style={styles.th}>Duration</th>
//             <th style={styles.th}>Price</th>
//             <th style={styles.th}>Level</th>
//             <th style={styles.th}>Enrolled Students</th>
//             <th style={styles.th}>Tag</th>
//             <th style={styles.th}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((course, index) => (
//             <tr key={course._id}>
//               <td style={styles.td}>{index + 1}</td>
//               <td style={styles.td}>{course.title}</td>
//               <td style={styles.td}>{course?.courseType}</td>
//               <td style={styles.td}>{course?.courseSubType || "-"}</td>
//               <td style={styles.td}>
//                 {course.duration?.durationTime || course.duration}
//               </td>
//               <td style={styles.td}>{course.price}</td>
//               <td style={styles.td}>{course.level}</td>
//               <td style={styles.td}>{course.studentEnrolled}</td>
//               <td style={styles.td}>{course.courseTag || "-"}</td>
//               <td style={{ ...styles.td, textAlign: "center" }}>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => {
//                       setSelectedCourse(course);
//                       setShowEditModal(true);
//                     }}
//                     className="icon-primary bg-blue-600 hover:bg-blue-600"
//                   >
//                     <Edit size={16} />
//                   </button>
//                   <button
//                     onClick={() => onDelete(course._id)}
//                     className="icon-primary bg-red-600 hover:bg-red-600"
//                   >
//                     <Trash size={16} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showEditModal && (
//         <EditCourseModal
//           open={showEditModal}
//           onClose={() => {
//             setShowEditModal(false);
//             setSelectedCourse(null);
//           }}
//           setUpdated={setUpdated}
//           selectedCourse={selectedCourse}
//         />
//       )}
//     </div>
//   );
// };

// const styles = {
//   th: {
//     border: "1px solid #ddd",
//     padding: "10px",
//     textAlign: "left",
//     backgroundColor: "#f9f9f9",
//     fontWeight: "bold",
//   },
//   td: {
//     border: "1px solid #ddd",
//     padding: "10px",
//     verticalAlign: "top",
//   },
// };

// export default CourseTable;
