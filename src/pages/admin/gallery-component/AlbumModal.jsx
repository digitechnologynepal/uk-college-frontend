import { Modal } from "../../../components/Modal";
import { Trash, Edit } from "lucide-react";
import Swal from "sweetalert2";
import { deleteGalleryContentApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";

export const AlbumModal = ({
  open,
  album,
  onClose,
  onDeleted,
  onDeleteAlbum,
  onEditItem,
  onItemDeleted,
}) => {
  if (!open) return null;

  const handleDeleteItem = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete Item?",
      text: "This file will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
    });

    if (confirmed.isConfirmed) {
      try {
        await deleteGalleryContentApi(id);
        Swal.fire("Deleted!", "Item deleted successfully.", "success");
        onItemDeleted();
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  const handleDeleteAlbum = async () => {
    const confirmed = await Swal.fire({
      title: "Delete Album?",
      text: "All files in this album will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all!",
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
    });

    if (confirmed.isConfirmed) {
      try {
        // Delete all items in the album
        await Promise.all(
          album.items.map((item) => deleteGalleryContentApi(item._id))
        );
        Swal.fire("Deleted!", "Album deleted successfully.", "success");
        onDeleteAlbum();
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle={`Album: ${album.title}`}>
      <div className="p-4">
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={() => {
              onEditItem({ albumItems: album.items, title: album.title });
              onClose(); 
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Edit Album
          </button>

          <button
            onClick={handleDeleteAlbum}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete Album
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {album.items.map((item) => (
            <div
              key={item._id}
              className="border rounded overflow-hidden p-2 relative"
            >
              {item.fileType === "video" ? (
                <video
                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                  className="w-full h-40 object-cover rounded"
                  controls
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded"
                />
              )}

              <div className="absolute top-1 right-1">
                <button
                  title="Delete Item"
                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
