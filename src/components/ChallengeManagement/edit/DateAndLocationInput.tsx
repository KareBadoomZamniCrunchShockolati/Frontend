// components/ChallengeManagement/edit/DateAndLocationInput.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import CustomInput from "@/components/Custom/CustomInput";
import type { DateAndLocationInputProps } from "@/types/challengeCreateTypes";
import { validationDateSchema } from "@/schemas/challengeSchema";

const DateAndLocationInput: React.FC<DateAndLocationInputProps> = ({
  startDate = "",
  startTime = "",
  endDate = "",
  endTime = "",
  location = "",
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
  onLocationChange,
}) => {
  return (
    <Formik
      initialValues={{
        startDate,
        startTime,
        endDate,
        endTime,
        location,
      }}
      validationSchema={validationDateSchema}
      enableReinitialize={true} // وقتی داده از API میاد، فرم آپدیت میشه
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={() => {}}
    >
      {({ values, setTouched }) => {
        // هر تغییری در فرم → فوراً به صفحه والد منتقل بشه
        React.useEffect(() => {
          onStartDateChange(values.startDate);
          onStartTimeChange(values.startTime);
          onEndDateChange(values.endDate);
          onEndTimeChange(values.endTime);
          onLocationChange(values.location || "");
        }, [
          values.startDate,
          values.startTime,
          values.endDate,
          values.endTime,
          values.location,
        ]);

        // تابع برای والد که قبل از ذخیره، خطاها رو نشون بده
        React.useEffect(() => {
          // @ts-ignore - فقط برای دسترسی از ChallengeEdit
          window.forceValidateDateLocation = () => {
            setTouched({
              startDate: true,
              startTime: true,
              endDate: true,
              endTime: true,
              location: true,
            });
          };
        }, [setTouched]);

        return (
          <Form className="space-y-10" dir="rtl">
            {/* تاریخ و زمان شروع */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Field name="startDate">
                    {({ field }: any) => (
                      <CustomInput
                        {...field}
                        type="date"
                        label="تاریخ شروع"
                        showError={false} // خطا فقط زیر فیلد نمایش داده بشه
                      />
                    )}
                  </Field>

                </div>

                <div>
                  <Field name="startTime">
                    {({ field }: any) => (
                      <CustomInput
                        {...field}
                        type="time"
                        label="زمان شروع"
                        showError={false}
                      />
                    )}
                  </Field>

                </div>
              </div>
            </div>

            {/* تاریخ و زمان پایان */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Field name="endDate">
                    {({ field }: any) => (
                      <CustomInput
                        {...field}
                        type="date"
                        label="تاریخ پایان"
                        showError={false}
                      />
                    )}
                  </Field>

                </div>

                <div>
                  <Field name="endTime">
                    {({ field }: any) => (
                      <CustomInput
                        {...field}
                        type="time"
                        label="زمان پایان"
                        showError={false}
                      />
                    )}
                  </Field>

                </div>
              </div>
            </div>

            {/* مکان برگزاری */}
            <div className="space-y-6">
              <Field name="location">
                {({ field }: any) => (
                  <CustomInput
                    {...field}
                    type="text"
                    label="مکان برگزاری"
                    placeholder="اختیاری"
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

export default DateAndLocationInput;