import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { EditCourseModal } from "./EditCourseModal";

const CourseTable = ({ data, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
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
            <th style={styles.th}>Image</th>
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
              <td style={styles.td}>
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
                  alt={course.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
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
