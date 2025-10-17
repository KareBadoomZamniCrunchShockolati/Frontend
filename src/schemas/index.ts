import * as yup from "yup";

// const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const basicSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("ایمیل ضروری است"),
  password: yup
    .string()
    .min(5, "رمز عبور باید حداقل 5 کلمه باشد")
    .required("رمز عبور ضروری است"),
});
