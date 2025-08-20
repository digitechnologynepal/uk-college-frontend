import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteTestimonialApi, getAllTestimonialsApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { ErrorHandler } from "../../components/error/errorHandler";
import { Trash, Edit } from "lucide-react";
import { AddTestimonialModal } from "../admin/testimonial-component/AddTestimonialModal";
import { EditTestimonialModal } from "../admin/testimonial-component/EditTestimonialModal";

export const Testimonial = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const MAX_TESTIMONIALS = 6;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await getAllTestimonialsApi();
      if (res?.data?.success) {
        setTestimonials(res.data.result);
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });
    if (result.isConfirmed) {
      try {
        const res = await deleteTestimonialApi(id);
        if (res?.data?.success) {
          Swal.fire("Deleted!", "Testimonial has been deleted.", "success");
          fetchTestimonials();
        }
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  const handleEditClick = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowEditModal(true);
  };

  return (
    <>
      <main className="p-4">
        <div className="flex justify-between mb-10">
          <Title title="Client Testimonials" />
          <button
            onClick={() => {
              if (testimonials.length >= MAX_TESTIMONIALS) {
                Swal.fire(
                  "Limit reached",
                  `You can only add up to ${MAX_TESTIMONIALS} testimonials.`,
                  "warning"
                );
                return;
              }
              setShowAddModal(true);
            }}
            className={`btn-primary ${
              testimonials.length >= MAX_TESTIMONIALS
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {" "}
            Add Testimonial
          </button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="border rounded shadow-sm p-4 bg-white relative flex flex-col"
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${testimonial.image}`}
                  alt={testimonial.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <p className="font-semibold text-lg">{testimonial.name}</p>
                <p className="text-sm text-gray-600 mb-3 capitalize">
                  {testimonial.role}
                </p>

                {/* Action buttons */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleEditClick(testimonial)}
                    className="icon-primary bg-blue-600 hover:bg-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className="icon-primary bg-red-600 hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No testimonials added yet.
          </p>
        )}
      </main>

      <AddTestimonialModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={fetchTestimonials}
      />

      <EditTestimonialModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        testimonial={selectedTestimonial}
        onUpdated={fetchTestimonials}
      />
    </>
  );
};
