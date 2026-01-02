import CustomButton from "@/components/Custom/CustomButton";
import CustomToast from "@/components/Custom/CustomToast";
import LoadingPage from "@/components/Custom/LoadingPage";
import useUserStore from "@/store/userStore/userStore";
import { ArrowLeft, ArrowRight, Upload, FileX } from "lucide-react";
import { useState, useEffect } from "react";
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
import { updatePostService, getPostService } from "@/services/postService";
import AutocompleteSingleSelect from "@/components/Custom/AutocompleteSingleSelect";
import type { ChallengePreview, PostResponse } from "@/types/postTypes";
import type { SimpleChallenge } from "@/types/createPostFormTypes";
import { getParticipatingChallengesService } from "@/services/postService";
import { getBackendErrorMessage } from "@/services/errorService";

const EditPost = () => {
  const { token, userId } = useUserStore.getState();
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<SimpleChallenge[]>([]);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const isOwnerViewing = ownerId === userId;
  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching post data for postId:", postId);
        const response: PostResponse = await getPostService(Number(postId));
        console.log("Post data received:", response);
        setInitialData(response);
        setOwnerId(response.user_id);

        if (response.pictures && response.pictures.length > 0) {
          setImageURLs(response.pictures);
        }
      } catch (err) {
        CustomToast(getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

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
        CustomToast(getBackendErrorMessage(err), "error");
      }
    };

    fetchChallenges();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newURLs = newFiles.map((file) => URL.createObjectURL(file));

      if (images.length + newFiles.length > 5) {
        CustomToast("حداکثر ۵ تصویر مجاز است", "error");
        return;
      }

      setImages((prev) => [...prev, ...newFiles]);
      setImageURLs((prev) => [...prev, ...newURLs]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImageURLs = [...imageURLs];
    newImageURLs.splice(index, 1);
    setImageURLs(newImageURLs);

    if (index < images.length) {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!postId) {
      CustomToast("شناسه پست معتبر نیست", "error");
      return;
    }

    if (imageURLs.length > 5) {
      CustomToast("حداکثر ۵ تصویر مجاز است", "error");
      return;
    }

    const dto = {
      description: values.description || undefined,
      pictures: imageURLs.length > 0 ? imageURLs : undefined,
      challengeID: values.challengeID || undefined,
    };

    try {
      await updatePostService({
        id: Number(postId),
        ...dto,
      });

      CustomToast("ویرایش پست با موفقیت انجام شد", "success");
      navigate(`/post/${postId}`);
    } catch (err) {
      CustomToast(getBackendErrorMessage(err), "error");
    }
  };

  if (!token) {
    CustomToast("ابتدا باید وارد حساب کاربری شوید!", "error");
    return (
      <div className="min-h-screen bg-background text-center text-foreground mt-10 text-lg font-medium">
        ابتدا باید وارد حساب کاربری شوید!
      </div>
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">پست یافت نشد</p>
      </div>
    );
  }

  return (
    <>
      {isOwnerViewing && (
        <div className="flex items-center bg-background justify-between mt-5 mr-5 ml-5">
          <button
            className="p-2 border-2 border-foreground rounded-xl hover:bg-muted transition-colors"
            onClick={() => navigate(`/dashboard/${userId}`)}
          >
            <ArrowLeft className="w-8 h-8 text-primary" />
          </button>
          <p className="text-center font-bold text-title text-primary">
            ویرایش پست
          </p>
        </div>
      )}

      <Formik
        initialValues={{
          description: initialData.description || "",
          challengeID: initialData.challengeID || null,
        }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form className="flex-1 flex flex-col">
            <div className="flex flex-col items-center gap-2 mr-5 ml-5 mt-4">
              <label className="w-full h-64 border-2 border-foreground rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden bg-card">
                {imageURLs.length > 0 ? (
                  <Carousel className="w-full h-full relative">
                    <CarouselContent className="h-full">
                      {imageURLs.map((imgUrl, index) => (
                        <CarouselItem
                          key={index}
                          className="w-full h-full flex items-center justify-center relative"
                        >
                          <FileX
                            className="absolute top-2 right-2 w-6 h-6 text-destructive cursor-pointer z-20 bg-card rounded-full p-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteImage(index);
                            }}
                          />
                          <img
                            src={imgUrl}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-contain"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {imageURLs.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-card rounded-full p-1 shadow-md z-20" />
                        <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-card rounded-full p-1 shadow-md z-20" />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <span className="text-muted-foreground font-bold text-center">
                    پیش‌نمایش
                  </span>
                )}
              </label>

              <CustomButton
                type="button"
                className="relative flex items-center w-full bg-secondary"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={imageURLs.length >= 5}
                />
                <p className="text-center text-base">
                  {imageURLs.length >= 5
                    ? "حداکثر تصویر رسیده"
                    : "افزودن تصویر"}
                </p>
                <Upload className="absolute right-5 !w-6 !h-6" />
              </CustomButton>
              <p className="text-xs text-neutral-gray">
                {imageURLs.length}/5 تصویر
              </p>
            </div>

            <div className="mr-5 ml-5 mt-4 flex-1">
              <CustomInput
                name="description"
                label="توضیحات"
                width="w-full"
                className="h-32 rounded-xl"
                as="textarea"
              />
            </div>

            <div className="mr-5 ml-5 mt-2">
              <p className="text-right text-xl font-bold mb-2">
                چالش مربوطه (اختیاری)
              </p>
              <AutocompleteSingleSelect
                items={challenges}
                value={
                  challenges.find((c) => c.id === values.challengeID)?.name ||
                  ""
                }
                onChange={(selected: SimpleChallenge | null) =>
                  setFieldValue("challengeID", selected ? selected.id : null)
                }
                placeHolder="انتخاب چالش"
              />
            </div>

            <div className="mt-10 mr-5 ml-5 pb-6">
              <CustomButton
                type="submit"
                className="bg-secondary w-full mb-2"
                disabled={loading}
              >
                <p className="text-center text-base">ذخیره تغییرات</p>
                <ArrowRight className="!w-6 !h-6" />
              </CustomButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditPost;