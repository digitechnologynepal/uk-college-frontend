import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createGroupItemApi, updateGroupItemApi } from "../../../apis/api";

export const GroupItemForm = ({ item, onClose, setMainData, mainId }) => {
  const [name, setName] = useState(item?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(item?.image || "");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPreviewImage(item.image);
    } else {
      setName("");
      setPreviewImage("");
      setImageFile(null);
    }
  }, [item]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
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

    if (!mainId) {
      toast.error("Group ID not found");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);

      let res;
      if (item?._id) {
        // Update existing item
        res = await updateGroupItemApi(mainId, item._id, formData);
      } else {
        // Create new item
        res = await createGroupItemApi(mainId, formData);
      }

      if (res.data.success) {
        setMainData(res.data.result);
        toast.success("Item saved successfully");
        onClose();
      } else {
        toast.error("Failed to save item");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Item name"
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
          className="h-32 w-32 object-cover mt-2"
          alt="Preview"
        />
      )}
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};
