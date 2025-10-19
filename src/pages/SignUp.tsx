import CustomInput from "@/components/Custom/CustomInput";
import CustomCheckbox from "@/components/Custom/CustomCheckbox";
import CustomBtn from "@/components/Custom/CustomBtn";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import telegramLogo from "../assets/telegram.svg";
import Stepper, { Step } from "../components/ui/Stepper";
import {
  InputOTP,
  InputOTPGroup,
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
  const [timeLeft, setTimeLeft] = useState(10);
  const [emailConfirmDisabled, setDisabled] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleClick = () => {
    setTimeLeft(10);
    setDisabled(true);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setDisabled(false);
    }
  }, [timeLeft]);

  const step1ValidationSchema = Yup.object({
    username: Yup.string()
      .required("وارد کردن نام کاربری الزامی است")
      .min(3, "حداقل ۳ کاراکتر وارد کنید"),

    email: Yup.string()
      .required("وارد کردن پست الکترونیک الزامی است")
      .email("ایمیل وارد شده معتبر نیست"),

    acceptTerms: Yup.boolean()
      .oneOf([true], "باید قوانین و مقررات را بپذیرید")
      .required("پذیرفتن قوانین الزامی است"),
  });

  const step2ValidationSchema = Yup.object({
    username: Yup.string()
      .required("وارد کردن نام کاربری الزامی است")
      .min(3, "حداقل ۳ کاراکتر وارد کنید"),

    email: Yup.string()
      .required("وارد کردن پست الکترونیک الزامی است")
      .email("ایمیل وارد شده معتبر نیست"),
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

              <div className="flex items-center gap-2 self-start" dir="ltr">
                <CustomCheckbox
                  name="acceptTerms"
                  labelText=".قوانین و مقررات را خوانده و می‌پذیرم"
                  classNames={{
                    label: "text-sm text-gray-600 font-extrabold",
                    checkbox: `
                    rounded-[4px]
                    border-[2px] border-[#111]
                    bg-white
                    data-[state=checked]:bg-orange-500
                    data-[state=checked]:text-black
                  `,
                  }}
                />
              </div>
              <CustomBtn
                children="ثبت نام"
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
              />
            </Form>
          )}
        </Formik>
      </Step>
      <Step>
        <div dir="rtl">
          <div>
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

                  <CustomBtn
                    children={
                      emailConfirmDisabled
                        ? `  ارسال مجدد کد ${timeLeft}s`
                        : "ارسال مجدد کد"
                    }
                    type="submit"
                    disabled={isSubmitting || emailConfirmDisabled}
                    className="
                  w-full mt-2 
                  bg-[#3871DD] hover:bg-[#265bb5] 
                  text-white py-3 rounded-xl 
                  font-semibold 
                  border-1 border-black 
                  shadow-[0px_1px_0px_var(--borderDefault)]
                  transition-all duration-300
                "
                    onClick={handleClick}
                  />
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
          {({ isSubmitting, isValid, dirty }) => (
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

              <CustomBtn
                children="ثبت نام"
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
              />
            </Form>
          )}
        </Formik>
      </Step>
    </Stepper>
  );
}

export default SignUp;
