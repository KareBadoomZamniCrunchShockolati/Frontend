import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import type { FieldProps } from "formik";
import BackButtonWithSteps from "@/components/ChallengeManagement/create/BackButtonWithSteps";
import TitleAndDescription from "@/components/ChallengeManagement/create/TitleAndDescription";
import CustomButton from "@/components/Custom/CustomButton";
import { Upload, Search } from "lucide-react";
import CustomInput from "@/components/Custom/CustomInput";
import CustomCheckbox from "@/components/Custom/CustomCheckbox";
import CustomSelect from "@/components/ChallengeManagement/create/CustomDropList";
import UserCardListToAdd from "@/components/ChallengeManagement/create/UserCardListToAdd";

// Define types
interface User {
  id: string;
  username: string;
  imagePath: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  doneChallengesCount: number;
}

interface ChallengeData {
  title: string;
  description: string;
  dateRange: string;
  location: string;
  Img: string | null;
  commentsEnabled: boolean;
  categories: string[];
  type: string;
  memberCount: string;
  members: User[];
}

const ChallengeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Step 2 – categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  // Step 3 – users
  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [memberLimitError, setMemberLimitError] = useState(false); // NEW: error when limit exceeded

  // Mock data
  const mockUsers: User[] = [
    {
      id: "1",
      username: "Alice",
      imagePath: "https://randomuser.me/api/portraits/women/1.jpg",
      bio: "Passionate about climbing and adventure.",
      followersCount: 120,
      followingCount: 80,
      doneChallengesCount: 5,
    },
    {
      id: "4",
      username: "Damon",
      imagePath: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Passionate about climbing and adventure.",
      followersCount: 120,
      followingCount: 80,
      doneChallengesCount: 5,
    },
    {
      id: "5",
      username: "ching chang chong",
      imagePath: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Passionate about climbing and adventure.",
      followersCount: 120,
      followingCount: 80,
      doneChallengesCount: 5,
    },
    {
      id: "2",
      username: "Bob",
      imagePath: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "Love hiking and nature.",
      followersCount: 150,
      followingCount: 100,
      doneChallengesCount: 7,
    },
    {
      id: "3",
      username: "Charlie",
      imagePath: "https://randomuser.me/api/portraits/men/2.jpg",
      bio: "Fitness enthusiast and challenge seeker.",
      followersCount: 180,
      followingCount: 90,
      doneChallengesCount: 6,
    },
  ];

  const mockCategories = [
    "ورزش",
    "سلامت",
    "آموزش",
    "محیط زیست",
    "فرهنگ",
    "تکنولوژی",
    "هنر",
    "غذا",
  ];

  // Filters
  const filteredCategories = mockCategories.filter(
    (cat) => cat.includes(categorySearch) && !selectedCategories.includes(cat)
  );

  // Users available for selection (not selected + match search)
  const availableUsers = useMemo(() => {
    return mockUsers
      .filter((u) => !selectedUsers.some((s) => s.id === u.id))
      .filter((u) =>
        u.username.toLowerCase().includes(userSearch.toLowerCase())
      );
  }, [selectedUsers, userSearch]);

  // Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) navigate(-1);
    else setCurrentStep((s) => s - 1);
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handleFinishCreating = (formikValues: any) => {
    const newChallenge: ChallengeData = {
      title: challengeTitle,
      description: challengeDescription,
      dateRange: formikValues.challengeDate,
      location: formikValues.challengeLocation,
      Img: image,
      commentsEnabled: formikValues.isCommentsEnabled,
      categories: selectedCategories,
      type: formikValues.challengeType,
      memberCount: formikValues.memberCount,
      members: selectedUsers,
    };

    console.log("Sending to /challenge:", newChallenge);
    console.log("Selected users count:", selectedUsers.length);

    navigate("/challenge", { state: { challenge: newChallenge } });
  };

  // Add user (with limit check)
  const addUser = (user: User, memberCount: string) => {
    const count = parseInt(memberCount) || 0;

    // Check if already selected
    if (selectedUsers.find((u) => u.id === user.id)) return;

    // Check limit
    if (selectedUsers.length >= count) {
      setMemberLimitError(true);
      setTimeout(() => setMemberLimitError(false), 3000); // auto-hide after 3s
      return;
    }

    setSelectedUsers((p) => [...p, user]);
    setUserSearch("");
  };

  // Remove user
  const removeUser = (id: string) => {
    setSelectedUsers((p) => p.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col p-4 items-center">
      <div className="flex justify-center items-center w-full max-w-xl mb-10 mt-4">
        <BackButtonWithSteps onClick={handleBack} />
        <div className="flex justify-end w-full">
          <span className="text-primary text-3xl font-bold">ساخت چالش</span>
        </div>
      </div>

      <Formik
        initialValues={{
          challengeDate: "",
          challengeLocation: "",
          isCommentsEnabled: false,
          challengeType: "عمومی",
          memberCount: "",
        }}
        enableReinitialize
        onSubmit={(values) => {
          if (currentStep === 3) handleFinishCreating(values);
        }}
      >
        {({ values, setFieldValue }) => {
          const memberCountNum = parseInt(values.memberCount) || 0;
          const canAddMore = selectedUsers.length < memberCountNum;

          return (
            <Form className="flex-1 flex flex-col mt-10 justify-start items-center w-full">
              {/* ────────────────────── STEP 1 ────────────────────── */}
              {currentStep === 1 && (
                <div className="w-full max-w-xl relative">
                  <TitleAndDescription
                    title={challengeTitle}
                    onTitleChange={setChallengeTitle}
                    description={challengeDescription}
                    onDescriptionChange={setChallengeDescription}
                  />

                  <div
                    className="w-full max-w-xl mt-3 flex justify-center items-center bg-[#FFF1E5] p-10 cursor-pointer rounded-[8px] border-2 border-black border-dotted"
                    onClick={() =>
                      document.getElementById("imageUpload")?.click()
                    }
                  >
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {!image ? (
                      <div className="flex flex-col justify-center items-center">
                        <Upload className="text-primary text-4xl mb-4" />
                        <span className="text-primary text-xl font-medium">
                          اضافه کردن عکس
                        </span>
                      </div>
                    ) : (
                      <div className="mt-4 w-full h-auto border-2">
                        <img
                          src={image}
                          alt="Preview"
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ────────────────────── STEP 2 ────────────────────── */}
              {currentStep === 2 && (
                <div className="w-full max-w-xl mt-7 mb-5">
                  {/* Category selector */}
                  <div className="mt-4">
                    <div className="relative">
                      <CustomInput
                        name="category"
                        type="text"
                        label="دسته"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full p-3 pr-10 border rounded-md focus:ring-2 outline-none text-right"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>

                    {categorySearch && filteredCategories.length > 0 && (
                      <div className="mt-2 border rounded-md bg-white shadow-lg max-h-48 overflow-y-auto z-10">
                        {filteredCategories.map((cat) => (
                          <div
                            key={cat}
                            onClick={() => {
                              setSelectedCategories((p) => [...p, cat]);
                              setCategorySearch("");
                            }}
                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-right"
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCategories((p) =>
                                p.filter((c) => c !== cat)
                              )
                            }
                            className="hover:bg-orange-200 rounded-full p-0.5"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="flex flex-col space-y-4 mt-10">
                    <Field name="challengeDate">
                      {({ field }: FieldProps) => (
                        <CustomInput
                          {...field}
                          className="w-full p-3 border rounded-md"
                          label="تاریخ"
                          type="date"
                        />
                      )}
                    </Field>

                    <div className="mt-6">
                      <Field name="challengeLocation">
                        {({ field }: FieldProps) => (
                          <CustomInput
                            {...field}
                            className="w-full p-3 border rounded-md"
                            label="مکان"
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  {/* Challenge type */}
                  <div className="mt-10">
                    <CustomSelect
                      name="challengeType"
                      label="نوع چالش"
                      options={[
                        { value: "عمومی", label: "عمومی" },
                        { value: "شخصی", label: "شخصی" },
                      ]}
                      width="mt-10"
                    />
                  </div>

                  {/* Comments toggle */}
                  <div className="mt-10">
                    <CustomCheckbox
                      name="isCommentsEnabled"
                      labelText="فعال بودن کامنت ها"
                      checked={values.isCommentsEnabled}
                      onChange={() =>
                        setFieldValue(
                          "isCommentsEnabled",
                          !values.isCommentsEnabled
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {/* ────────────────────── STEP 3 ────────────────────── */}
              {currentStep === 3 && (
                <div className="w-full max-w-xl space-y-8">
                  {/* Member count */}
                  <Field name="memberCount">
                    {({ field }: FieldProps) => (
                      <CustomInput
                        {...field}
                        label="تعداد اعضا"
                        type="number"
                        min={1}
                        className="w-full rounded-[8px]"
                      />
                    )}
                  </Field>

                  {/* USER SEARCH + DROPDOWN */}
                  <div className="relative">
                    <CustomInput
                      name="userSearch"
                      type="text"
                      label="جست و جوی کاربر"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pr-10 rounded-[8px]"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>

                  {/* Selected users tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedUsers.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        {user.username}
                        <button
                          type="button"
                          onClick={() => removeUser(user.id)}
                          className="hover:bg-orange-200 rounded-full p-0.5"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Error when trying to exceed */}
                  {memberLimitError && (
                    <p className="text-red-600 text-sm text-right animate-pulse">
                      نمی‌توانید بیش از {memberCountNum} نفر اضافه کنید.
                    </p>
                  )}

                  {/* User list */}
                  <UserCardListToAdd
                    users={availableUsers}
                    searchTerm={userSearch}
                    onAddUser={(user) => addUser(user, values.memberCount)}
                    disabled={!canAddMore}
                  />
                </div>
              )}

              {/* ────────────────────── NAVIGATION ────────────────────── */}
              <div className="flex justify-center w-full mt-10">
                <CustomButton
                  type={currentStep === 3 ? "submit" : "button"}
                  onClick={currentStep < 3 ? handleNextStep : undefined}
                  className={
                    currentStep === 3
                      ? "w-full sm:w-full md:w-full max-w-xl bg-primary rounded-[8px] p-5 text-lg hover:bg-primary"
                      : "w-full sm:w-full md:w-full max-w-xl bg-secondary rounded-[8px] p-5 text-lg hover:bg-secondary"
                  }
                >
                  {currentStep === 3 ? "ثبت چالش" : "بعدی"}
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
