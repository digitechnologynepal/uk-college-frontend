import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteClientApi, getAllClientsApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { ErrorHandler } from "../../components/error/errorHandler";
import { Trash, Edit } from "lucide-react";
import { AddClientModal } from "../admin/client-component/AddClientModal";
import { EditClientModal } from "../admin/client-component/EditClientModal";

export const Clients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await getAllClientsApi();
      if (res?.data?.success) {
        setClients(res.data.result);
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = () => {
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this client?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });
    if (result.isConfirmed) {
      try {
        const res = await deleteClientApi(id);
        if (res?.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Client deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchClients();
        }
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <>
      <main className="p-4">
        <div className="flex flex-col sm:flex-row justify-between mb-6 items-center gap-4">
          <Title title="Clients" />
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Add Client
            </button>
          </div>
        </div>

        <p className="mb-4 text-gray-600">
          Showing {filteredClients.length} {filteredClients.length === 1 ? "client" : "clients"}
        </p>

        {isLoading ? (
          <p>Loading...</p>
        ) : currentClients.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 border-b">SN</th>
                    <th className="text-left px-4 py-2 border-b">Image</th>
                    <th className="text-left px-4 py-2 border-b">Name</th>
                    <th className="text-left px-4 py-2 border-b">Website</th>
                    <th className="text-left px-4 py-2 border-b">Number</th>
                    <th className="text-left px-4 py-2 border-b">Location</th>
                    <th className="text-center px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentClients.map((client, index) => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{indexOfFirstItem + index + 1}</td>
                      <td className="px-4 py-2 border-b">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/uploads/${client.image}`}
                          alt={client.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">{client.name}</td>
                      <td className="px-4 py-2 border-b">
                        {client.website ? (
                          <a
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {client.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 border-b">{client.number || "-"}</td>
                      <td className="px-4 py-2 border-b">{client.location || "-"}</td>
                      <td className="px-4 py-2 border-b text-center">
                        <button
                          onClick={() => handleEditClick(client)}
                          className="icon-primary bg-blue-600 hover:bg-blue-600 mr-2"
                          title="Edit"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="icon-primary bg-red-600 hover:bg-red-600"
                          title="Delete"
                        >
                          <Trash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-10">No clients found.</p>
        )}
      </main>

      {/* Modals */}
      <AddClientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={fetchClients}
      />

      <EditClientModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        client={selectedClient}
        onUpdated={fetchClients}
      />
    </>
  );
};
