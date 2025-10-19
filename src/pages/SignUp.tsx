import CustomInput from "@/components/Custom/CustomInput";
import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Eye, EyeClosed, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import telegramLogo from "../assets/telegram.svg";
import Stepper, { Step } from "../components/ui/Stepper";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function SignUp() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    acceptTerms: false,
  };
  const [isPressedNext, setIsPressedNext] = useState<boolean>(false);
  const [isPressedBack, setIsPressedBack] = useState<boolean>(false);
  const [OTPvalue, setOTPValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const step1ValidationSchema = Yup.object({
    username: Yup.string()
      .required("وارد کردن نام کاربری الزامی است")
      .min(3, "حداقل ۳ کاراکتر وارد کنید"),

    email: Yup.string()
      .required("وارد کردن پست الکترونیک الزامی است")
      .email("ایمیل وارد شده معتبر نیست"),

    // acceptTerms: Yup.boolean()
    //   .oneOf([true], "باید قوانین و مقررات را بپذیرید")
    //   .required("پذیرفتن قوانین الزامی است"),
  });

  const step2ValidationSchema = Yup.object({
    username: Yup.string()
      .required("وارد کردن نام کاربری الزامی است")
      .min(3, "حداقل ۳ کاراکتر وارد کنید"),

    email: Yup.string()
      .required("وارد کردن پست الکترونیک الزامی است")
      .email("ایمیل وارد شده معتبر نیست"),

    // acceptTerms: Yup.boolean()
    //   .oneOf([true], "باید قوانین و مقررات را بپذیرید")
    //   .required("پذیرفتن قوانین الزامی است"),
  });

  const step3ValidationSchema = Yup.object({
    confirmPassword: Yup.string()
      .required("تکرار رمز عبور الزامی است")
      .oneOf([Yup.ref("password")], "رمز عبور و تکرارش باید یکسان باشند"),
  });

  const handleSubmit = (values) => {
    console.log("Form values:", values);
  };

  useEffect(() => {
    setIsPressedBack(false);
    setIsPressedNext(false);
  }, [isPressedBack, isPressedNext]);

  return (
    <Stepper
      next={isPressedNext}
      back={isPressedBack}
      initialStep={1}
      onStepChange={(step) => {
        console.log(step);
      }}
      onFinalStepCompleted={() => console.log("All steps completed!")}
      backButtonText="Previous"
      nextButtonText="Next"
      className="min-h-screen flex items-center justify-center bg-gray-50"
      dir="rtl"
      stepCircleContainerClassName="bg-white "
      stepContainerClassName=""
      backButtonProps={{ className: "hidden" }}
      nextButtonProps={{ id: "stepper-next", className: "hidden" }}
      disableStepIndicators={true}
    >
      <Step>
        <div className="flex items-center justify-between mb-12 ">
          <img src={telegramLogo} alt="لوگو" className="w-18 h-18 rounded-xl" />
          <button
            className="p-2 border-2 border-orange-400 rounded-xl hover:bg-orange-50 transition-colors"
            onClick={() => setIsPressedBack((prev) => !prev)}
          >
            <ArrowLeft className="w-8 h-8 text-orange-400" />
          </button>
        </div>

        <div className="text-right mb-8">
          <h1 className="text-4xl font-extrabold text-[#FF7700] mb-2">
            ثبت نام
          </h1>
          <p className="text-[#666666] text-sm font-extrabold">
            لطفا ایمیل و نام کاربری خود را وارد کنید
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={step1ValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="flex flex-col items-center gap-4 w-full h-full">
              <CustomInput name="username" label="نام کاربری" />

              <CustomInput name="email" label="پست الکترونیک" />

              <div className="flex items-center gap-2 self-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  className="accent-orange-500 bg-white w-5 h-5 rounded-md border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm text-gray-600 font-extrabold"
                >
                  قوانین و مقررات را خوانده و می‌پذیرم.
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="
                  w-full mt-2 
                  bg-[#3871DD] hover:bg-[#265bb5] 
                  text-white py-3 rounded-xl 
                  font-semibold 
                  border-1 border-black 
                  shadow-[0px_1px_0px_var(--borderDefault)]
                  transition-all duration-300
                "
                onClick={() => setIsPressedNext((prev) => !prev)}
              >
                ثبت‌نام
              </Button>
            </Form>
          )}
        </Formik>
      </Step>
      <Step>
        <div
          // className="min-h-screen flex items-center justify-center bg-gray-50"
          dir="rtl"
        >
          <div
          // className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-end mb-12">
              <button
                className="p-2 border-2 border-orange-400 rounded-xl hover:bg-orange-50 transition-colors"
                onClick={() => setIsPressedBack((prev) => !prev)}
              >
                <ArrowLeft className="w-8 h-8 text-orange-400" />
              </button>
            </div>

            <div className="text-right mb-8">
              <h1 className="text-4xl font-extrabold text-[#FF7700] mb-2">
                تایید پست الکترونیک
              </h1>
              <p className="text-[#666666] text-sm font-extrabold">
                لطفا کد ارسال شده به پست الکترونیک karebadoomzamini@gamil.com را
                وارد کنید
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={step2ValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col items-center gap-4 w-full">
                  {/* <div className="flex items-center justify-center mb-12">
                    <CustomInput name="e_1" label="" />
                    <CustomInput name="e_2" label="" />
                    <CustomInput name="e_3" label="" />
                    <CustomInput name="e_4" label="" />
                    <CustomInput name="e_5" label="" />
                    <CustomInput name="e_6" label="" />
                  </div> */}
                  <div dir="ltr">
                    <InputOTP
                      maxLength={6}
                      onChange={(value) => {
                        setOTPValue(value);
                        if (value.length === 6) {
                          console.log("OTP کامل شد:", value);
                          setIsPressedNext((prev) => !prev);
                        }
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                  w-full mt-2 
                  bg-[#3871DD] hover:bg-[#265bb5] 
                  text-white py-3 rounded-xl 
                  font-semibold 
                  border-1 border-black 
                  shadow-[0px_1px_0px_var(--borderDefault)]
                  transition-all duration-300
                "
                    // onClick={() => setIsPressedNext((prev) => !prev)}
                  >
                    ارسال مجدد کد تایید(120)
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Step>
      <Step>
        <div className="flex items-center justify-end mb-12">
          <button
            className="p-2 border-2 border-orange-400 rounded-xl hover:bg-orange-50 transition-colors"
            onClick={() => setIsPressedBack((prev) => !prev)}
          >
            <ArrowLeft className="w-8 h-8 text-orange-400" />
          </button>
        </div>

        <div className="text-right mb-8">
          <h1 className="text-4xl font-extrabold text-[#FF7700] mb-2">
            تقریبا تمومه! رمز عبورت رو بساز
          </h1>
          <p className="text-[#666666] text-sm font-extrabold">
            رمز عبورت باید حداقل ۸ کاراکتر و شامل عدد و علامت خاص باشد تا امنیت
            حسابت حفظ شود
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={step3ValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col items-center gap-4 w-full h-full">
              <CustomInput
                name="password"
                type={showPassword ? "text" : "password"}
                label="رمزعبور"
                icon={showPassword ? <EyeClosed /> : <Eye />}
                onIconClick={() => setShowPassword((prev) => !prev)}
              />

              <CustomInput
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="تکرار رمزعبور"
                icon={showConfirmPassword ? <EyeClosed /> : <Eye />}
                onIconClick={() => setShowConfirmPassword((prev) => !prev)}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full mt-2 
                  bg-[#3871DD] hover:bg-[#265bb5] 
                  text-white py-3 rounded-xl 
                  font-semibold 
                  border-1 border-black 
                  shadow-[0px_1px_0px_var(--borderDefault)]
                  transition-all duration-300
                "
                onClick={() => setIsPressedNext((prev) => !prev)}
              >
                ثبت‌نام
              </Button>
            </Form>
          )}
        </Formik>
      </Step>
    </Stepper>
  );
}

export default SignUp;
