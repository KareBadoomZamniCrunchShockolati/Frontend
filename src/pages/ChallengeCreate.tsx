import React, { useState } from "react";
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

const ChallengeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Title, Description, Image
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Category Selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  // User Selection (Step 3)
  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  // Mock Users
  const mockUsers = [
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

  // Mock categories
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

  const filteredCategories = mockCategories.filter(
    (cat) => cat.includes(categorySearch) && !selectedCategories.includes(cat)
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinishCreating = (formikValues: any) => {
    const newChallenge = {
      title: challengeTitle,
      description: challengeDescription,
      dateRange: formikValues.challengeDate,
      location: formikValues.challengeLocation,
      Img: image,
      commentsEnabled: formikValues.isCommentsEnabled,
      categories: selectedCategories,
      type: formikValues.challengeType,
      memberCount: formikValues.memberCount,
      members: selectedUsers, // Selected users
    };

    console.log("Sending to /challenge:", newChallenge);

    navigate("/challenge", {
      state: { challenge: newChallenge },
    });
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
        enableReinitialize={true}
        onSubmit={(values) => {
          if (currentStep === 3) {
            handleFinishCreating(values);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex-1 flex flex-col mt-10 justify-start items-center w-full">
            {/* Step 1: Title, Description, Image */}
            {currentStep === 1 && (
              <div className="w-full max-w-xl relative">
                <TitleAndDescription
                  title={challengeTitle}
                  onTitleChange={setChallengeTitle}
                  description={challengeDescription}
                  onDescriptionChange={setChallengeDescription}
                />

                <div
                  className="w-full max-w-xl mt-3 flex justify-center items-center bg-orange-200 p-10 cursor-pointer rounded-[8px] border-2 border-black border-dotted"
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

            {/* Step 2: Categories, Date, Location, Comments, Type */}
            {currentStep === 2 && (
              <div className="w-full max-w-xl mt-7 mb-5">
                {/* Category Selector */}
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
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>

                  {categorySearch && filteredCategories.length > 0 && (
                    <div className="mt-2 border rounded-md bg-white shadow-lg max-h-48 overflow-y-auto z-10">
                      {filteredCategories.map((cat) => (
                        <div
                          key={cat}
                          onClick={() => {
                            setSelectedCategories((prev) => [...prev, cat]);
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
                            setSelectedCategories((prev) =>
                              prev.filter((c) => c !== cat)
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

                {/* Challenge Type */}
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

                {/* Comments Toggle */}
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

            {/* Step 3: تعداد اعضا + جستجوی کاربر + لیست انتخاب شده */}
            {currentStep === 3 && (
              <div className="w-full max-w-xl mt-6 space-y-8">
                {/* تعداد اعضا */}
                <Field name="memberCount">
                  {({ field }: FieldProps) => (
                    <CustomInput
                      {...field}
                      label="تعداد اعضا"
                      min={1}
                      className="w-full rounded-[8px]"
                    />
                  )}
                </Field>

                {/* جستجوی کاربر */}
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

                {/* Selected Users (Tags) */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedUsers.map((user) => (
                    <span
                      key={user.id}
                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {user.username}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUsers((prev) =>
                            prev.filter((u) => u.id !== user.id)
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

                {/* User List */}
                <UserCardListToAdd
                  users={mockUsers}
                  searchTerm={userSearch}
                  onAddUser={(user) => {
                    if (!selectedUsers.find((u) => u.id === user.id)) {
                      setSelectedUsers((prev) => [...prev, user]);
                    }
                  }}
                />
              </div>
            )}

            {/* Navigation Button */}
            <div className="flex justify-center w-full mt-10">
              <CustomButton
                type={currentStep === 3 ? "submit" : "button"}
                className={
                  currentStep === 3
                    ? "w-full sm:w-full md:w-full max-w-xl bg-primary rounded-[8px] p-5 text-lg hover:bg-primary"
                    : "w-full sm:w-full md:w-full max-w-xl bg-secondary rounded-[8px] p-5 text-lg hover:bg-secondary"
                }
                onClick={currentStep < 3 ? handleNextStep : undefined}
              >
                {currentStep === 3 ? "ثبت چالش" : "بعدی"}
              </CustomButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChallengeCreate;
