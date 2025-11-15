import CustomButton from "@/components/Custom/CustomButton";
import CustomToast from "@/components/Custom/CustomToast";
import useUserStore from "@/store/userStore/userStore";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import { Formik, Form } from "formik";
import AutocompleteSingleSelect from "@/components/Custom/AutocompleteSingleSelect";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const PostCreation = () => {
  const { token, userId } = useUserStore.getState();

  if (!token) {
    CustomToast("you need to login first!", "error");
    return <div>you need to login first!</div>;
  }

  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newFiles]);
    }
  };

  const challenges = [
    { id: 1, name: "چالش روزی 8 لیوان آب خوردن" },
    { id: 2, name: "چالش پیاده‌روی هفتگی" },
    { id: 3, name: "چالش سلام دادن با افراد غریبه" },
    { id: 4, name: "چالش شنا کردن" },
    { id: 5, name: "چالش میو میو کردن" },
  ];

  return (
    <>
      <div className="flex items-center justify-between mt-[20px] mr-[24px] ml-[24px]">
        <button
          className="p-2 border-2 border-primary rounded-xl hover:bg-primary-hover transition-colors"
          onClick={() => navigate(`/dashboard/${userId}`)}
        >
          <ArrowLeft className="w-8 h-8 text-primary" />
        </button>

        <p className="text-center font-bold text-title text-primary">
          ساخت پست
        </p>
      </div>

      {/* FORM */}
      <Formik
        initialValues={{
          description: "",
          challenge: "",
        }}
        onSubmit={(values) => {
          if (!images) {
            CustomToast("لطفا تصویر را بارگذاری کنید", "error");
            return;
          }

          console.log("Form submitted:", { ...values, image: images });
          CustomToast("پست با موفقیت ساخته شد!", "success");
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Image preview + Upload */}
            <div className="flex flex-col items-center gap-2 mr-[24px] ml-[24px] mt-[20px]">
              <label className="w-full h-64 border-2 border-gray-400 rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden">
                {images.length > 0 ? (
                  <Carousel className="w-full h-full relative">
                    <CarouselContent className="h-full">
                      {images.map((img, index) => (
                        <CarouselItem key={index} className="w-full h-full flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-contain"
                            />
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Absolute buttons on the edges of the label */}
                    <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-20" />
                    <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-20" />
                  </Carousel>
                ) : (
                  <span className="text-neutral-gray font-bold text-center">
                    پیش‌نمایه
                  </span>
                )}
              </label>

              <CustomButton
                width="w-full"
                backgroundColor="bg-secondary"
                className="relative flex items-center"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-center text-base">بارگذاری تصویر</p>
                <Upload className="absolute right-5 !w-[25px] !h-[25px]" />
              </CustomButton>
            </div>

            {/* Description */}
            <div className="mr-[24px] ml-[24px] mt-[22.5px]">
              {/* <p className="text-right text-xl font-bold mb-2">توضیحات</p> */}
              <CustomInput
                name="description"
                label="توضیحات"
                width="w-full"
                className="h-32 rounded-xl"
                isTextarea={true}
              />
            </div>

            {/* challenge selector */}
            <div className="mr-[24px] ml-[24px] mt-[12.5px]">
              <p className="text-right text-xl font-bold mb-2">
                چالش مربوطه (اختیاری)
              </p>
              <AutocompleteSingleSelect
                items={challenges}
                value={values.challenge}
                onChange={(val) => {
                  setFieldValue("challenge", val);
                  console.log("Challenge selected:", val);
                }}
                placeHolder="انتخاب چالش"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-10 mr-[24px] ml-[24px]">
              <CustomButton
                width="w-full"
                backgroundColor="bg-secondary"
                height="h-[46.6px]"
              >
                <p className="text-center text-base">ساخت</p>
                <ArrowRight className="!w-[25px] !h-[25px]" />
              </CustomButton>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PostCreation;
