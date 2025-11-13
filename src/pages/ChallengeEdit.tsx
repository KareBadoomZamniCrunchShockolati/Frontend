import React, { useState } from "react";
import {
  ArrowLeft,
  Menu,
  Hexagon,
  Calendar,
  MapPin,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/Custom/CustomButton";
import UserCard from "@/components/Custom/UserCard";
import CustomInput from "@/components/Custom/CustomInput";
import { Formik, Field, Form } from "formik";

const ChallengeEdit: React.FC = () => {
  const imageUrl =
    "https://www.muchbetteradventures.com/magazine/content/images/size/w2000/2024/04/mount-everest-at-sunset.jpg";

  const navigate = useNavigate();

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
    // your mock user data...
  ];
  const [image, setImage] = useState(imageUrl);
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [likeCount, setLikeCount] = useState(10);
  const [challengeTitle, setChallengeTitle] = useState("عنوان چالش");
  const [challengeDescription, setChallengeDescription] = useState(
    "این چالش برای آزمایش استقامت و مهارت‌های حل مسئله شما طراحی شده است..."
  );
  const [challengeDate, setChallengeDate] = useState(
    "از 28 اردیبهشت تا 8 شهریور - سه روز در هفته"
  ); // Initial date value
  const [challengeLocation, setChallengeLocation] = useState("قله کوه اورست"); // Initial location value

  const handleDelete = (id: string, username: string) => {
    setUsers(users.filter((user) => user.id !== id));
    console.log(`${username} has been removed.`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMenu = () => {
    console.log("Menu clicked");
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleTitleChange = (value: string) => {
    setChallengeTitle(value);
  };

  const handleDescriptionChange = (value: string) => {
    setChallengeDescription(value);
  };

  const handleDateChange = (value: string) => {
    setChallengeDate(value);
  };

  const handleLocationChange = (value: string) => {
    setChallengeLocation(value);
  };

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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Top buttons */}
        <div className="flex justify-between w-full items-center mb-4 max-w-xl">
          <button
            onClick={handleBack}
            className="text-primary w-11 h-11 border-2 border-primary rounded-[12.5px] px-2 py-2 flex items-center justify-center mr-4 hover:bg-orange-50"
          >
            <ArrowLeft className="w-full h-full text-primary" />
          </button>
          <button
            onClick={handleMenu}
            className="text-primary w-11 h-11 border-2 border-primary rounded-[12.5px] px-2 py-2 flex items-center justify-center hover:bg-orange-50"
          >
            <Menu className="w-full h-full text-primary" />
          </button>
        </div>

        {/* Image container with shadow and blur effect */}
        <div className="relative w-full max-w-xl mb-4">
          {/* Image with blur effect */}
          <img
            src={imageUrl}
            alt="Scenic Landscape"
            className="w-full h-auto rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] filter blur-xs"
          />

          {/* Badge container */}
          <div className="absolute h-11 bottom-[-10px] right-[-0px] bg-secondary border-1 border-black p-1 rounded-[8px] flex space-x-2 items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button className="w-10 h-10 flex items-center justify-center bg-secondary p-1 rounded-full">
              <Hexagon className="w-full h-full text-yellow-500" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-secondary p-1 rounded-full">
              <Hexagon className="w-full h-full text-orange-900" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-secondary p-1 rounded-full">
              <Hexagon className="w-full h-full text-gray-400" />
            </button>
          </div>

          {/* Custom button in the center to change the image */}
          <div className="absolute inset-0 flex justify-center items-center">
            <CustomButton
              className="bg-secondary text-white hover:bg-secondary px-6 py-2 rounded-[8px] shadow-md"
              onClick={() =>
                document.getElementById("imageUploadInput")?.click()
              }
            >
              تغییر تصویر
            </CustomButton>
            <input
              id="imageUploadInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Title and Description in RTL (Persian) */}
        <div className="text-right mb-6 mt-6 max-w-2xl w-full" dir="rtl">
          <h1 className="text-2xl font-semibold text-black mb-4">
            {/* Challenge title input */}
            <Formik
              initialValues={{ challengeTitle }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, handleChange }) => (
                <Field name="challengeTitle">
                  {({ field }: any) => (
                    <CustomInput
                      {...field}
                      value={values.challengeTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleTitleChange(e.target.value);
                      }}
                      label="عنوان چالش"
                      width="w-full"
                      className="rounded-[8px]"
                    />
                  )}
                </Field>
              )}
            </Formik>
          </h1>
        </div>

        {/* Challenge description input */}
        <div className="text-right mb-6 mt-6 max-w-2xl w-full" dir="rtl">
          <Formik
            initialValues={{ challengeDescription }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ values, handleChange }) => (
              <Field name="challengeDescription">
                {({ field }: any) => (
                  <CustomInput
                    {...field}
                    value={values.challengeDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      handleChange(e);
                      handleDescriptionChange(e.target.value);
                    }}
                    label="توضیحات چالش"
                    width="w-full"
                    className="rounded-[8px] resize-none"
                    as="textarea"
                    rows={5}
                  />
                )}
              </Field>
            )}
          </Formik>
        </div>

        {/* Date and Location Fields */}
        <div className="space-y-4 mt-6 mb-4 text-right w-full max-w-xl">
          {/* Date Field */}
          <div className="flex items-center text-sm text-gray-700 justify-end w-full">
            <CustomButton className="w-min sm:w-min md:w-min max-w-xl mr-2 h-9.5 bg-secondary rounded-[8px]  text-md sm:text-md md:text-md hover:bg-secondary">
              تغییر تاریخ
            </CustomButton>
            <Formik
              initialValues={{ challengeDate }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, handleChange }) => (
                <Field name="challengeDate">
                  {({ field }: any) => (
                    <CustomInput
                      {...field}
                      type="text"
                      value={values.challengeDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleDateChange(e.target.value);
                      }}
                      label="تاریخ"
                      width="w-full"
                      className="rounded-[8px]"
                    />
                  )}
                </Field>
              )}
            </Formik>
          </div>

          {/* Location Field */}
          <div className="flex items-center text-sm text-gray-700 justify-end w-full">
            <Formik
              initialValues={{ challengeLocation }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, handleChange }) => (
                <Field name="challengeLocation">
                  {({ field }: any) => (
                    <CustomInput
                      {...field}
                      value={values.challengeLocation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleLocationChange(e.target.value);
                      }}
                      label="مکان"
                      width="w-full"
                      className="rounded-[8px]"
                    />
                  )}
                </Field>
              )}
            </Formik>
          </div>
        </div>

        {/* Title Above Search Bar (Participated Users) */}
        <div className="text-right mb-1 mt-6 max-w-2xl w-full" dir="rtl">
          <h2 className="text-xl font-semibold text-black mb-4">
            شرکت کنندگان
          </h2>
        </div>

        {/* User Card List */}
        <div className="w-full mt-4 max-w-xl mx-auto">
          <div
            className="w-full flex flex-col items-center space-y-4 overflow-y-auto max-h-[300px]"
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                username={user.username}
                imagePath={user.imagePath}
                bio={user.bio}
                onDelete={handleDelete}
                isOwner={true}
                className="w-full sm:w-full md:w-full lg:w-full"
              />
            ))}
          </div>
        </div>
      </div>
      {/* Custom Button placed at the bottom and centered */}
      <CustomButton className="mt-10 w-full sm:w-full md:w-full max-w-xl bg-primary rounded-[8px] p-5 text-lg sm:text-lg md:text-lg hover:bg-primary">
        اتمام ویرایش
      </CustomButton>
    </div>
  );
};

export default ChallengeEdit;
