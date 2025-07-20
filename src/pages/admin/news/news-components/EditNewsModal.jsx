import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ContentEditor from "../../../../components/content_editor/ContentEditor";
import { updateNewsApi } from "../../../../apis/api";

export const EditNewsModal = ({ open, onClose, setUpdated, selectedNews }) => {
  const [newsImage, setNewsImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState(selectedNews?.title || "");
  const [description, setDescription] = useState(
    selectedNews?.description || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedNews) {
      setTitle(selectedNews.title);
      setDescription(selectedNews.description);
    }
  }, [selectedNews]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (newsImage) {
      formData.append("newsImage", newsImage);
    }

    try {
      const response = await updateNewsApi(formData, selectedNews._id);

      if (response.data.success) {
        Swal.fire("Success!", "News updated successfully.", "success");
        setUpdated((prev) => !prev);
        onClose();
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to update news.", "error");
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
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[60%] md:w-[80%] w-[95%] h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit News</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">News Image</label>
            <input
              type="file"
              onChange={handleUploadedImage}
              className="w-full border rounded p-2"
            />
            {previewImage && (
              <>
                <p className="mt-2">Preview:</p>
                <img src={previewImage} alt="Preview" className="mt-2 w-20" />
              </>
            )}
            {selectedNews?.image && (
              <>
                <p className="mt-2">Current Image:</p>
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${selectedNews?.image}`}
                  alt="Preview"
                  className="mt-2 w-20"
                />
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
              {loading ? "Updating..." : "Update News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
