import CustomButton from "@/components/Custom/CustomButton";
import CustomToast from "@/components/Custom/CustomToast";
import useUserStore from "@/store/userStore/userStore";
import { ArrowLeft, ArrowRight, Upload, FileX } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "@/components/Custom/CustomInput";
import { Formik, Form } from "formik";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { updatePostService } from "@/services/userService"; // 🔹 سرویس آپدیت پست

const EditPost = () => {
  const { token, userId } = useUserStore.getState();
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!token) {
    CustomToast("You need to login first!", "error");
    return <div>you need to login first!</div>;
  }

  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newURLs = newFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => [...prev, ...newFiles]);
      setImageURLs((prev) => [...prev, ...newURLs]);
    }
  };

  const handleDelete = (index: number) => {
    URL.revokeObjectURL(imageURLs[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: any) => {
    if (!postId) {
      CustomToast("شناسه پست معتبر نیست", "error");
      return;
    }

    // محدودیت حداکثر 5 تصویر
    if (images.length > 5) {
      CustomToast("حداکثر ۵ تصویر مجاز است", "error");
      return;
    }

    // 🔹 اگر لازم است ابتدا تصاویر را آپلود کنید و URL ها را بگیرید
    // فرض می‌کنیم همین imageURLs قابل ارسال است
    const dto = {
      description: values.description || undefined,
      pictures: imageURLs.length > 0 ? imageURLs : undefined,
    };

    try {
      await updatePostService(Number(postId), dto);
      CustomToast("ویرایش پست با موفقیت انجام شد", "success");
      navigate(`/dashboard/${userId}`);
    } catch (err) {
      console.error(err);
      CustomToast("خطا در ویرایش پست", "error");
    }
  };

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
          ویرایش پست
        </p>
      </div>

      <Formik
        initialValues={{
          description: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* پیش نمایش تصاویر */}
            <div className="flex flex-col items-center gap-2 mr-[24px] ml-[24px] mt-[20px]">
              <label className="w-full h-64 border-2 border-gray-400 rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden">
                {images.length > 0 ? (
                  <Carousel className="w-full h-full relative">
                    <CarouselContent className="h-full">
                      {images.map((img, index) => (
                        <CarouselItem
                          key={index}
                          className="w-full h-full flex items-center justify-center relative"
                        >
                          <FileX
                            className="absolute top-2 right-2 w-6 h-6 text-destructive cursor-pointer z-20"
                            onClick={() => handleDelete(index)}
                          />
                          <img
                            src={imageURLs[index]}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-contain"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-20" />
                    <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-20" />
                  </Carousel>
                ) : (
                  <span className="text-neutral-gray font-bold text-center">
                    پیش‌نمایه
                  </span>
                )}
              </label>

              <CustomButton className="relative flex items-center w-full bg-secondary">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-center text-base">افزودن تصویر</p>
                <Upload className="absolute right-5 !w-[25px] !h-[25px]" />
              </CustomButton>
            </div>

            {/* توضیحات */}
            <div className="mr-[24px] ml-[24px] mt-[22.5px]">
              <CustomInput
                name="description"
                label="توضیحات"
                width="w-full"
                className="h-32 rounded-xl"
                as="textarea"
              />
            </div>

            {/* دکمه ذخیره */}
            <div className="mt-10 mr-[24px] ml-[24px]">
              <CustomButton
                type="submit"
                className="h-[46.6px] bg-secondary w-full mb-2"
              >
                <p className="text-center text-base">ذخیره تغییرات</p>
                <ArrowRight className="!w-[25px] !h-[25px]" />
              </CustomButton>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditPost;
