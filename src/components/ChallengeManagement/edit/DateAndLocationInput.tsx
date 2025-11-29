// components/ChallengeManagement/edit/DateAndLocationInput.tsx
import React from "react";
import { Formik, Form, Field } from "formik";
import CustomInput from "@/components/Custom/CustomInput";

interface DateAndLocationInputProps {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  onStartDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const DateAndLocationInput: React.FC<DateAndLocationInputProps> = ({
  startDate,
  startTime,
  endDate,
  endTime,
  location,
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
  onLocationChange,
}) => {
  return (
    <div className="space-y-4 mt-6 mb-4 text-right w-full max-w-xl">

      {/* تاریخ و زمان شروع */}
      <div className="flex items-center text-sm text-gray-text justify-end w-full gap-3">
        <div className="flex-1 grid grid-cols-2 gap-3">
          <Formik initialValues={{ startDate }} onSubmit={() => {}}>
            {() => (
              <Form>
                <Field name="startDate">
                  {({ field }: any) => (
                    <CustomInput
                      {...field}
                      type="date"
                      value={startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e);
                        onStartDateChange(e.target.value);
                      }}
                      label="تاریخ شروع"
                      className="rounded-primary-radius"
                    />
                  )}
                </Field>
              </Form>
            )}
          </Formik>

          <Formik initialValues={{ startTime }} onSubmit={() => {}}>
            {() => (
              <Form>
                <Field name="startTime">
                  {({ field }: any) => (
                    <CustomInput
                      {...field}
                      type="time"
                      value={startTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e);
                        onStartTimeChange(e.target.value);
                      }}
                      label="زمان شروع"
                      className="rounded-primary-radius"
                    />
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* تاریخ و زمان پایان */}
      <div className="flex items-center text-sm text-gray-text justify-end w-full gap-3">
        <div className="flex-1 grid grid-cols-2 gap-3">
          <Formik initialValues={{ endDate }} onSubmit={() => {}}>
            {() => (
              <Form>
                <Field name="endDate">
                  {({ field }: any) => (
                    <CustomInput
                      {...field}
                      type="date"
                      value={endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e);
                        onEndDateChange(e.target.value);
                      }}
                      label="تاریخ پایان"
                      className="rounded-primary-radius"
                    />
                  )}
                </Field>
              </Form>
            )}
          </Formik>

          <Formik initialValues={{ endTime }} onSubmit={() => {}}>
            {() => (
              <Form>
                <Field name="endTime">
                  {({ field }: any) => (
                    <CustomInput
                      {...field}
                      type="time"
                      value={endTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e);
                        onEndTimeChange(e.target.value);
                      }}
                      label="زمان پایان"
                      className="rounded-primary-radius"
                    />
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* مکان */}
      <div className="flex items-center text-sm text-gray-text justify-end w-full gap-3">
        <Formik initialValues={{ location }} onSubmit={() => {}}>
          {() => (
            <Form className="flex-1">
              <Field name="location">
                {({ field }: any) => (
                  <CustomInput
                    {...field}
                    type="text"
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      onLocationChange(e.target.value);
                    }}
                    label="مکان برگزاری"
                    className="rounded-primary-radius"
                  />
                )}
              </Field>
            </Form>
          )}
        </Formik>
      </div>

    </div>
  );
};

export default DateAndLocationInput;