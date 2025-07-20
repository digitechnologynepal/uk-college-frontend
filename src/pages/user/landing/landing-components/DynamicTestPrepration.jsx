
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'
import { applyForCourseApi, getCourseByCourseTypeApi } from '../../../../apis/api';
import ContentView from "react-froala-wysiwyg/FroalaEditorView";
import { ChevronLeft, ChevronRight } from 'lucide-react';



const DynamicTestPrepration = () => {
    const { testType } = useParams();
    const testData = testType.toUpperCase();
    const [loading, setLoading] = useState(false);
    const [courseDetails, setCourseDetails] = useState(null);
    const navRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        testPrep: "IELTS"
    });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCourseDetailsByCourseType = async () => {
            setLoading(true);
            try {
                const response = await getCourseByCourseTypeApi(testData);
                if (response.data && response.data.result && response.data.result.length > 0) {
                    setCourseDetails(response.data.result[0]);
                } else {
                    setCourseDetails(null);
                }
            } catch (error) {
                console.error("Error fetching course details: ", error);
                setCourseDetails(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetailsByCourseType();
    }, [testData]);
    useEffect(() => {
        setFormData((prevState) => ({
            ...prevState,
            testPrep: testData
        }));
    }, [testData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        setMessage("");

        try {
            const response = await applyForCourseApi(formData);
            setMessage(response.data.message || "Application submitted successfully!");
            setFormData({ fullName: "", email: "", phoneNumber: "", testPrep: testData });
        } catch (error) {
            setMessage("Error submitting application. Please try again.");
            console.error("Error submitting form: ", error);
        } finally {
            setFormSubmitting(false);
        }
    };

    const checkScroll = () => {
        if (navRef.current) {
            setCanScrollLeft(navRef.current.scrollLeft > 0);
            setCanScrollRight(
                navRef.current.scrollLeft + navRef.current.clientWidth < navRef.current.scrollWidth
            );
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scrollNav = (direction) => {
        if (navRef.current) {
            const scrollAmount = 200;
            navRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScroll, 300);
        }
    };


    return (
        <section className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <div className="bg-[#223219] w-full flex flex-col items-center text-white ">
                <div className="py-10 mt-16 text-center">
                    <h1 className="text-4xl font-bold mt-8">Test Preparation</h1>
                </div>
            </div>

            <div className="w-[95%] max-w-7xl relative flex items-center text-lg md:text-xl text-black bg-white mt-8 overflow-hidden">
                <button
                    onClick={() => scrollNav("left")}
                    className={`z-10 h-[45px] bg-[#8d5c00] p-2 shadow-md transition-opacity md:hidden ${!canScrollLeft ? "opacity-0" : ""}`}
                    disabled={!canScrollLeft}
                >
                    <ChevronLeft color="white" size={20} />
                </button>
                <button
                    onClick={() => scrollNav("right")}
                    className={`z-10 h-[45px] bg-[#8d5c00] p-2 shadow-md transition-opacity md:hidden ${!canScrollRight ? "opacity-0" : ""}`}
                    disabled={!canScrollRight}
                >
                    <ChevronRight color="white" size={20} />
                </button>
            </div>

            <div className="w-full max-w-7xl mx-auto my-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 px-6 ">
                        <h2 className="text-2xl text-lime-800 font-semibold">{testData} Course Overview</h2>
                        {loading ? (
                            <p className='flex justify-center items-center'>Loading course details...</p>
                        ) : (
                            <>
                                {courseDetails ? (
                                    <>
                                        {/* <p className="text-xl text-neutral-800 mt-2">
                                        {courseDetails?.title || "Course Title"}
                                    </p> */}
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/uploads/${courseDetails.image}` || "https://via.placeholder.com/600x400"}
                                            alt="Course"
                                            className="w-full h-auto mt-4 rounded-lg"
                                        />

                                        <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/uploads/${courseDetails.duration.durationIcon}`}
                                                    alt="Icon"
                                                    className="w-10 h-10 md:w-12 md:h-12"
                                                />
                                                <div>
                                                    <span className="text-sm text-gray-600">Duration</span>
                                                    <p className="font-bold text-black">
                                                        {courseDetails?.duration?.durationTime || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="block h-10 w-[2px] bg-[#D5951F]"></div>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/uploads/${courseDetails?.mode?.modeIcon}`}
                                                    alt="Icon"
                                                    className="w-10 h-10 md:w-12 md:h-12"
                                                />
                                                <div>
                                                    <span className="text-sm text-gray-600">Mode</span>
                                                    <p className="font-bold text-black">
                                                        {courseDetails?.mode?.examMode || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="block h-10 w-[2px] bg-[#D5951F]"></div>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/uploads/${courseDetails?.exam?.examIcon}`}
                                                    alt="Icon"
                                                    className="w-10 h-10 md:w-12 md:h-12"
                                                />
                                                <div>
                                                    <span className="text-sm text-gray-600">Exam Duration</span>
                                                    <p className="font-bold text-black">
                                                        {courseDetails?.exam?.examDuration || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mt-6">
                                            {<ContentView model={courseDetails?.description} /> ||
                                                "Employers, universities, and governments trust the IELTS or International English Language Testing System. It is the only English test that the immigration authorities accept where you need to prove your English proficiency. It is a computer-based test that can be taken in a designated IELTS test centre. We at Global Reach offer online classes to master your skills."}
                                        </p>
                                    </>
                                ) : (
                                    <p>No course details available for { }.</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-1 p-6 bg-[#eff5e9] shadow-md rounded-lg h-max">
                        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Enroll Now</h1>
                        <p className="text-lime-900 mb-6">Please provide your information, and we will get in touch with you shortly.</p>
                        {message && <p className="text-center text-green-600 mb-4">{message}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name*</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter First Name"
                                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter Email Address"
                                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile Number*</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter Mobile Number"
                                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Test Preparation Course</label>
                                <select
                                    name="testPrep"
                                    value={formData.testPrep}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-400"
                                    required
                                >
                                    <option value="PTE">PTE</option>
                                    <option value="TOEFL">TOEFL</option>
                                    <option value="IELTS">IELTS</option>
                                    <option value="DTE">DTE</option>
                                    <option value="SAT">SAT</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 text-sm font-bold text-white bg-lime-900 rounded-md hover:bg-lime-800 focus:ring-2 focus:ring-lime-400"
                                disabled={formSubmitting}
                            >
                                {formSubmitting ? "Submitting..." : "Send Application"}
                            </button>
                        </form>
                    </div>


                </div>
            </div>
        </section>
    )
}

export default DynamicTestPrepration
