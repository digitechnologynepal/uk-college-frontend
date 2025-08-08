import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Title from "../../components/admin-components/Title";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import {
  addInstitutionProfileApi,
  getInstitutionProfileApi,
} from "../../apis/api";
import toast from "react-hot-toast";
import { ErrorHandler } from "../../components/error/errorHandler";

export const InstitutionProfile = () => {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [number, setNumber] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [insta, setInsta] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [locationForMap, setLocationForMap] = useState("");
  const [brochure, setBrochure] = useState(null);
  const [brochureName, setBrochureName] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [updated, setUpdated] = useState(false);

  const institutionProfileSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    location: Yup.string().required("Required"),
    number: Yup.string().required("Required"),
    facebook: Yup.string().required("Required"),
    whatsapp: Yup.string(),
    insta: Yup.string(),
    linkedin: Yup.string(),
    locationForMap: Yup.string(),
  });

  useEffect(() => {
    getInstitutionProfileApi().then((res) => {
      if (res.data.success === true) {
        setEmail(res?.data?.result?.email);
        setLocation(res?.data?.result?.location);
        setNumber(res?.data?.result?.number);
        setFacebook(res?.data?.result?.facebook);
        setWhatsapp(res?.data?.result?.whatsapp);
        setInsta(res?.data?.result?.insta);
        setLinkedin(res?.data?.result?.linkedin);
        setLocationForMap(res?.data?.result?.locationForMap);
        setBrochureName(res?.data?.result?.brochure || "");
        setCertificateName(res?.data?.result?.certificate || "");
      }
    });
  }, [updated]);

  function updateInstitutionProfile(values, brochure, certificate) {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (brochure) {
      formData.append("brochure", brochure);
    }
    if (certificate) {
      formData.append("certificate", certificate);
    }
    addInstitutionProfileApi(formData)
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          setUpdated((prev) => !prev);
        }
      })
      .catch((err) => {
        ErrorHandler(err);
      });
  }

  return (
    <>
      <main className="p-4">
        <div className="flex flex-col gap-2">
          <Title title="Change Institution Settings" />
          <p>By changing these settings, it will affect everywhere.</p>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            email: email,
            location: location,
            number: number,
            facebook: facebook,
            whatsapp: whatsapp,
            insta: insta,
            linkedin: linkedin,
            locationForMap: locationForMap,
          }}
          validationSchema={institutionProfileSchema}
          onSubmit={(values) => {
            updateInstitutionProfile(values, brochure, certificate);
          }}
        >
          {(props) => (
            <Form className="flex flex-col gap-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="block font-medium">
                    Email
                  </label>
                  <div className="mt-1">
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.errors.email && props.touched.email && (
                    <p className="text-red-500 text-sm">{props.errors.email}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="whatsapp" className="block font-medium">
                    Whatsapp
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="whatsapp"
                      id="whatsapp"
                      placeholder="Whatsapp Link"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.errors.whatsapp && props.touched.whatsapp && (
                    <p className="text-red-500 text-sm">
                      {props.errors.whatsapp}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="location" className="block font-medium">
                    Location
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="location"
                      id="location"
                      placeholder="Location"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.errors.location && props.touched.location && (
                    <p className="text-red-500 text-sm">
                      {props.errors.location}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="linkedin" className="block font-medium">
                    LinkedIn
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="linkedin"
                      id="linkedin"
                      placeholder="LinkedIn Link"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.errors.linkedin && props.touched.linkedin && (
                    <p className="text-red-500 text-sm">
                      {props.errors.linkedin}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="number" className="block font-medium">
                    Number
                  </label>
                  <div className="mt-1">
                    <Field
                      type="tel"
                      name="number"
                      id="number"
                      placeholder="Number"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.errors.number && props.touched.number && (
                    <p className="text-red-500 text-sm">
                      {props.errors.number}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="insta" className="block font-medium">
                    Instagram
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="insta"
                      id="insta"
                      placeholder="Instagram Link"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.errors.insta && props.touched.insta && (
                    <p className="text-red-500 text-sm">{props.errors.insta}</p>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="locationForMap" className="block font-medium">
                    Location For Map
                  </label>
                  <div className="flex flex-col gap-2">
                    <Field
                      type="text"
                      name="locationForMap"
                      id="locationForMap"
                      placeholder="Location For Map in URL"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {props.errors.locationForMap &&
                      props.touched.locationForMap && (
                        <p className="text-red-500 text-sm">
                          {props.errors.locationForMap}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="facebook" className="block font-medium">
                    Facebook Link
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="facebook"
                      id="facebook"
                      placeholder="Facebook Link"
                      className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.errors.facebook && props.touched.facebook && (
                    <p className="text-red-500 text-sm">
                      {props.errors.facebook}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="brochure" className="block font-medium">
                    Upload Brochure (PDF only)
                  </label>
                  <input
                    type="file"
                    id="brochure"
                    accept="application/pdf"
                    onChange={(e) => setBrochure(e.currentTarget.files[0])}
                    className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {brochureName && !brochure && (
                    <p className="mt-1 text-md text-blue-600 underline cursor-pointer">
                      <a
                        href={`${process.env.REACT_APP_API_URL}/uploads/${brochureName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View current brochure PDF
                      </a>
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="certificate" className="block font-medium">
                    Upload Certificate (PDF only)
                  </label>
                  <input
                    type="file"
                    id="certificate"
                    accept="application/pdf"
                    onChange={(e) => setCertificate(e.currentTarget.files[0])}
                    className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {certificateName && !certificate && (
                    <p className="mt-1 text-md text-blue-600 underline cursor-pointer">
                      <a
                        href={`${process.env.REACT_APP_API_URL}/uploads/${certificateName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View current certificate PDF
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <Button className={"w-max btn-primary"} type="submit">
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </main>
    </>
  );
};
