// components/ChallengeManagement/edit/TitleAndDescriptionInput.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/Custom/CustomInput";
import type { ChallengeTitleAndDescriptionInputProps } from "@/types/challengeElementsTypes";

// Yup validation schema
const validationSchema = Yup.object({
  challengeTitle: Yup.string()
    .required("عنوان چالش الزامی است")
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(100, "عنوان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

  challengeDescription: Yup.string()
    .max(500, "توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد")
    .nullable(),
});

const TitleAndDescriptionInput: React.FC<ChallengeTitleAndDescriptionInputProps> = ({
  title = "",
  description = "",
  onTitleChange,
  onDescriptionChange,
}) => {
  return (
    <Formik
      initialValues={{
        challengeTitle: title,
        challengeDescription: description,
      }}
      validationSchema={validationSchema}
      enableReinitialize={true} // این خط حیاتی است! باعث می‌شه وقتی prop تغییر کرد، فرم آپدیت بشه
      onSubmit={() => {}}
    >
      {({ values }) => {
        // هر بار که values تغییر کرد، به والد اطلاع بده (همگام‌سازی با state صفحه)
        React.useEffect(() => {
          onTitleChange(values.challengeTitle);
          onDescriptionChange(values.challengeDescription || "");
        }, [values.challengeTitle, values.challengeDescription]);

        return (
          <Form className="space-y-6 text-right mt-6 max-w-2xl w-full" dir="rtl">
            {/* عنوان چالش */}
            <div>
              <Field name="challengeTitle">
                {({ field }: any) => (
                  <CustomInput
                    {...field}
                    label="عنوان چالش"
                    width="w-full"
                    className="rounded-primary-radius"
                    showError={false} // خطا فقط زیر فیلد نمایش داده بشه
                  />
                )}
              </Field>

            </div>

            {/* توضیحات چالش */}
            <div>
              <Field name="challengeDescription">
                {({ field }: any) => (
                  <CustomInput
                    {...field}
                    as="textarea"
                    rows={5}
                    label="توضیحات چالش"
                    width="w-full"
                    className="rounded-primary-radius resize-none"
                    showError={false}
                  />
                )}
              </Field>

            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TitleAndDescriptionInput;