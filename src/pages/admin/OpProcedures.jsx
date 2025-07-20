import { useEffect, useState } from "react";
import {
  getAllProceduresApi,
  addProcedureApi,
  updateProcedureApi,
  deleteProcedureApi,
} from "../../apis/api";
import { ErrorHandler } from "../../components/error/errorHandler";
import { Button } from "../../components/Button";
import Swal from "sweetalert2";
import { Trash, Pencil } from "lucide-react";
import ContentEditor from "../../components/content_editor/ContentEditor";

export const OpProcedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchProcedures = async () => {
    try {
      const res = await getAllProceduresApi();
      if (res.data.success) setProcedures(res.data.result);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      if (editId) {
        await updateProcedureApi(editId, { title, description });
      } else {
        await addProcedureApi({ title, description });
        Swal.fire("Added", "Procedure added successfully", "success");
      }
      resetForm();
      fetchProcedures();
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (proc) => {
    setTitle(proc.title);
    setDescription(proc.description || "");
    setEditId(proc._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the procedure.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#d91b1a",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProcedureApi(id);
      fetchProcedures();
      Swal.fire("Deleted", "Procedure deleted successfully", "success");
    } catch (err) {
      ErrorHandler(err);
    }
  };

  return (
    <section className="px-10 mx-auto">
      {/* Top Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-2xl font-semibold text-[#262a2b]">
          {editId ? "Edit Procedure" : "Add Procedure"}
        </p>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title *"
          className="w-full border px-3 py-1.5 rounded text-sm"
        />
        {errors.title && (
          <p className="text-xs text-red-600 -mt-2">{errors.title}</p>
        )}

        <ContentEditor
          model={description}
          handleModelChange={setDescription}
          placeholder="Description"
          height={200}
        />

        <div className="flex justify-end gap-2 pt-2">
          {editId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : editId ? "Update" : "Add"}
          </Button>
        </div>
      </form>

      {/* Scrollable Table */}
      <div className="mt-2">
        <h3 className="text-base font-medium text-[#262a2b] mb-2">
          Existing Procedures
        </h3>

        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: "800px",
              }}
            >
              <thead className="sticky top-0 bg-[#f9f9f9]">
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={styles.th}>S.N</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {procedures.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No procedures added yet.
                    </td>
                  </tr>
                ) : (
                  procedures.map((proc, index) => (
                    <tr key={proc._id}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>{proc.title}</td>
                      <td style={styles.td}>
                        {proc.description
                          ? proc.description.replace(/<[^>]+>/g, "").length >
                            220
                            ? proc.description
                                .replace(/<[^>]+>/g, "")
                                .slice(0, 150) + "..."
                            : proc.description.replace(/<[^>]+>/g, "")
                          : "-"}
                      </td>

                      <td style={styles.td}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(proc)}
                            className="icon-primary bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(proc._id)}
                            className="icon-primary bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
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
