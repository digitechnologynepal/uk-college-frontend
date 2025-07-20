import { Field, Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { loginAdminApi } from "../../../apis/api";
import { Button } from "../../../components/Button";
import { ErrorHandler } from "../../../components/error/errorHandler";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginValidation = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  async function loginAdmin(values) {
    toast.loading("Please wait...");
    await loginAdminApi(values)
      .then((res) => {
        if (res.data.success === true) {
          toast.dismiss();
          toast.success(res.data.message);
          localStorage.setItem("_mountview_token_", res.data.token);
          const jsonDecode = JSON.stringify(res.data.user);
          localStorage.setItem("_mountview_user_", jsonDecode);
          setTimeout(() => {
            window.location.replace("/admin/dashboard");
          }, 1000);
        } else {
          toast.dismiss();
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        ErrorHandler(err);
      });
  }

  return (
    <>
      <main
        className="md:w-[450px] w-full px-2 py-10 flex flex-col justify-center mx-auto"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <div className="flex flex-col gap-2 mb-5">
          <strong className="text-xl font-semibold">Only for Admin</strong>
          <p className="text-base">
            Don't have an account or forgot password?{" "}
            <a
              href="mailto:kafle.susan671@outlook.com"
              className="text-primary"
            >
              Contact
            </a>
          </p>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidation}
          onSubmit={(values) => loginAdmin(values)}
        >
          {(props) => (
            <Form>
              <div className="mb-4 flex flex-col gap-2">
                <label className="font-medium" htmlFor="email">
                  Email
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                />
                {props.errors.email && props.touched.email && (
                  <p className="text-red-500 text-xs">{props.errors.email}</p>
                )}
              </div>
              <div className="mb-4 flex flex-col gap-2 relative">
                <label className="font-medium" htmlFor="email">
                  Password
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                />
                {showPassword ? (
                  <Eye
                    size={20}
                    className="absolute top-[55px] right-2 -translate-y-1/2 text-neutral-500 cursor-pointer bg-white"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOff
                    size={20}
                    className="absolute top-[55px] right-2 -translate-y-1/2 text-neutral-500 cursor-pointer bg-white"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
                {props.errors.password && props.touched.password && (
                  <p className="text-red-500 text-xs">
                    {props.errors.password}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-6">
                <Button className={"w-max btn-primary"} type="submit">
                  Login
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </main>
    </>
  );
};
