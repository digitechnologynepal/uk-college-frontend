import { useState, useEffect } from "react";
import { deleteNewsApi, getAllNewsApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import Swal from "sweetalert2";
import Title from "../../../components/admin-components/Title";
import { Edit, Trash } from "lucide-react";
import { AddNewsModal } from "./news-components/AddNewsModal";
import { EditNewsModal } from "./news-components/EditNewsModal";

export const AdminNews = () => {
  const [updated, setUpdated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    getAllNewsApi()
      .then((res) => {
        if (res?.data?.success === true) {
          setNews(res?.data?.result);
        }
      })
      .catch((err) => {
        ErrorHandler(err);
      });
  }, [updated]);

  function deleteNews(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNewsApi(id)
          .then((res) => {
            if (res?.data?.success) {
              setUpdated((prev) => !prev);
              Swal.fire("Deleted!", "News has been deleted.", "success");
            }
          })
          .catch((err) => {
            ErrorHandler(err);
          });
      }
    });
  }

  return (
    <>
      <main className="p-4">
        <div className="flex justify-between mb-10">
          <Title title="All News" />
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            Add News
          </button>
        </div>
        <div className="overflow-x-auto">
          {news.length > 0 ? (
            <table className="w-full border-collapse border mt-2">
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={styles.th}>S.N</th>
                  <th style={styles.th}>News Image</th>
                  <th style={styles.th}>News Title</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {news.map((newsItem, index) => (
                  <tr
                    key={newsItem._id || index}
                    className="border-b hover:bg-white"
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <img
                        className="w-20"
                        src={`${process.env.REACT_APP_API_URL}/uploads/${newsItem.image}`}
                        alt="News Image"
                      />
                    </td>
                    <td style={styles.td}>{newsItem.title}</td>
                    <td style={styles.td}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedNews(newsItem);
                            setShowEditModal(true);
                          }}
                          className="icon-primary bg-blue-600 hover:bg-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteNews(newsItem._id)}
                          className="icon-primary bg-red-600 hover:bg-red-600"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No news added yet.
            </p>
          )}
        </div>
      </main>
      <AddNewsModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        setUpdated={setUpdated}
      />
      <EditNewsModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        setUpdated={setUpdated}
        selectedNews={selectedNews}
      />
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
