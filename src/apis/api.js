import axios from "axios";

// const apis = "http://localhost:5500";
const Api = axios.create({
    // baseURL: apis,
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

const ApiWithFormData = axios.create({
    //  baseURL: apis,
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
})

const token = localStorage.getItem('_mountview_token_')

const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
}

// login api for only admin
export const loginAdminApi = (data) => Api.post('/api/auth/login', data);

// get admin by id
export const getAdminByIdApi = (id) => ApiWithFormData.get(`/api/auth/getAdmin/${id}`);

// add or update about us content Api
export const addAboutUsApi = (data) => ApiWithFormData.post('/api/admin/aboutus/add', data, config);

// get aboutUs content
export const getAboutUsApi = () => Api.get('/api/admin/aboutus/get');

export const addInstitutionProfileApi = (data) => ApiWithFormData.post('/api/admin/institutionprofile/add', data, config);
export const getInstitutionProfileApi = () => Api.get('/api/admin/institutionprofile/get');
export const deleteBrochureApi = () => Api.delete('/api/admin/institutionprofile/delete-brochure');
export const deleteCertificateApi = () => Api.delete('/api/admin/institutionprofile/delete-certificate');

// get awards content
export const getAwardContentApi = () => Api.get('/api/admin/awards/get');

// add or update achievements content Api
export const addAchievementsApi = (formData) => ApiWithFormData.post('/api/admin/achievements/add', formData, config);

// get achievements content
export const getAchievementsApi = () => Api.get('/api/admin/achievements/get');

// add principal message content Api
export const addPrincipalMessageApi = (data) => ApiWithFormData.post('/api/admin/principalmessage/add', data, config);

// get principal message content
export const getPrincipalMessageApi = () => Api.get('/api/admin/principalmessage/get');

// add youtube Link Api
export const addYoutubeLinkApi = (data) => Api.post('/api/admin/youtubelink/add', data, config);

// get youtube Link Api
export const getYoutubeLinkApi = () => Api.get('/api/admin/youtubelink/get');

//Blogs
export const createNewsApi = (formData) => ApiWithFormData.post('/api/admin/news/add', formData, config);
export const getAllNewsApi = () => Api.get('/api/admin/news/all');
export const deleteNewsApi = (id) => Api.delete(`/api/admin/news/delete/${id}`, config);
export const getSingleNewsApi = (id) => Api.get(`/api/admin/news/get/${id}`);
export const updateNewsApi = (formData, id) => ApiWithFormData.put(`/api/admin/news/update/${id}`, formData, config);
export const getNewsBySlugApi = (slug) => Api.get(`/api/admin/news/slug/${slug}`, config);

// glimpse
export const getGlimpseApi = (page, limit) => Api.get(`/api/admin/glimpses/get?page=${page}&limit=${limit}`);
export const updateGlimpseStatusApi = (id, data) => Api.put(`/api/admin/glimpses/update/${id}`, data, config)
export const deleteGlimpseApi = (id) => Api.delete(`/api/admin/glimpses/delete/${id}`, config)
export const getGlimpseForUserApi = () => Api.get('/api/user/glimpses/get', config)

// Banner APIs
export const addBannerApi = async (data) => Api.post("/api/admin/banner/create", data, config);
export const getBannerApi = async () => Api.get("/api/admin/banner", config);
export const updateBannerApi = async (data, id) => Api.put(`/api/admin/banner/${id}`, data, config);
export const deleteBannerApi = async (id) => Api.delete(`/api/admin/banner/${id}`, config);

export const addMottoApi = async (data) => Api.post("/api/admin/motto/add", data);
export const getMottoApi = async () => Api.get("/api/admin/motto");

export const sendContactFormApi = (data) => Api.post('/api/contact/send', data);
export const getContactsApi = (page, limit) => Api.get(`/api/contact/?page=${page}&limit=${limit}`, config);

//Course Api
export const deleteCourseApi = (id) => Api.delete(`/api/admin/course/${id}`, config);
export const getCoursesApi = () => Api.get('/api/admin/course', config);
export const updateCourseApi = async (id, formData) => ApiWithFormData.put(`/api/admin/course/${id}`, formData, config);
export const addCourseApi = async (formData) => ApiWithFormData.post('/api/admin/course/create', formData, config);
export const getCourseByIdApi = (id) => Api.get(`/api/admin/course/${id}`, config);
export const getCourseBySlugApi = (slug) => Api.get(`/api/admin/course/slug/${slug}`, config);

// Appilcation Api
export const getApplicationsApi = () => Api.get(`/api/application`, config);
export const submitApplicationApi = (data) => Api.post(`/api/application`, data);

// Course Apply Api
export const applyForCourseApi = (data) => Api.post('/api/admin/courseApply/apply', data, config);
export const getAllCourseApplicationsApi = () => Api.get('/api/admin/courseApply/applications', config);

// add why choose us content
export const deleteItemApi = (id) => Api.delete(`/api/admin/whychooseus/items/${id}`, config);
export const manageWhyChooseUsApi = (data) => ApiWithFormData.post('/api/admin/whychooseus', data, config);
export const getWhyChooseUsApi = () => Api.get('/api/admin/whychooseus');
export const updateItemApi = (id, data) => ApiWithFormData.put(`/api/admin/whychooseus/items/${id}`, data, config);

// upload image and get image name as a response
export const uploadImageApi = (data) => ApiWithFormData.post('/api/upload/image', data)

//Country
export const createCountry = (formData) => ApiWithFormData.post('api/admin/country', formData, config);
export const getAllCountry = () => Api.get(`api/admin/country`);
export const getCountryByID = (id) => Api.get(`api/admin/country/${id}`);
export const deleteCountryByID = (id) => Api.delete(`api/admin/country/${id}`);

// Gallery Content 
export const createGalleryContentApi = (formData) => ApiWithFormData.post("/api/admin/galleryContent/add", formData);
export const getAllGalleryContentsApi = () => Api.get("/api/admin/galleryContent/get");
export const updateGalleryContentApi = (id, formData) => ApiWithFormData.put(`/api/admin/galleryContent/update/${id}`, formData);
export const deleteGalleryContentApi = (id) => Api.delete(`/api/admin/galleryContent/delete/${id}`);

// Group (SoftEd Groups) 
export const manageGroupApi = (formData) => ApiWithFormData.post("/api/admin/group", formData);
export const getAllGroupsApi = () => Api.get("/api/admin/group");
export const deleteGroupApi = (id) => Api.delete(`/api/admin/group/delete/${id}`);
export const deleteGroupItemApi = (itemId) => Api.delete(`/api/admin/group/item/${itemId}`);
export const createGroupItemApi = (groupId, formData) => ApiWithFormData.post(`/api/admin/group/item/${groupId}`, formData);
export const updateGroupItemApi = (groupId, itemId, formData) => ApiWithFormData.put(`/api/admin/group/item/${groupId}/${itemId}`, formData);

// Team
export const createTeamMemberApi = (formData) => ApiWithFormData.post("/api/admin/team", formData);
export const getAllTeamMembersApi = () => Api.get("/api/admin/team");
export const getTeamMemberByIdApi = (id) => Api.get(`/api/admin/team/${id}`);
export const updateTeamMemberApi = (id, formData) => ApiWithFormData.put(`/api/admin/team/${id}`, formData);
export const deleteTeamMemberApi = (id) => Api.delete(`/api/admin/team/${id}`);

// Procedure
export const addProcedureApi = (data) => Api.post("/api/admin/procedure/add", data);
export const getAllProceduresApi = () => Api.get("/api/admin/procedure/get");
export const updateProcedureApi = (id, data) => Api.put(`/api/admin/procedure/update/${id}`, data);
export const deleteProcedureApi = (id) => Api.delete(`/api/admin/procedure/delete/${id}`);

// Clients
export const createClientApi = (formData) => ApiWithFormData.post("/api/admin/clients", formData);
export const getAllClientsApi = () => Api.get("/api/admin/clients");
export const getClientByIdApi = (id) => Api.get(`/api/admin/clients/${id}`);
export const updateClientApi = (id, formData) => ApiWithFormData.put(`/api/admin/clients/${id}`, formData);
export const deleteClientApi = (id) => Api.delete(`/api/admin/clients/${id}`);

//Category
export const getCategoriesApi = (tab, includeDeleted = false) => Api.get(`/api/admin/category/${tab}/get`, { params: { includeDeleted } });
export const addCategoryApi = (tab, data) => Api.post(`/api/admin/category/${tab}/add`, data);
export const updateCategoryApi = (tab, data) => Api.put(`/api/admin/category/${tab}/update`, data);
export const deleteCategoryApi = (tab, data) => Api.delete(`/api/admin/category/${tab}/delete`, { data });

//Testimonial
export const createTestimonialApi = (formData) => ApiWithFormData.post("/api/admin/testimonial", formData);
export const getAllTestimonialsApi = () => Api.get("/api/admin/testimonial");
export const updateTestimonialApi = (id, formData) => ApiWithFormData.put(`/api/admin/testimonial/${id}`, formData);
export const deleteTestimonialApi = (id) => Api.delete(`/api/admin/testimonial/${id}`);
