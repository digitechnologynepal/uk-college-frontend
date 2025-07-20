import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { addBannerApi, updateBannerApi, deleteBannerApi, getBannerApi } from "../../apis/api";
import toast from "react-hot-toast";
import { ErrorHandler } from "../../components/error/errorHandler";
import { FaImage, FaRegFileAlt, FaRegEdit, FaTrashAlt } from "react-icons/fa";

export const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [newDesktopImagePreview, setNewDesktopImagePreview] = useState(null); 
  const [newMobileImagePreview, setNewMobileImagePreview] = useState(null); 

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      const res = await getBannerApi();
      if (res.data.success) {
        setBanners(res.data.result);
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const handleSaveBanner = async () => {
    try {
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const desktopImageFile = document.getElementById("desktopImage").files[0];
      const mobileImageFile = document.getElementById("mobileImage").files[0];

      if (!title || !description) {
        toast.error("Title and description are required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (desktopImageFile) {
        formData.append("desktopImage", desktopImageFile);
      } else if (!currentBanner) {
        toast.error("Desktop image is required for adding a new banner");
        return;
      }

      if (mobileImageFile) {
        formData.append("mobileImage", mobileImageFile);
      } else if (!currentBanner) {
        toast.error("Mobile image is required for adding a new banner");
        return;
      }

      let res;
      if (currentBanner) {
        res = await updateBannerApi(formData, currentBanner._id);
        toast.success("Banner updated successfully");
      } else {
        res = await addBannerApi(formData);
        toast.success("Banner added successfully");
      }

      setIsBuilderOpen(false);
      setCurrentBanner(null);
      setNewDesktopImagePreview(null);
      setNewMobileImagePreview(null); 
      fetchBanners();
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await deleteBannerApi(id);
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const handleDesktopImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDesktopImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewDesktopImagePreview(null); 
    }
  };

  const handleMobileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMobileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewMobileImagePreview(null);
    }
  };

  // Fetch banners on component load
  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <main className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Banners</h2>
        <button 
        // onClick={() => setIsBuilderOpen(true)} 
        onClick={() => {
          if(banners.length >= 1) {
            toast.error("You can only add up to 1 banners");
            return;
          }else{
            setIsBuilderOpen(true);
          }
        }}
        className="btn-primary w-max">
          Add Banner
        </button>
      </div>

      {/* Banner Table */}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner._id} className="border-b">
              <td className="p-3">
                <img src={`${process.env.REACT_APP_API_URL}/uploads/${banner.desktopImage}`} alt="Banner" className="w-20 h-20 object-cover" />
              </td>
              <td className="p-3">{banner.title}</td>
              <td className="p-3">{banner.description}</td>
              <td className="p-3">
                {/* <button
                  onClick={() => {
                    setCurrentBanner(banner);
                    setIsBuilderOpen(true);
                  }}
                  className="btn-secondary mr-2"
                >
                  <FaRegEdit />
                </button> */}
                <button
                  onClick={() => handleDeleteBanner(banner._id)}
                  className="btn-danger"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Banner Builder Modal */}
      {isBuilderOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-1/3 relative">
            <button
              onClick={() => {
                setIsBuilderOpen(false);
                setCurrentBanner(null);
                setNewDesktopImagePreview(null); // Reset the desktop image preview
                setNewMobileImagePreview(null); // Reset the mobile image preview
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{currentBanner ? "Edit Banner" : "Add Banner"}</h2>
            {/* Simplified Form */}
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
              <div>
                <label htmlFor="desktopImage" className="flex items-center gap-2 text-lg font-medium">
                  <FaImage /> Desktop Banner Image
                </label>
                {/* Show current image if editing */}
                {currentBanner && currentBanner.desktopImage && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Current Desktop Image:</p>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${currentBanner.desktopImage}`}
                      alt="Current Desktop Banner"
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                )}
                {/* Show new desktop image preview if selected */}
                {newDesktopImagePreview && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">New Desktop Image Preview:</p>
                    <img src={newDesktopImagePreview} alt="New Desktop Banner Preview" className="w-24 h-24 object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  id="desktopImage"
                  className="border rounded p-3 w-full"
                  accept="image/*"
                  onChange={handleDesktopImageChange}
                />
              </div>
              <div>
                <label htmlFor="mobileImage" className="flex items-center gap-2 text-lg font-medium">
                  <FaImage /> Mobile Banner Image
                </label>
                {/* Show current mobile image if editing */}
                {currentBanner && currentBanner.mobileImage && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Current Mobile Image:</p>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${currentBanner.mobileImage}`}
                      alt="Current Mobile Banner"
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                )}
                {/* Show new mobile image preview if selected */}
                {newMobileImagePreview && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">New Mobile Image Preview:</p>
                    <img src={newMobileImagePreview} alt="New Mobile Banner Preview" className="w-24 h-24 object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  id="mobileImage"
                  className="border rounded p-3 w-full"
                  accept="image/*"
                  onChange={handleMobileImageChange}
                />
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleSaveBanner}
                  className="btn-primary w-max"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsBuilderOpen(false);
                    setCurrentBanner(null);
                    setNewDesktopImagePreview(null); // Reset desktop image preview
                    setNewMobileImagePreview(null); // Reset mobile image preview
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
