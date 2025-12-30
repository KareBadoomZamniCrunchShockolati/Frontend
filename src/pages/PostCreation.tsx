import CustomButton from "@/components/Custom/CustomButton";
import CustomToast from "@/components/Custom/CustomToast";
import useUserStore from "@/store/userStore/userStore";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import { Formik, Form } from "formik";
import AutocompleteSingleSelect from "@/components/Custom/AutocompleteSingleSelect";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type {
  CreatePostFormValues,
  SimpleChallenge,
} from "@/types/createPostFormTypes";
import {
  createPostService,
  getParticipatingChallengesService,
} from "@/services/postService";
import type { ChallengePreview, PostResponse } from "@/types/postTypes";

const PostCreation = () => {
  const { token, userId } = useUserStore.getState();
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  if (!token) {
    CustomToast("باید اول به اکانت خود وارد شوید", "error");
    return (
      <div className="min-h-screen bg-background text-center text-foreground mt-8 text-lg font-medium">
        باید اول به اکانت خود وارد شوید
      </div>
    );
  }

  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);

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

  const [challenges, setChallenges] = useState<SimpleChallenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const fullChallenges = await getParticipatingChallengesService();

        const simpleChallenges: SimpleChallenge[] = fullChallenges.map(
          (c: ChallengePreview) => ({
            id: c.id,
            name: c.title,
          })
        );

        setChallenges(simpleChallenges);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChallenges();
  }, []);

  const handleSubmit = async (values: CreatePostFormValues) => {
    console.log("Submitting post with values:", values);
    const response: PostResponse = await createPostService({
      description: values.description,
      challenge_id: values.challengeID,
      pictures: ["images_placeholder"],
    });
    CustomToast("پست با موفقیت ایجاد شد!", "success");
    console.log("Post submitted:", response);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <div className="flex items-center justify-between mt-4 mr-[24px] ml-[24px]">
        <button
          className="p-2 border-2 border-foreground rounded-xl hover:bg-muted transition-colors"
          onClick={() => navigate(`/dashboard/${userId}`)}
        >
          <ArrowLeft className="w-8 h-8 text-primary" />
        </button>

        <p className="text-center font-bold text-title text-primary">
          ساخت پست
        </p>
      </div>

      <Formik
        initialValues={{
          description: "",
          challengeID: null,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="flex-1 flex flex-col">
            <div className="flex flex-col items-center gap-2 mr-[24px] ml-[24px] mt-[20px]">
              <label className="w-full h-64 border-2 border-foreground rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden bg-card">
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

                    <CarouselPrevious
                      type="button"
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-card rounded-full p-1 shadow-md z-20"
                    />
                    <CarouselNext
                      type="button"
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-card rounded-full p-1 shadow-md z-20"
                    />
                  </Carousel>
                ) : (
                  <span className="text-muted-foreground font-bold text-center">
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
                <p className="text-center text-base">بارگذاری تصویر</p>
                <Upload className="absolute right-5 !w-[25px] !h-[25px]" />
              </CustomButton>
            </div>

            <div className="mr-[24px] ml-[24px] mt-[22.5px] flex-1">
              <CustomInput
                name="description"
                label="توضیحات"
                width="w-full"
                className="h-32 rounded-xl"
                as="textarea"
              />
            </div>

            <div className="mr-[24px] ml-[24px] mt-[12.5px]">
              <p className="text-right text-xl font-bold mb-2">
                چالش مربوطه (اختیاری)
              </p>
              <AutocompleteSingleSelect
                items={challenges}
                value={
                  challenges.find((c) => c.id === values.challengeID)?.name ||
                  ""
                }
                onChange={(item) => {
                  setFieldValue("challengeID", item.id);
                }}
                placeHolder="انتخاب چالش"
              />
            </div>

            <div className="mt-10 mr-[24px] ml-[24px] pb-6">
              <CustomButton
                type="submit"
                className="h-[46.6px] bg-secondary w-full"
                pageAddress={`/dashboard/${userId}`}
              >
                <p className="text-center text-base">ساخت</p>
                <ArrowRight className="!w-[25px] !h-[25px]" />
              </CustomButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PostCreation;