import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getAllGroupsApi,
  manageGroupApi,
  deleteGroupItemApi,
} from "../../apis/api";
import { ErrorHandler } from "../../components/error/errorHandler";
import Title from "../../components/admin-components/Title";
import Modal from "./application-component/Modal";
import { GroupItemForm } from "../admin/group-component/GroupItemForm";
import { Edit, Trash } from "lucide-react";

export const Group = () => {
  const [mainData, setMainData] = useState({
    mainTitle: "",
    mainDescription: "",
    mainWebsite: "",
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
      formData.append("mainWebsite", values.mainWebsite);
      if (values.mainImage instanceof File) {
        formData.append("mainImage", values.mainImage);
      }

      const res = await manageGroupApi(formData);
      if (res.data.success) {
        setMainData(res.data.result);
        Swal.fire("Success!", "Group saved successfully.", "success");
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleDeleteItem = async (groupId, itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteGroupItemApi(groupId, itemId);
          if (res.data.success) {
            Swal.fire("Deleted!", "Group member has been deleted.", "success");
            fetchGroups();
          }
        } catch (error) {
          ErrorHandler(error);
        }
      }
    });
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
              <label>Main Description (SoftEd)</label>
              <Field
                as="textarea"
                name="mainDescription"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label>Main Website Url (SoftEd)</label>
              <Field
                type="text"
                name="mainWebsite"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label>Main Image (SoftEd)</label>
              <input
                type="file"
                onChange={(e) => handleMainImageUpload(e, setFieldValue)}
                className="border p-2 rounded w-full"
              />
              {previewMainImage && (
                <img
                  src={previewMainImage}
                  alt="Preview"
                  className="h-20 object-cover my-5"
                />
              )}
            </div>
            <button type="submit" className="btn-primary w-max">
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
                <th style={styles.th}>Website Url</th>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mainData.items.map((item) => (
                <tr key={item._id}>
                  <td style={styles.td}>
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {item.website}
                      </a>
                    ) : (
                      <p className="font-semibold">Not added</p>
                    )}
                  </td>
                  <td style={styles.td}>
                    {item.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${item.image}`}
                        alt={item.name}
                        className="h-20 object-cover"
                      />
                    )}
                  </td>
                  <td style={styles.td}>
                    <button
                      className="icon-primary bg-blue-600 hover:bg-blue-700 mr-2"
                      onClick={() => {
                        setEditItem(item);
                        setModalOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="icon-primary bg-red-600 hover:bg-red-700"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <Trash size={16} />
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
