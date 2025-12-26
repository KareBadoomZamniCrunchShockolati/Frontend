// src/pages/ChallengeCreate.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import BackButtonWithSteps from "@/components/ChallengeManagement/create/BackButtonWithSteps";
import CustomButton from "@/components/Custom/CustomButton";
import Step1BasicInfo from "@/components/ChallengeManagement/create/CreationStepOne";
import Step2Details from "@/components/ChallengeManagement/create/CreationStepTwo";
import Step3Members from "@/components/ChallengeManagement/create/CreationStepThree";
import CustomToast from "@/components/Custom/CustomToast";
import LoadingPage from "@/components/Custom/LoadingPage";
import useUserStore from "@/store/userStore/userStore";
import type { UserProfile } from "@/types/userTypes";
import { fetchUsers } from "@/services/followerFollowingService";
import {
  createChallenge,
  inviteMultipleUsersToChallenge,
  fetchChallengeCategories,
} from "@/services/challengeService";
import type { ChallengeCategoryType } from "@/types/challengeCreateTypes";
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/schemas/challengeSchema";
import type { createFormValues } from "@/types/challengeCreateTypes";

const ChallengeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [fetchedUsers, setFetchedUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [categories, setCategories] = useState<ChallengeCategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const token = useUserStore((s) => s.token);
  const userId = useUserStore((s) => s.userId);

  useEffect(() => {
    if (!userId || !token) return;
    const load = async () => {
      setLoadingUsers(true);
      try {
        const users = await fetchUsers(userId.toString(), "followers");
        setFetchedUsers(users || []);
      } catch {
        CustomToast("خطا در بارگذاری فالوئرها", "error");
      } finally {
        setLoadingUsers(false);
      }
    };
    load();
  }, [userId, token]);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const cats = await fetchChallengeCategories();
        setCategories(cats);
      } catch (err) {
        CustomToast("خطا در بارگذاری دسته‌بندی‌ها", "error");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const initialValues: createFormValues & {
    latitude?: number | null;
    longitude?: number | null;
  } = {
    title: "",
    description: "",
    image: null,
    selectedCategory: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    challengeLocation: "",
    latitude: null,
    longitude: null,
    challengeType: "عمومی",
    isCommentsEnabled: true,
    memberCount: "",
    selectedUsers: [],
  };

  const handleNext = async (
    values: any,
    setTouched: (touched: any) => void,
    setErrors: (errors: any) => void
  ) => {
    let schema;
    if (currentStep === 1) schema = step1Schema;
    else if (currentStep === 2) schema = step2Schema;
    else if (currentStep === 3) schema = step3Schema;

    if (!schema) {
      setCurrentStep((s) => s + 1);
      return;
    }

    try {
      await schema.validate(values, { abortEarly: false });
      setCurrentStep((s) => s + 1);
    } catch (validationErrors: any) {
      const newErrors: any = {};
      const newTouched: any = {};

      validationErrors.inner.forEach((err: any) => {
        newErrors[err.path] = err.message;
        newTouched[err.path] = true;
      });

      setErrors(newErrors);
      setTouched(newTouched);
    }
  };

  const handleSubmit = async (
    values: createFormValues & { latitude?: number | null; longitude?: number | null },
    { setSubmitting }: FormikHelpers<any>
  ) => {
    if (!token) {
      CustomToast("لطفاً وارد حساب کاربری شوید", "error");
      return;
    }

    if (!values.selectedCategory) {
      CustomToast("لطفاً یک دسته‌بندی انتخاب کنید", "error");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);

    try {
      const start_time = `${values.startDate}T${values.startTime}:00Z`;
      const end_time = `${values.endDate}T${values.endTime}:59Z`;

      const selectedCat = categories.find((c) => c.name === values.selectedCategory);
      if (!selectedCat) {
        throw new Error("دسته‌بندی معتبر یافت نشد");
      }

      const payload = {
        title: values.title.trim(),
        description: values.description.trim() || null,
        category_id: selectedCat.id,
        max_participants: values.memberCount ? parseInt(values.memberCount, 10) : null,
        visibility: values.challengeType === "خصوصی" ? "private" : "public",
        rule: "Participate actively",
        comments_enabled: values.isCommentsEnabled,
        start_time,
        end_time,
        timezone: "UTC",
        image_url: values.image || "",
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
        address: values.challengeLocation.trim() || null,
      };

      console.log("Sending payload:", payload);

      const response = await createChallenge(payload);
      const challengeId = response?.data?.ID;

      if (!challengeId) {
        throw new Error("چالش ساخته نشد — پاسخ نامعتبر");
      }

      CustomToast("چالش با موفقیت ساخته شد!", "success");

      if (values.selectedUsers.length > 0) {
        const userIds = values.selectedUsers.map((u) => u.id);
        try {
          const results = await inviteMultipleUsersToChallenge(challengeId, userIds);
          const failed = results.filter((r: any) => !r.success).length;
          CustomToast(
            failed === 0
              ? "همه دعوت‌ها با موفقیت ارسال شد"
              : `${failed} دعوت ناموفق بود`,
            failed === 0 ? "success" : "warning"
          );
        } catch (inviteErr) {
          CustomToast("خطا در ارسال برخی دعوت‌ها", "warning");
        }
      }

      navigate(`/challenge/${challengeId}`, { replace: true });
    } catch (err: any) {
      console.error("Challenge creation failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.details?.details ||
        err.message ||
        "خطا در ساخت چالش — لطفاً ورودی‌ها را بررسی کنید";
      CustomToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col p-4 items-center bg-white">
      <div className="flex justify-center items-center w-full max-w-xl mb-10 mt-4">
        <BackButtonWithSteps
          onClick={() =>
            currentStep === 1 ? navigate(-1) : setCurrentStep((s) => s - 1)
          }
        />
        <div className="flex justify-end flex-1">
          <span className="text-primary text-3xl font-bold">ساخت چالش</span>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({
          values,
          setFieldValue,
          setFieldTouched,
          setTouched,
          setErrors,
          isSubmitting,
          errors,
          touched,
        }) => {
          const availableUsers = fetchedUsers
            .filter((u) => !values.selectedUsers.some((s) => s.id === u.id))
            .filter(
              (u) =>
                u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
                (u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ?? false)
            );

          const canAddMore =
            !values.memberCount ||
            values.selectedUsers.length < parseInt(values.memberCount || "0", 10);

          return (
            <Form className="flex-1 flex flex-col mt-10 justify-start items-center w-full">
              {currentStep === 1 && (
                <Step1BasicInfo
                  title={values.title}
                  description={values.description}
                  image={values.image}
                  onTitleChange={(v) => setFieldValue("title", v)}
                  onDescriptionChange={(v) => setFieldValue("description", v)}
                  onImageChange={(img) => setFieldValue("image", img)}
                  errors={{
                    title: touched.title && errors.title,
                    description: touched.description && errors.description,
                  }}
                />
              )}

              {currentStep === 2 && (
                <Step2Details
                  categories={categories}
                  loadingCategories={loadingCategories} // now always false here
                  values={values}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors={{
                    selectedCategory: touched.selectedCategory && errors.selectedCategory,
                    startDate: touched.startDate && errors.startDate,
                    startTime: touched.startTime && errors.startTime,
                    endDate: touched.endDate && errors.endDate,
                    endTime: touched.endTime && errors.endTime,
                    challengeLocation: touched.challengeLocation && errors.challengeLocation,
                  }}
                  touched={touched}
                />
              )}

              {currentStep === 3 && (
                <Step3Members
                  values={values}
                  userSearch={userSearch}
                  setUserSearch={setUserSearch}
                  selectedUsers={values.selectedUsers}
                  removeUser={(id) =>
                    setFieldValue(
                      "selectedUsers",
                      values.selectedUsers.filter((u) => u.id !== id)
                    )
                  }
                  availableUsers={availableUsers}
                  addUser={(user) => {
                    if (!canAddMore) {
                      CustomToast("حداکثر تعداد عضو پر شده", "warning");
                      return;
                    }
                    setFieldValue("selectedUsers", [...values.selectedUsers, user]);
                  }}
                  canAddMore={canAddMore}
                  loadingUsers={loadingUsers}
                />
              )}

              <div className="flex flex-col items-center w-full mt-10">
                <CustomButton
                  type={currentStep === 3 ? "submit" : "button"}
                  onClick={
                    currentStep < 3
                      ? () => handleNext(values, setTouched, setErrors)
                      : undefined
                  }
                  disabled={isSubmitting}
                  className={`w-full max-w-xl rounded-primary-radius p-5 text-lg transition-all text-white flex items-center justify-center gap-3
                    ${currentStep === 3 ? "bg-primary" : "bg-secondary"}
                    ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting && (
                    <div
                      className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-solid border-white border-r-transparent"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  )}

                  {isSubmitting
                    ? "در حال ثبت..."
                    : currentStep === 3
                      ? "ثبت چالش"
                      : "بعدی"}
                </CustomButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ChallengeCreate;