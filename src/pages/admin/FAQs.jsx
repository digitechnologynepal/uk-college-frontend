import { Edit, Eye, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Title from "../../components/admin-components/Title";
import { ErrorHandler } from "../../components/error/errorHandler";
import { ViewApplicationModal } from "./ViewApplicationModal";
import { getAllCourseApplicationsApi } from "../../apis/api";

export const FAQs = () => {
    const [applications, setApplications] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        getAllCourseApplicationsApi()
            .then((res) => {
                if (res?.data?.success === true) {
                    // Reverse the order of applications to show the latest first
                    setApplications(res?.data?.result.reverse());
                }
            })
            .catch((err) => {
                ErrorHandler(err);
            });
    }, [updated]);
    // function deleteApplication(id) {
    //     Swal.fire({
    //         title: "Are you sure you want to delete?",
    //         text: "You won't be able to revert this!",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#003366",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Yes, delete it!",
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             await deleteCourseApplicationApi(id)
    //                 .then((res) => {
    //                     if (res?.data?.success === true) {
    //                         Swal.fire({
    //                             icon: "success",
    //                             title: "Application deleted successfully",
    //                             showConfirmButton: false,
    //                             timer: 1500,
    //                         });
    //                         setUpdated((prev) => !prev);
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     ErrorHandler(err);
    //                 });
    //         }
    //     });
    // }
    return (
        <>
            <main className="p-4">
                <div className="flex flex-col gap-2">
                    <Title title="All Course Applications" />
                    <p>All submitted course applications will appear here.</p>
                </div>

                <div className="relative overflow-auto mt-10">
                    <table className="w-full text-sm text-left text-neutral-700 bg-white">
                        <thead className="bg-neutral-100 text-sm text-neutral-700 uppercase sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">S.N</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Mobile</th>
                                <th scope="col" className="px-6 py-3">Course</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications && applications.length > 0 ? (
                                applications.map((app, index) => (
                                    <tr key={app._id} className="border-b hover:bg-white">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{app?.fullName}</td>
                                        <td className="px-6 py-4">{app?.email}</td>
                                        <td className="px-6 py-4">{app?.phoneNumber}</td>
                                        <td className="px-6 py-4">{app?.testPrep}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedApplication(app);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="icon-primary bg-green-600 hover:bg-green-700"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {/* <button
                                                    onClick={() => deleteApplication(app?._id)}
                                                    className="icon-primary bg-red-600 hover:bg-red-700"
                                                >
                                                    <Trash size={16} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-b hover:bg-white">
                                    <td colSpan={6} className="text-center py-10 uppercase text-red-600 font-medium text-xl">
                                        No Applications Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* View Application Modal */}
            <ViewApplicationModal open={showViewModal} onClose={() => setShowViewModal(false)} application={selectedApplication} />
        </>
    );
};


