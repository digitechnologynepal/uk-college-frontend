import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getContactsApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import ReactPaginate from "react-paginate";

export const Queries = () => {
  const [contacts, setContacts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const limit = 10;

  async function getAllContacts() {
    await getContactsApi(pageCount, limit)
      .then((res) => {
        if (res?.data?.success) {
          const sortedContacts = res?.data?.result?.contacts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt); // Sort by createdAt (most recent first)
          });
          setContacts(sortedContacts); // Set sorted data
          setTotalPages(res?.data?.result?.totalPages);
        }
      })
      .catch((err) => {
        console.error("Error fetching contacts", err);
      });
  }

  useEffect(() => {
    getAllContacts();
  }, [pageCount]);

  const handlePageClick = ({ selected }) => {
    setPageCount(selected + 1);
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  return (
    <>
      <main className="p-4">
        <div className="flex flex-col gap-2">
          <Title title="Contact Form Queries" />
          <p>
            This information has been submitted through the Contact Us form.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border mt-2">
            <thead>
              <tr>
                <th style={styles.th}>S.N</th>
                <th style={styles.th}>First Name</th>
                <th style={styles.th}>Last Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Mobile</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <tr key={contact._id} className="border-b hover:bg-white">
                    <td className="px-6 py-4"style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{contact.firstName}</td>
                    <td style={styles.td}>{contact.lastName}</td>
                    <td style={styles.td}>{contact.email}</td>
                    <td style={styles.td}>{contact.mobileNumber}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleViewDetails(contact)}
                        className="btn-primary"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b hover:bg-white">
                  <td
                    colSpan={7}
                    className="text-center py-10 uppercase text-red-600 font-medium text-xl"
                  >
                    No Queries Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ReactPaginate
            className="flex items-center border rounded-lg text-neutral-700 my-2 p-auto w-max mt-5"
            pageCount={totalPages}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex"}
            previousLabel={
              <span className="flex items-center justify-center text-neutral-700 px-2 py-1">
                Previous
              </span>
            }
            nextLabel={
              <span className="flex items-center justify-center text-neutral-700 px-2 py-1">
                Next
              </span>
            }
            pageClassName="flex items-center justify-center px-2 py-1 border-l hover:bg-neutral-100"
            breakClassName="flex items-center justify-center px-2 py-1 border-l hover:bg-neutral-100"
            activeClassName="bg-primary/5 text-white"
            disabledClassName="pagination__link--disabled pointer-events-none text-gray-400 cursor-not-allowed"
            previousClassName="flex items-center justify-center px-2 py-1 hover:bg-neutral-200"
            nextClassName="flex items-center justify-center px-2 py-1 border-l hover:bg-neutral-100"
            pageLinkClassName="flex items-center justify-center px-2 py-1"
            breakLinkClassName="flex items-center justify-center px-2 py-1"
            activeLinkClassName="text-primary"
          />
        </div>
      </main>

      {showModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg mx-4 sm:mx-0 p-6 rounded-2xl shadow-2xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#204081] mb-6 text-center">
              Contact Details
            </h2>

            <div className="space-y-3 text-gray-700">
              <div>
                <span className="font-semibold">First Name:</span>{" "}
                {selectedContact.firstName}
              </div>
              <div>
                <span className="font-semibold">Last Name:</span>{" "}
                {selectedContact.lastName}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {selectedContact.email}
              </div>
              <div>
                <span className="font-semibold">Mobile Number:</span>{" "}
                {selectedContact.mobileNumber}
              </div>
              <div>
                <span className="font-semibold">Message:</span>{" "}
                {selectedContact.message}
              </div>
              <div>
                <span className="font-semibold">Submitted On:</span>{" "}
                {new Date(selectedContact.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                className="px-6 py-2 rounded-md bg-[#204081] text-white hover:bg-[#335db0] transition"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
