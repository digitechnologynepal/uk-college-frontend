import { useEffect, useState } from "react";
import {
  getCategoriesApi,
  addCategoryApi,
  updateCategoryApi,
  softDeleteCategoryApi
} from "../../apis/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Category = () => {
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
        await updateCategoryApi(activeTab, { id: editItem._id, title: values.title });
      } else {
        await addCategoryApi(activeTab, { title: values.title });
      }
      resetForm();
      setEditItem(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await softDeleteCategoryApi(activeTab, { id });
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

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
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500"
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
          title: Yup.string().trim().required("Title is required")
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
            <button
              type="submit"
              className="btn-primary "
            >
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
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="border p-2">{cat.title}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => setEditItem(cat)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Category;
