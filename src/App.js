import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./App.css";
import { Footer } from "./components/footer/Footer";
import { Navbar } from "./components/navbar/Navbar";
import { BannerPage } from "./pages/admin/Banner";
import Motto from "./pages/admin/Motto";
import AboutUsForm from "./pages/admin/AboutUsForm";
import { Queries } from "./pages/admin/Queries";
import { InstitutionProfile } from "./pages/admin/InstitutionProfile";
import { Login } from "./pages/authentication/Login";
import { Landing } from "./pages/user/landing/Landing";
import AdminRoutes from "./protected/AdminRoutes";
import { useEffect, useState } from "react";
import { getInstitutionProfileApi } from "./apis/api";
import About from "./pages/user/landing/landing-components/About";
import ContactUs from "./pages/user/landing/landing-components/ContactUs";
import { Courses } from "./pages/admin/Courses";
import WhyChooseUsForm from "./pages/admin/WhyChooseUs";
import { AdminNews } from "./pages/admin/news/AdminNews";
import { NewsDescription } from "./pages/user/landing/landing-components/NewsDescription";
import { News } from "./pages/user/landing/landing-components/News";
import ExploreCourse from "./pages/user/landing/landing-components/ExploreCourse";
import CourseDetail from "./pages/user/landing/landing-components/CourseDetail";
import { Gallery } from "./pages/admin/Gallery";
import { GalleryView } from "./pages/user/landing/GalleryView";
import { Group } from "./pages/admin/Group";
import { Team } from "./pages/admin/Team";
import { Clients } from "./pages/admin/Clients";
import { ClientsView } from "./pages/user/landing/landing-components/ClientsView";
import ScrollToTop from "./components/ScrollToTop";
import { Category } from "./pages/admin/Category";

function App() {
  const [institutionprofile, setInstitutionProfile] = useState({});

  useEffect(() => {
    getInstitutionProfileApi().then((res) => {
      if (res.data.success === true) {
        setInstitutionProfile(res?.data?.result);
      }
    });
  }, []);
  return (
    <Router>
      <Toaster
        containerClassName="custom-toaster-style"
        position="top-center"
        reverseOrder={false}
      />
      <div className="flex flex-col w-full min-h-screen">
        <Navbar institutionProfile={institutionprofile} />
        <div className="flex-1">
          <ScrollToTop />
          <Routes>
            {/* <Route path="/" element={<UnderConstruction />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/course" element={<ExploreCourse />} />
            <Route path="/course/courseDetail/:id" element={<CourseDetail />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/galleryview" element={<GalleryView />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/news" element={<News />} />
            <Route path="/clients" element={<ClientsView />} />
            <Route path="/news-description/:id" element={<NewsDescription />} />
            <Route path="/" element={<Landing institutionProfile={institutionprofile} />} />
            <Route element={<AdminRoutes />}>
              <Route
                path="/admin/dashboard"
                element={<AdminLayout children={<InstitutionProfile />} />}
              />
              <Route
                path="/admin/banner"
                element={<AdminLayout children={<BannerPage />} />}
              />
              <Route
                path="/admin/aboutus"
                element={<AdminLayout children={<AboutUsForm />} />}
              />
              <Route
                path="/admin/achievements"
                element={<AdminLayout children={<Motto />} />}
              />
              <Route
                path="/admin/whychooseus"
                element={<AdminLayout children={<WhyChooseUsForm />} />}
              />
              <Route
                path="/admin/manage-gallery"
                element={<AdminLayout children={<Gallery />} />}
              />
              <Route
                path="/admin/manage-group"
                element={<AdminLayout children={<Group />} />}
              />
              <Route
                path="/admin/manage-team-members"
                element={<AdminLayout children={<Team />} />}
              />
              <Route
                path="/admin/manage-clients"
                element={<AdminLayout children={<Clients />} />}
              />
              <Route
                path="/admin/categories"
                element={<AdminLayout children={<Category />} />}
              />
              <Route
                path="/admin/manage-courses"
                element={<AdminLayout children={<Courses />} />}
              />
              <Route
                path="/admin/queries"
                element={<AdminLayout children={<Queries />} />}
              />
              <Route
                path="/admin/news"
                element={<AdminLayout children={<AdminNews />} />}
              />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
