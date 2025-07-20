import { useEffect, useState } from "react";
import ContentView from "react-froala-wysiwyg/FroalaEditorView";
import { Link } from "react-router-dom";
import { getServicesApi } from "../../../apis/api";

export const UserServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await getServicesApi();
                if (response.data?.success && Array.isArray(response.data.result)) {
                    setServices(response.data.result.slice(0, 6));
                } else {
                    throw new Error("Invalid API response");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        <section className="w-full flex flex-col items-center">
            <div className="bg-[#223219] w-full flex flex-col items-center text-white">
                <div className="pt-10 pb-10 mt-16 text-center">
                    <p className="text-2xl font-bold mt-8 underline text-[#eca21c]">Our Services</p>
                    <p className="text-3xl font-bold mt-2">Guiding Students Towards Global Educational Excellence</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl relative service-grid pt-10 pb-20">
                {services?.map((service) => (
                    <div
                        key={service?._id}
                        className="relative flex flex-col items-start p-6 service-card"
                    >
                        <img
                            src={`${process.env.REACT_APP_API_URL}/uploads/${service?.image}`}
                            alt={service?.title}
                            className="w-16 h-16 mb-4 object-contain"
                        />
                        <div className="text-xl font-semibold text-neutral-800 mb-2">
                            {service?.title}
                        </div>
                        <div className="text-gray-600 mb-3">
                            {service?.description.length > 200 ? <ContentView model={`${service?.description.slice(0, 200) + '...'}`} /> : <ContentView model={service?.description} />}
                        </div>
                        {service?.slug && <Link to={`/service-description/${service?.slug}`} className="underline text-[#2c4220] hover:scale-105">Read More &#8594;</Link>}
                    </div>
                ))}
            </div>

            {/* Custom CSS for Professional Dividers */}
            <style jsx>{`
                    .service-grid {
                        gap: 24px;
                    }
                    
                    @media (min-width: 768px) {
                        .service-card:not(:nth-child(3n))::after {
                            content: '';
                            position: absolute;
                            right: -12px;
                            top: 0;
                            bottom: 0;
                            width: 1px;
                            background-color: #eab308;
                        }

                        .service-card:nth-child(-n+3)::before {
                            content: '';
                            position: absolute;
                            left: -12px;
                            right: -12px;
                            bottom: -12px;
                            height: 1px;
                            background-color: #eab308;
                        }
                    }

                    .service-card {
                        position: relative;
                        z-index: 1;
                    }
                `}</style>
        </section>
    )
}