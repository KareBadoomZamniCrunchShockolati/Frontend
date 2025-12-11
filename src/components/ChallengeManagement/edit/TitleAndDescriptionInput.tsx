// components/ChallengeManagement/edit/TitleAndDescriptionInput.tsx
import React from "react";
import { Formik, Form, Field } from "formik";
import CustomInput from "@/components/Custom/CustomInput";
import type { ChallengeTitleAndDescriptionInputProps } from "@/types/challengeElementsTypes";
import { editValidationSchema } from "@/schemas/challengeSchema";

const TitleAndDescriptionInput: React.FC<
  ChallengeTitleAndDescriptionInputProps
> = ({ title = "", description = "", onTitleChange, onDescriptionChange }) => {
  return (
    <Formik
      initialValues={{
        challengeTitle: title,
        challengeDescription: description,
      }}
      validationSchema={editValidationSchema}
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
          <Form
            className="space-y-6 text-right mt-6 max-w-2xl w-full"
            dir="rtl"
          >
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
