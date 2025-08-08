import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Edit, Trash } from "lucide-react";
import {
  getWhyChooseUsApi,
  manageWhyChooseUsApi,
  deleteItemApi,
} from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { ErrorHandler } from "../../components/error/errorHandler";
import ItemForm from "./application-component/ItemForm";
import Modal from "./application-component/Modal";

const WhyChooseUsAdmin = () => {
  const [mainData, setMainData] = useState({
    mainTitle: "",
    mainImage: "",
    items: [],
  });
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch Data
  useEffect(() => {
    getWhyChooseUsApi()
      .then((res) => {
        if (res.data.success) {
          setMainData(res.data.result);
          setPreviewMainImage(res.data.result.mainImage);
        }
      })
      .catch((err) => ErrorHandler(err));
  }, []);

  // Handle Image Upload
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

  // Handle Main Section Submit (mainTitle & mainImage)
  const handleMainSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("mainTitle", values.mainTitle);
      if (values.mainImage instanceof File) {
        formData.append("mainImage", values.mainImage);
      }

      const res = await manageWhyChooseUsApi(formData);
      if (res.data.success) {
        setMainData(res.data.result);
        toast.success("Updated Successfully");
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleDeleteItem = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteItemApi(id);
          if (res.data.success) {
            setMainData((prev) => ({
              ...prev,
              items: prev.items.filter((item) => item._id !== id),
            }));
            Swal.fire("Deleted!", "Item has been deleted.", "success");
          }
        } catch (error) {
          ErrorHandler(error);
        }
      }
    });
  };

  return (
    <main className="p-4">
      <Title title="Manage Why Choose Us" />
      <Formik
        initialValues={mainData}
        enableReinitialize
        onSubmit={handleMainSubmit}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form className="flex flex-col gap-4 py-4" onSubmit={handleSubmit}>
            <div>
              <label>Main Title</label>
              <Field
                type="text"
                name="mainTitle"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label>Main Image</label>
              <input
                type="file"
                className="border p-2 rounded w-full"
                onChange={(e) => handleMainImageUpload(e, setFieldValue)}
              />
              {previewMainImage && (
                <img
                  src={
                    previewMainImage.startsWith("data:") ||
                    previewMainImage.startsWith("http")
                      ? previewMainImage
                      : `${process.env.REACT_APP_API_URL}${previewMainImage}`
                  }
                  alt="Preview"
                  className="h-32 w-56 object-cover mt-2"
                />
              )}
            </div>

            <button type="submit" className="btn-primary w-max">
              Save
            </button>
          </Form>
        )}
      </Formik>

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
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mainData.items.map((item) => (
              <tr key={item._id}>
                <td style={styles.td}>{item.title}</td>
                <td style={styles.td}>{item.description}</td>
                <td style={styles.td}>
                  {item.imageUrl && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}${item.imageUrl}`}
                      alt="Item"
                      className="h-16 w-32 object-cover"
                    />
                  )}
                </td>
                <td style={{ ...styles.td, textAlign: "center" }}>
                  <div className="flex items-center gap-2">
                    <button
                      className="icon-primary bg-blue-600 hover:bg-blue-600"
                      onClick={() => {
                        setEditItem(item);
                        setModalOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="icon-primary bg-red-600 hover:bg-red-600"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditItem(null);
          }}
        >
          <ItemForm
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

export default WhyChooseUsAdmin;
