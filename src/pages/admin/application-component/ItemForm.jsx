import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { manageWhyChooseUsApi, updateItemApi } from "../../../apis/api";

const ItemForm = ({ item, onClose, setMainData }) => {
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setPreviewImage(
        item.imageUrl?.startsWith("http") || item.imageUrl?.startsWith("data:")
          ? item.imageUrl
          : `${process.env.REACT_APP_API_URL}${item.imageUrl}`
      );
    } else {
      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreviewImage("");
    }
  }, [item]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("imageUrl", imageFile); // ✅ matches backend's key
    }

    try {
      let res;
      if (item?._id) {
        // Edit
        res = await updateItemApi(item._id, formData);
      } else {
        // Add new item to section
        res = await manageWhyChooseUsApi(formData);
      }

      if (res.data.success) {
        setMainData(res.data.result);
        toast.success(
          item ? "Item updated successfully" : "Item added successfully"
        );
        onClose();
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Title"
        className="border p-2 rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Description"
        className="border p-2 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="border p-2 rounded"
      />
      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className="h-32 w-32 object-cover mt-2 rounded shadow"
        />
      )}
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};

export default ItemForm;
