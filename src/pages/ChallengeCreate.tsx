// ChallengeCreate.tsx — حالا فالوئرهای واقعی رو نشون می‌ده (به جای mockUsers)
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import BackButtonWithSteps from "@/components/ChallengeManagement/create/BackButtonWithSteps";
import CustomButton from "@/components/Custom/CustomButton";
import Step1BasicInfo from "@/components/ChallengeManagement/create/CreationStepOne";
import Step2Details from "@/components/ChallengeManagement/create/CreationStepTwo";
import Step3Members from "@/components/ChallengeManagement/create/CreationStepThree";
import CustomToast from "@/components/Custom/CustomToast";
import useUserStore from "@/store/userStore/userStore";
import type { UserProfile } from "@/types/userTypes";
import { fetchUsers } from "@/services/followerFollowingService";

const ChallengeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Step 2
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  // Step 3 — واقعی
  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);

  // داده‌های واقعی فالوئرها
  const [fetchedUsers, setFetchedUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useUserStore((state) => state.token);
  const userId = useUserStore((state) => state.userId);

  const mockCategories = ["ورزش", "سلامت", "آموزش", "محیط زیست", "فرهنگ", "تکنولوژی", "هنر", "غذا"];
  const categoryNameToId: Record<string, number> = {
    ورزش: 1,
    سلامت: 2,
    آموزش: 3,
    "محیط زیست": 4,
    فرهنگ: 5,
    تکنولوژی: 6,
    هنر: 7,
    غذا: 8,
  };
  const getCategoryId = (name: string) => categoryNameToId[name] || 1;

  const filteredCategories = mockCategories.filter(
    (c) => c.includes(categorySearch) && !selectedCategories.includes(c)
  );

  // بارگذاری فالوئرها (فقط یک بار یا وقتی userId تغییر کرد)
  useEffect(() => {
    const loadFollowers = async () => {
      if (!userId || !token) return;

      setLoadingUsers(true);
      setUsersError(null);

      try {
        const users = await fetchUsers(userId.toString(), "followers");
        setFetchedUsers(users || []);
      } catch (error: any) {
        console.error("Failed to fetch followers:", error);
        setUsersError("خطا در بارگذاری فالوئرها");
        CustomToast("خطا در بارگذاری فالوئرها", "error");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadFollowers();
  }, [userId, token]);

  // لیست کاربران قابل انتخاب (فیلتر شده بر اساس سرچ و حذف انتخاب‌شده‌ها)
  const availableUsers = useMemo(() => {
    return fetchedUsers
      .filter((u) => !selectedUsers.some((s) => s.id === u.id))
      .filter((u) =>
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.full_name?.toLowerCase()?.includes(userSearch.toLowerCase()) ?? false)
      );
  }, [fetchedUsers, selectedUsers, userSearch]);

  const handleBack = () => (currentStep === 1 ? navigate(-1) : setCurrentStep((s) => s - 1));
  const handleNext = () => currentStep < 3 && setCurrentStep((s) => s + 1);

  const addUser = (user: UserProfile, memberCount: string) => {
    const limit = parseInt(memberCount) || 0;
    if (selectedUsers.some((u) => u.id === user.id)) return;
    if (limit > 0 && selectedUsers.length >= limit) {
      CustomToast("تعداد اعضای مجاز پر شده است!", "warning");
      return;
    }
    setSelectedUsers((p) => [...p, user]);
    setUserSearch("");
  };

  const removeUser = (id: string) => setSelectedUsers((p) => p.filter((u) => u.id !== id));

  const handleFinish = async (values: any) => {
    if (isSubmitting || !token) {
      CustomToast("لطفاً وارد حساب کاربری شوید", "error");
      return;
    }

    setIsSubmitting(true);

    let start_time = new Date().toISOString();
    let end_time = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (values.startDate && values.startTime) start_time = `${values.startDate}T${values.startTime}:00Z`;
    if (values.endDate && values.endTime) end_time = `${values.endDate}T${values.endTime}:59Z`;

    const visibility = values.challengeType === "شخصی" ? "private" : "public";

    const payload = {
      title: challengeTitle.trim(),
      description: challengeDescription.trim(),
      category_id: selectedCategories.length > 0 ? getCategoryId(selectedCategories[0]) : 1,
      max_participants: values.memberCount ? parseInt(values.memberCount) : null,
      visibility,
      rule: values.challengeRule?.trim() || "none",
      comments_enabled: values.isCommentsEnabled,
      start_time,
      end_time,
      timezone: "UTC",
      image_url: image || null,
    };

    try {
      // 1. ساخت چالش
      const createRes = await fetch("http://localhost:8080/api/v1/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const text = await createRes.text();
      if (!createRes.ok) throw new Error(JSON.parse(text)?.message || "خطا در ساخت چالش");

      const result = JSON.parse(text);
      const challengeId = result.data?.ID;
      if (!challengeId) throw new Error("challengeId دریافت نشد");

      CustomToast("چالش با موفقیت ساخته شد!", "success");

      // 2. دعوت کاربران
      if (selectedUsers.length > 0) {
        for (const user of selectedUsers) {
          const inviteUrl = `http://localhost:8080/api/v1/challenges/${challengeId}/invite`;
          const userIdAsNumber = Number(user.id);

          try {
            const res = await fetch(inviteUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ invitee_id: userIdAsNumber }),
            });

            if (!res.ok) {
              const errText = await res.text();
              console.error(`دعوت ${user.username} ناموفق:`, errText);
            }
          } catch (err: any) {
            console.error(`خطای شبکه برای ${user.username}:`, err.message);
          }
        }
        CustomToast(`دعوت به ${selectedUsers.length} نفر ارسال شد!`, "success");
      }

      navigate(`/challenge/${challengeId}`, { replace: true });
    } catch (err: any) {
      CustomToast(err.message || "خطایی رخ داد", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 items-center">
      <div className="flex justify-center items-center w-full max-w-xl mb-10 mt-4">
        <BackButtonWithSteps onClick={handleBack} />
        <div className="flex justify-end flex-1">
          <span className="text-primary text-3xl font-bold">ساخت چالش</span>
        </div>
      </div>

      <Formik
        initialValues={{
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          challengeLocation: "",
          challengeRule: "",
          isCommentsEnabled: true,
          challengeType: "عمومی",
          memberCount: "",
        }}
        enableReinitialize
        onSubmit={(values) => currentStep === 3 && handleFinish(values)}
      >
        {({ values }) => {
          const canAddMore = !values.memberCount || selectedUsers.length < parseInt(values.memberCount);

          return (
            <Form className="flex-1 flex flex-col mt-10 justify-start items-center w-full">
              {currentStep === 1 && (
                <Step1BasicInfo
                  title={challengeTitle}
                  description={challengeDescription}
                  image={image}
                  onTitleChange={setChallengeTitle}
                  onDescriptionChange={setChallengeDescription}
                  onImageChange={setImage}
                />
              )}

              {currentStep === 2 && (
                <Step2Details
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  categorySearch={categorySearch}
                  setCategorySearch={setCategorySearch}
                  filteredCategories={filteredCategories}
                  values={values}
                  setFieldValue={() => {}}
                />
              )}

              {currentStep === 3 && (
                <Step3Members
                  values={values}
                  userSearch={userSearch}
                  setUserSearch={setUserSearch}
                  selectedUsers={selectedUsers}
                  removeUser={removeUser}
                  availableUsers={availableUsers}
                  addUser={(u: UserProfile) => addUser(u, values.memberCount)}
                  canAddMore={canAddMore}
                  loadingUsers={loadingUsers}   // اضافه شد
                  usersError={usersError}       // اضافه شد
                />
              )}

              <div className="flex flex-col items-center w-full mt-10">
                <CustomButton
                  type={currentStep === 3 ? "submit" : "button"}
                  onClick={currentStep < 3 ? handleNext : undefined}
                  disabled={isSubmitting}
                  className={`w-full max-w-xl rounded-primary-radius p-5 text-lg transition-all
                    ${currentStep === 3 ? "bg-primary text-white" : "bg-secondary text-white"}
                    ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      در حال ثبت...
                    </span>
                  ) : currentStep === 3 ? (
                    "ثبت چالش"
                  ) : (
                    "بعدی"
                  )}
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