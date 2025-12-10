// components/ChallengeManagement/edit/CategorySelectEdit.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomSelect from "@/components/Custom/CustomDropList";
import type { ChallengeCategory } from "@/services/challengeService";

interface CategorySelectEditProps {
  categories: ChallengeCategory[];
  loading?: boolean;
  selectedCategory: string;
  onCategoryChange: (name: string) => void;
}

const validationSchema = Yup.object({
  selectedCategory: Yup.string().required("انتخاب دسته‌بندی الزامی است"),
});

const CategorySelectEdit: React.FC<CategorySelectEditProps> = ({
  categories,
  loading = false,
  selectedCategory = "",
  onCategoryChange,
}) => {
  return (
    <Formik
      initialValues={{ selectedCategory }}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={() => {}}
    >
      {({ values }) => {
        React.useEffect(() => {
          onCategoryChange(values.selectedCategory);
        }, [values.selectedCategory]);

        if (loading) {
          return <div className="text-center py-6 text-gray-500">در حال بارگذاری...</div>;
        }

        if (!categories.length) {
          return <div className="text-center py-6 text-red-500">دسته‌بندی موجود نیست</div>;
        }

        return (
          <Form className="space-y-3" dir="rtl">
            <Field name="selectedCategory">
              {({ field }: any) => (
                <CustomSelect
                  name="selectedCategory"
                  label="دسته‌بندی چالش"
                  options={categories.map((cat) => ({
                    value: cat.name,
                    label: cat.name,
                  }))}
                  showError={false}
                />
              )}
            </Field>

            <ErrorMessage name="selectedCategory">
              {(msg) => (
                <div className="text-red-500 text-sm mt-1 text-right pr-1">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CategorySelectEdit;