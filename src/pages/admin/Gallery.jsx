import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Trash, Edit, Dot } from "lucide-react";
import {
  getAllGalleryContentsApi,
  deleteGalleryContentApi,
} from "../../apis/api";
import { ErrorHandler } from "../../components/error/errorHandler";
import Title from "../../components/admin-components/Title";
import { EditGalleryModal } from "../admin/gallery-component/EditGalleryModal";
import { AddGalleryModal } from "../admin/gallery-component/AddGalleryModal";

export const Gallery = () => {
  const [galleryList, setGalleryList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await getAllGalleryContentsApi();
      if (res?.data?.success) {
        setGalleryList(res.data.result || []);
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This content will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
    });

    if (confirmed.isConfirmed) {
      try {
        await deleteGalleryContentApi(id);
        Swal.fire("Deleted!", "Content has been deleted.", "success");
        fetchGallery();
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  return (
    <main className="p-6 mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Title title="Uploaded Gallery Content" />
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          Add Content
        </button>
      </div>

      {galleryList.length > 0 ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryList.map((item) => (
              <div
                key={item._id}
                className="border p-4 rounded shadow-sm relative"
              >
                {item.fileType === "video" ? (
                  <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
                    <video
                      src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      controls={false}
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg
                        className="w-12 h-12 text-white bg-black bg-opacity-50 rounded-full p-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                    alt={item.name}
                    className="h-40 w-full object-cover rounded mb-2"
                  />
                )}

                <p className="font-semibold">{item.name}</p>
                <div className="flex items-center text-xs text-gray-600">
                  <p>{item.fileType === "video" ? "Video" : "Image"}</p>
                  <Dot />
                  <p>
                    {item.date
                      ? new Date(item.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No date"}
                  </p>
                </div>

                <div className="flex space-x-3 mt-2">
                  <button
                    onClick={() => setEditItem(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                    title="Edit"
                    type="button"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                    title="Delete"
                    type="button"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-12">
          No content uploaded yet.
        </p>
      )}

      {editItem && (
        <EditGalleryModal
          open={!!editItem}
          item={editItem}
          onClose={() => setEditItem(null)}
          onUpdated={fetchGallery}
        />
      )}

      <AddGalleryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUploaded={fetchGallery}
      />
    </main>
  );
};
