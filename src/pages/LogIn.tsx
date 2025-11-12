import { Form, Formik, type FormikHelpers } from "formik";
import mobileBg from "@/assets/Img/Mobile-background.png";
import desktopBg from "@/assets/Img/Desktop-background-2.png";
import walkingMan from "@/assets/Img/Walking-man-2.png";
import CustomInput from "@/components/Custom/CustomInput";
import CustomBtn from "@/components/Custom/CustomBtn";
import type { FormValues } from "@/types/loginFormTypes";
import { useMobile } from "@/hooks/ResponsiveHooks";
import loginFormSchemaConfig from "@/schemas/loginFormSchema";
import { Eye } from "lucide-react";
import { loginService } from "@/services/authService"; // ✅ import your service
import type { LoginPayload } from "@/types/authTypes";
import useUserStore from "@/store/userStore/userStore";
import CustomToast from "@/components/Custom/CustomToast";

export default function Login() {
  const {setUsername,setToken,setUserId} = useUserStore();
  const onSubmit = async (
    values: LoginPayload,
    actions: FormikHelpers<FormValues>
  ): Promise<void> => {
    try {
      // Optional loading delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ✅ Call the login service
      const response = await loginService(values);

      // ✅ Example: assuming your backend returns { token, user }
      if (response?.token) {
        // localStorage.setItem("token", response.token); // interceptor will use it
        setToken(response.token);
        setUsername(response.user.username);
        setUserId(response.user.id);
      }

      console.log("Login success:", response);

      // You could redirect or show a toast here
      // e.g., navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      // alert(error?.response?.data?.message || "Login failed");
      CustomToast("Login failed","error");
    } finally {
      actions.setSubmitting(false);
    }
  };

  const bg = useMobile() ? mobileBg : desktopBg;

  return (
    <div
      className={`w-screen h-screen flex justify-center items-center px-2`}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="md:p-5 flex flex-col-reverse md:flex-row rounded-3xl bg-white">
        <div className="flex items-end justify-center h-[410px]">
          <img
            className="w-(--walking-man-width) h-(--walking-man-height)"
            src={walkingMan}
            alt=""
          />
        </div>

        <div className="flex flex-col-reverse justify-around sm:w-(--login-from-w) h-(--login-form-h) p-[6px] py-[20px]">
          <Formik {...loginFormSchemaConfig} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <div className="space-y-8 mx-auto">
                  <CustomInput name="email" label="ایمیل" />
                  <CustomInput name="password" label="رمز ورود" icon={<Eye />} />

                  <CustomBtn
                    disabled={isSubmitting}
                    color="#fff"
                    className="w-72 bg-[#ff7700] mt-auto"
                    type="submit"
                    loading={isSubmitting}
                  >
                    ورود
                  </CustomBtn>
                </div>
              </Form>
            )}
          </Formik>

          <p className="text-center font-bold text-title mt-5 text-[#ff7700]">
            خوش اومدی
          </p>
        </div>
      </div>
    </div>
  );
}
