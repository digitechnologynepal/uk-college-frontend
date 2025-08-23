import { useState, useEffect } from "react";
import { FaRegFileAlt, FaRegEdit } from "react-icons/fa";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";
import {
  addBannerApi,
  updateBannerApi,
  deleteBannerApi,
  getBannerApi,
} from "../../apis/api";
import { ErrorHandler } from "../../components/error/errorHandler";

export const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);

  const MAX_BANNERS = 2;

  const fetchBanners = async () => {
    try {
      const res = await getBannerApi();
      if (res.data.success) setBanners(res.data.result);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSaveBanner = async () => {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !description) {
      Swal.fire("Error", "Title and description are required", "error");
      return;
    }

    try {
      const data = { title, description };
      if (currentBanner) {
        await updateBannerApi(data, currentBanner._id);
        Swal.fire("Success", "Banner updated successfully", "success");
      } else {
        await addBannerApi(data);
        Swal.fire("Success", "Banner added successfully", "success");
      }

      setCurrentBanner(null);
      setIsBuilderOpen(false);
      fetchBanners();
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const handleDeleteBanner = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBannerApi(id);
        Swal.fire("Deleted!", "Banner has been deleted.", "success");
        fetchBanners();
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  return (
    <main className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Banners</h2>
        <button
          onClick={() => {
            if (banners.length >= MAX_BANNERS) {
              Swal.fire(
                "Limit reached",
                `You can only add up to ${MAX_BANNERS} banners`,
                "warning"
              );
              return;
            }
            setCurrentBanner(null);
            setIsBuilderOpen(true);
          }}
          className="btn-primary w-max"
        >
          Add Banner
        </button>
      </div>

      {/* Banner Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner._id} className="border-b">
              <td style={styles.td}>{banner.title}</td>
              <td style={styles.td}>{banner.description}</td>
              <td style={styles.td}>
                <button
                  onClick={() => {
                    setCurrentBanner(banner);
                    setIsBuilderOpen(true);
                  }}
                  className="btn-secondary mr-2"
                  title="Edit"
                >
                  <FaRegEdit />
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner._id)}
                  className="icon-primary bg-red-600 hover:bg-red-600"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Inline Banner Builder */}
      {isBuilderOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-1/3 relative">
            <button
              onClick={() => {
                setIsBuilderOpen(false);
                setCurrentBanner(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {currentBanner ? "Edit Banner" : "Add Banner"}
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="title" className="flex items-center gap-2 text-lg font-medium">
                  <FaRegEdit /> Title
                </label>
                <input
                  type="text"
                  id="title"
                  defaultValue={currentBanner?.title || ""}
                  placeholder="Enter title"
                  className="border rounded p-3 w-full"
                />
              </div>
              <div>
                <label htmlFor="description" className="flex items-center gap-2 text-lg font-medium">
                  <FaRegFileAlt /> Description
                </label>
                <textarea
                  id="description"
                  defaultValue={currentBanner?.description || ""}
                  placeholder="Enter description"
                  className="border rounded p-3 w-full"
                />
              </div>
              <div className="flex space-x-4 mt-4">
                <button onClick={handleSaveBanner} className="btn-primary w-max">
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsBuilderOpen(false);
                    setCurrentBanner(null);
                  }}
                  className="btn-secondary w-max"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
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
