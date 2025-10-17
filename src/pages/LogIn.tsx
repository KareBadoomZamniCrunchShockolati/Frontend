import { Form, Formik, type FormikHelpers } from "formik";

import walkingMan from "@/assets/Img/Walking-man-2.png";
import CustomInput from "@/components/Custom/CustomInput";
import CustomBtn from "@/components/Custom/CustomBtn";
import { basicSchema } from "@/schemas";
import type { FormValues } from "@/types/formTypes";
export default function Login() {
  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted!");
  };

  return (
    <div className=" w-screen h-screen bg-[url(@/assets/Img/Mobile-background.png)] md:bg-[url(@/assets/Img/Desktop-background-2.png)] flex justify-center items-center px-2 ">
      <div className="w-screen flex flex-col-reverse md:flex-row rounded-3xl bg-white">
        <div className="flex items-end justify-center  h-[410px]">
          <img className="w-[233px] h-[320px]" src={walkingMan} alt="" />
        </div>
        <Formik
          initialValues={{ password: "", email: "" }}
          validationSchema={basicSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="space-y-8  mx-auto">
                <CustomInput name="email" label="ایمیل" />

                <CustomInput name="password" type="password" label="رمز ورود" />
                <CustomBtn
                  disabled={isSubmitting}
                  color="#fff"
                  className="w-72 bg-[#ff7700] mt-auto"
                  type="submit"
                >
                  ورود
                </CustomBtn>
                <button disabled={isSubmitting} type="submit">
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="flex flex-col justify-around sm:w-[420px] h-[410px] p-[6px] py-[20px]">
          <h1 className="text-center font-bold text-[30px] mt-[20px] text-[#000]">
            خوش اومدی
          </h1>
        </div>
      </div>
    </div>
  );
}
