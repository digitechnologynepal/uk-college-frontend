import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ContentEditor from "../../../../components/content_editor/ContentEditor";
import { createNewsApi } from "../../../../apis/api";

export const AddNewsModal = ({ open, onClose, setUpdated }) => {
  const [newsImage, setNewsImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !newsImage) {
      Swal.fire("Error!", "Please fill in all the required fields.", "error");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (newsImage) {
      formData.append("newsImage", newsImage);
    }

    try {
      const response = await createNewsApi(formData);

      if (response.data.success) {
        Swal.fire("Success!", "News added successfully.", "success");
        setUpdated((prev) => !prev);
        onClose();
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to add news.", "error");
    } finally {
      setLoading(false);
    }
  };

  function handleUploadedImage(event) {
    const file = event.target.files[0];
    if (file) {
      setNewsImage(file);
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  const handleModelChange = (data) => {
    setDescription(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[60%] md:w-[80%] w-[95%]">
        <h2 className="text-xl font-bold mb-4">Add News</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">News Image</label>
            <input
              type="file"
              onChange={handleUploadedImage}
              required
              className="w-full border rounded p-2"
            />
            {previewImage && (
              <>
                <p className="mt-2">Preview:</p>
                <img src={previewImage} alt="Preview" className="mt-2 w-20" />
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">News Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              News Description
            </label>
            <ContentEditor
              model={description}
              handleModelChange={handleModelChange}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? "Adding..." : "Add News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
