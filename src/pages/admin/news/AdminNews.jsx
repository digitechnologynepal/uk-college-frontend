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
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchNews();
  }, [updated]);

  useEffect(() => {
    const filtered = news.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
    setCurrentPage(1); // reset to first page when search changes
  }, [searchTerm, news]);

  const fetchNews = async () => {
    try {
      const res = await getAllNewsApi();
      if (res?.data?.success) {
        setNews(res.data.result);
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const deleteNews = (id) => {
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
          .catch((err) => ErrorHandler(err));
      }
    });
  };

  return (
    <>
      <main className="p-4">
        <div className="flex flex-col sm:flex-row justify-between mb-6 items-center gap-4">
          <Title title="All News" />
          <div className="flex items-center gap-3 flex-wrap w-auto">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#204081]"
            />
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Add News
            </button>
          </div>
        </div>

        <p className="mb-4 font-medium text-lg">
          Showing <b>{filteredNews.length}</b>{" "}
          {filteredNews.length === 1 ? "news" : "news"}
        </p>

        {currentNews.length > 0 ? (
          <div className="overflow-x-auto">
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
                {currentNews.map((newsItem, index) => (
                  <tr key={newsItem._id || index} className="border-b hover:bg-white">
                    <td style={styles.td}>{indexOfFirstItem + index + 1}</td>
                    <td style={styles.td}>
                      <img
                        className="h-12"
                        src={`${process.env.REACT_APP_API_URL}/uploads/${newsItem.image}`}
                        alt="News"
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

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === page
                      ? "bg-[#204081] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No news found.</p>
        )}
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
