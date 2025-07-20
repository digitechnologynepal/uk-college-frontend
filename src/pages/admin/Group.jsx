import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import {
  getAllGroupsApi,
  manageGroupApi,
  deleteGroupItemApi,
} from "../../apis/api";
import { ErrorHandler } from "../../components/error/errorHandler";
import Title from "../../components/admin-components/Title";
import Modal from "./application-component/Modal";
import { GroupItemForm } from "../admin/group-component/GroupItemForm";

export const Group = () => {
  const [mainData, setMainData] = useState({
    mainTitle: "",
    mainDescription: "",
    mainImage: "",
    items: [],
  });
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchGroups = async () => {
    try {
      const res = await getAllGroupsApi();
      if (res.data.success && res.data.result.length > 0) {
        const first = res.data.result[0];
        setMainData(first);
        setPreviewMainImage(
          `${process.env.REACT_APP_API_URL}${first.mainImage}`
        );
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleMainImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewMainImage(reader.result);
        setFieldValue("mainImage", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("mainTitle", values.mainTitle);
      formData.append("mainDescription", values.mainDescription);
      if (values.mainImage instanceof File) {
        formData.append("mainImage", values.mainImage);
      }

      const res = await manageGroupApi(formData);
      if (res.data.success) {
        setMainData(res.data.result);
        toast.success("Group saved successfully");
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await deleteGroupItemApi(id);
      if (res.data.success) {
        setMainData((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item._id !== id),
        }));
        toast.success("Item deleted successfully");
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  return (
    <main className="p-4">
      <Title title="Manage Group" />
      <Formik
        initialValues={mainData}
        enableReinitialize
        onSubmit={handleMainSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="flex flex-col gap-4 py-4">
            <div>
              <label>Main Title</label>
              <Field
                type="text"
                name="mainTitle"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label>Main Description</label>
              <Field
                as="textarea"
                name="mainDescription"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label>Main Image</label>
              <input
                type="file"
                onChange={(e) => handleMainImageUpload(e, setFieldValue)}
                className="border p-2 rounded w-full"
              />
              {previewMainImage && (
                <img
                  src={previewMainImage}
                  alt="Preview"
                  className="h-32 w-56 object-cover mt-2"
                />
              )}
            </div>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </Form>
        )}
      </Formik>

      {mainData._id && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Items</h3>
          <button
            className="btn-primary my-2"
            onClick={() => {
              setEditItem(null);
              setModalOpen(true);
            }}
          >
            + Add Item
          </button>

          <table className="w-full border-collapse border mt-2">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mainData.items.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">
                    {item.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${item.image}`}
                        alt={item.name}
                        className="h-16 w-32 object-cover"
                      />
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditItem(null);
          }}
        >
          <GroupItemForm
            item={editItem}
            onClose={() => {
              setModalOpen(false);
              setEditItem(null);
            }}
            setMainData={setMainData}
            mainId={mainData._id}
          />
        </Modal>
      )}
    </main>
  );
};
