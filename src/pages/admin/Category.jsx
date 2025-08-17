import { useEffect, useState } from "react";
import {
  getCategoriesApi,
  addCategoryApi,
  updateCategoryApi,
  softDeleteCategoryApi,
} from "../../apis/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Edit, Trash } from "lucide-react";

export const Category = () => {
  const [activeTab, setActiveTab] = useState("gallery");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await getCategoriesApi(activeTab, false);
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const handleAddOrUpdate = async (values, { resetForm }) => {
    try {
      if (editItem) {
        await updateCategoryApi(activeTab, {
          id: editItem._id,
          title: values.title,
        });
        Swal.fire("Success!", "Category updated successfully.", "success");
      } else {
        await addCategoryApi(activeTab, { title: values.title });
        Swal.fire("Success!", "Category added successfully.", "success");
      }
      resetForm();
      setEditItem(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      Swal.fire(
        "Error!",
        "Something went wrong while saving the category.",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await softDeleteCategoryApi(activeTab, { id });
        if (res?.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Category deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchCategories();
        }
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Categories</h2>
      <p className="mb-4">
        These will appear in the category dropdown in the Manage Gallery/News
        section.
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {["gallery", "newsEvents"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setEditItem(null);
            }}
            className={`pb-2 px-4 font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#204081] text-[#204081]"
                : "border-transparent text-gray-500 hover:text-[#204081]"
            }`}
          >
            {tab === "gallery" ? "Gallery" : "News & Events"}
          </button>
        ))}
      </div>

      {/* Form */}
      <Formik
        enableReinitialize
        initialValues={{ title: editItem?.title || "" }}
        validationSchema={Yup.object({
          title: Yup.string().trim().required("Title is required"),
        })}
        onSubmit={handleAddOrUpdate}
      >
        {({ resetForm }) => (
          <Form className="flex gap-3 mb-6">
            <div className="flex-1">
              <Field
                name="title"
                placeholder="Enter category title"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary ">
              {editItem ? "Update" : "Add"}
            </button>
            {editItem && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setEditItem(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </Form>
        )}
      </Formik>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const isProtected = cat.title.toLowerCase() === "others";
              return (
                <tr key={cat._id}>
                  <td style={styles.td}>{cat.title}</td>
                  <td style={styles.td} className="flex gap-2">
                    {!isProtected && (
                      <>
                        <button
                          onClick={() => setEditItem(cat)}
                          className="icon-primary bg-blue-600 hover:bg-blue-600"
                          title="Edit"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="icon-primary bg-red-600 hover:bg-red-600"
                          title="Delete"
                        >
                          <Trash size={12} />
                        </button>
                      </>
                    )}
                    {isProtected && (
                      <span className="text-gray-400 italic">
                        Cannot edit or delete this
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
