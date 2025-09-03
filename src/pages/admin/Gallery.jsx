import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Trash, Edit, Dot } from "lucide-react";
import {
  getAllGalleryContentsApi,
  deleteGalleryContentApi,
  deleteAlbumApi,
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
      if (res?.data?.success) setGalleryList(res.data.result || []);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDeleteItem = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This content will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
    });

    if (!confirmed.isConfirmed) return;

    try {
      await deleteGalleryContentApi(id);
      Swal.fire("Deleted!", "Content has been deleted.", "success");
      fetchGallery();
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const handleDeleteAlbum = async (albumTitle) => {
    const confirmed = await Swal.fire({
      title: "Delete album?",
      text: "This will delete all items in this album.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
    });

    if (!confirmed.isConfirmed) return;

    try {
      await deleteAlbumApi(albumTitle);
      Swal.fire("Deleted!", "Album has been deleted.", "success");
      fetchGallery();
    } catch (err) {
      ErrorHandler(err);
    }
  };

  // Group by albumTitle
  const albums = galleryList.reduce((acc, item) => {
    const key = item.albumTitle || `__single__${item._id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <main className="p-6 mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Title title="Uploaded Gallery Content" />
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          Add Content
        </button>
      </div>

      {Object.keys(albums).length > 0 ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(albums).map(([albumKey, items]) => {
              const isSingle =
                items.length === 1 && albumKey.startsWith("__single__");
              const cover = items[0];

              return (
                <div
                  key={albumKey}
                  className="border p-4 rounded shadow-sm relative flex flex-col justify-between"
                >
                  <div>
                    {/* Preview */}
                    {cover.fileType === "video" ? (
                      <video
                        src={`${process.env.REACT_APP_API_URL}/uploads/${cover.file}`}
                        className="w-full h-40 object-cover rounded mb-2"
                        muted
                        playsInline
                        controls={false}
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${cover.file}`}
                        className="w-full h-40 object-cover rounded mb-2"
                        alt={cover.name}
                      />
                    )}

                    {/* Info */}
                    <p className="font-semibold line-clamp-2">
                      {isSingle ? cover.name : albumKey}
                    </p>
                    {!isSingle && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <p className="font-semibold">
                          {new Date(cover.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>{" "}
                        <Dot /> {items.length} items
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 mt-2">
                    <button
                      onClick={() =>
                        setEditItem(isSingle ? cover : { albumItems: items })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() =>
                        isSingle
                          ? handleDeleteItem(cover._id)
                          : handleDeleteAlbum(albumKey)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
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
          item={editItem._id ? editItem : null}
          albumItems={editItem.albumItems || null}
          onClose={() => setEditItem(null)}
          onUpdated={() => {
            fetchGallery();
            setEditItem(null);
          }}
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
