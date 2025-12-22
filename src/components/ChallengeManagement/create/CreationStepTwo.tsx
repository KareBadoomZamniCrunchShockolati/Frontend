// components/ChallengeManagement/create/CreationStepTwo.tsx
import React, { useState, useEffect } from "react"; // ← Add useEffect
import CustomInput from "@/components/Custom/CustomInput";
import CustomSelect from "@/components/Custom/CustomDropList";
import CustomCheckbox from "@/components/Custom/CustomCheckbox";
import { Field } from "formik";
import type { FieldProps } from "formik";
import type { Step2DetailsProps } from "@/types/challengeCreateTypes";

// Use the correct fixed map component
import LocationMapPicker from "@/components/Custom/LocationMap";

const Step2Details: React.FC<Step2DetailsProps> = ({
  categories,
  loadingCategories = false,
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Sync map selection → Formik latitude/longitude
  useEffect(() => {
    if (selectedCoordinates) {
      setFieldValue("latitude", selectedCoordinates.lat);
      setFieldValue("longitude", selectedCoordinates.lng);
    }
  }, [selectedCoordinates, setFieldValue]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedCoordinates({ lat, lng });
  };

  if (loadingCategories) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-text">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-gray border-r-transparent align-[-0.125em]" />
        <p className="mt-4">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!categories?.length) {
    return <div className="text-center py-12 text-error">دسته‌بندی موجود نیست</div>;
  }

  return (
    <div className="w-full max-w-xl mt-1 mb-5 space-y-10">
      {/* دسته‌بندی چالش */}
      <div className="space-y-3">
        <CustomSelect
          name="selectedCategory"
          label="دسته بندی چالش"
          options={categories.map((cat) => ({
            value: cat.name,
            label: cat.name,
          }))}
          error={touched.selectedCategory && errors.selectedCategory}
        />
      </div>

      {/* زمان شروع و پایان */}
      <div className="space-y-6">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <Field name="startDate">
              {({ field, meta }: FieldProps) => (
                <CustomInput {...field} label="تاریخ شروع" type="date" error={meta.touched && meta.error} />
              )}
            </Field>
            <Field name="startTime">
              {({ field, meta }: FieldProps) => (
                <CustomInput {...field} label="ساعت شروع" type="time" error={meta.touched && meta.error} />
              )}
            </Field>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4">
            <Field name="endDate">
              {({ field, meta }: FieldProps) => (
                <CustomInput {...field} label="تاریخ پایان" type="date" error={meta.touched && meta.error} />
              )}
            </Field>
            <Field name="endTime">
              {({ field, meta }: FieldProps) => (
                <CustomInput {...field} label="ساعت پایان" type="time" error={meta.touched && meta.error} />
              )}
            </Field>
          </div>
        </div>
      </div>

      {/* مکان چالش */}
      <div className="space-y-4">
        {/* Address input */}
        <Field name="challengeLocation">
          {({ field, meta }: FieldProps) => (
            <CustomInput
              {...field}
              label="نام مکان (اختیاری)"
              error={meta.touched && meta.error}
            />
          )}
        </Field>

        <div>
          <LocationMapPicker
            onLocationSelect={handleLocationSelect}
            initialPosition={
              values.latitude && values.longitude
                ? [values.latitude, values.longitude]
                : null
            }
            height="h-50"
          />
        </div>

      </div>

      {/* نوع چالش */}
      <div className="mt-6">
        <CustomSelect
          name="challengeType"
          label="نوع چالش"
          options={[
            { value: "عمومی", label: "عمومی" },
            { value: "شخصی", label: "خصوصی" },
          ]}
        />
      </div>

      {/* چک‌باکس کامنت‌ها */}
      <div className="mt-6 flex justify-end">
        <CustomCheckbox
          name="isCommentsEnabled"
          labelText="اجازه دادن به کامنت‌ها"
          checked={values.isCommentsEnabled}
          onChange={() => setFieldValue("isCommentsEnabled", !values.isCommentsEnabled)}
        />
      </div>
    </div>
  );
};

export default Step2Details;