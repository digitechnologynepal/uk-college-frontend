import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteTeamMemberApi, getAllTeamMembersApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { ErrorHandler } from "../../components/error/errorHandler";
import { Trash, Edit } from "lucide-react";
import { AddTeamMemberModal } from "../admin/team-component/AddTeamModal";
import { EditTeamMemberModal } from "../admin/team-component/EditTeamModal";

export const Team = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllTeamMembersApi();
      if (res?.data?.success) {
        setTeamMembers(res.data.result);
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this team member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });
    if (result.isConfirmed) {
      try {
        const res = await deleteTeamMemberApi(id);
        if (res?.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Team member deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchTeamMembers();
        }
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  return (
    <>
      <main className="p-4">
        <div className="flex justify-between mb-10">
          <Title title="Team Members" />
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            Add Team Member
          </button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="border rounded shadow-sm p-4 bg-white relative flex flex-col"
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${member.image}`}
                  alt={member.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <p className="font-semibold text-lg">{member.name}</p>
                <p className="text-sm text-gray-600 mb-3 capitalize">
                  {member.role}
                </p>

                {/* Action buttons */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleEditClick(member)}
                    className="icon-primary bg-blue-600 hover:bg-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
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
            No team members added yet.
          </p>
        )}
      </main>

      <AddTeamMemberModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={fetchTeamMembers}
      />

      <EditTeamMemberModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        member={selectedMember}
        onUpdated={fetchTeamMembers}
      />
    </>
  );
};
