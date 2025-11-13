import React, { useState } from "react";
import {
  ArrowLeft,
  Menu,
  Hexagon,
  Calendar,
  MapPin,
  Search,
  ThumbsUp,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/Custom/CustomButton";
import UserCard from "@/components/Custom/UserCard";
import CustomInput from "@/components/Custom/CustomInput";
import { Formik, Field, Form } from "formik";
import ChallengeCard from "@/components/Custom/ChallangeCard";

const ChallengeManagementPage: React.FC = () => {
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
  ];

  const mockChallenges = [
    {
      id: "1",
      title: "Mountain Climb Challenge",
      description: "Climb a mountain in under 12 hours.",
      imageUrl:
        "https://www.muchbetteradventures.com/magazine/content/images/size/w2000/2024/04/mount-everest-at-sunset.jpg",
    },
    {
      id: "2",
      title: "Desert Trek Challenge",
      description: "Complete a 30km desert trek in a single day.",
      imageUrl:
        "https://www.travelandleisure.com/thmb/Desert-Dunes_Fancyview_gettyimages-1216349476-f180b973c62f4b74b10b87bb736d9e9d.jpg",
    },
    {
      id: "3",
      title: "Ocean Swim Challenge",
      description: "Swim across an open water stretch of 2km.",
      imageUrl:
        "https://www.adventure-life.com/sites/default/files/styles/hero_mobile/public/hero_images/hero-the-coastline-of-new-zealand.jpg?itok=V6n33P__",
    },
  ];

  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [likeCount, setLikeCount] = useState(10); // State to track likes
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0); // Slideshow state

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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slideshow navigation
  const nextSlide = () => {
    setCurrentChallengeIndex(
      (prevIndex) => (prevIndex + 1) % mockChallenges.length
    );
  };

  const prevSlide = () => {
    setCurrentChallengeIndex(
      (prevIndex) =>
        (prevIndex - 1 + mockChallenges.length) % mockChallenges.length
    );
  };

  const handleLike = () => {
    setLikeCount(likeCount === 10 ? 11 : 10); // Toggle between 1 and 0
  };

  const handleSave = () => {
    console.log("Saved!");
  };

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

        {/* Image container with shadow */}
        <div className="relative w-full max-w-xl mb-4">
          <img
            src={imageUrl}
            alt="Scenic Landscape"
            className="w-full h-auto rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
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
        </div>

        {/* Like and Save buttons */}
        <div className="flex space-x-4 mt-5 max-w-xl w-full justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-black text-xl" style={{ marginTop: "6px" }}>
              {likeCount}
            </span>

            <CustomButton
              className="w-min sm:w-min md:w-min bg-white border-primary shadow-primary hover:bg-white rounded-[8px] p-3 flex items-center space-x-2"
              onClick={handleLike}
            >
              <ThumbsUp className="text-primary w-5 h-5" />
            </CustomButton>

            <CustomButton
              className="w-min sm:w-min md:w-min bg-white border-primary shadow-primary hover:bg-white rounded-[8px] p-3 flex items-center space-x-2"
              onClick={handleSave}
            >
              <Bookmark className="text-primary w-5 h-5" />
            </CustomButton>
          </div>
        </div>

        {/* Title and Description in RTL (Persian) */}
        <div className="text-right mb-6 mt-6 max-w-2xl w-full" dir="rtl">
          <h1 className="text-2xl font-semibold text-black mb-4">عنوان چالش</h1>
          <p className="text-md text-gray-700 text-justify">
            این چالش برای آزمایش استقامت و مهارت‌های حل مسئله شما طراحی شده است.
            سفر شامل پیمودن زمین‌های سخت و غلبه بر موانع مختلف است. آیا
            آماده‌اید تا این ماجراجویی را شروع کنید و مرزهای خود را بسنجید؟
          </p>
        </div>

        {/* Date and Location Container */}
        <div className="space-y-4 mt-6 mb-4 text-right w-full max-w-xl">
          <div className="flex items-center text-sm text-gray-700 justify-end w-full">
            <p>از 28 اردیبهشت تا 8 شهریور - سه روز در هفته</p>
            <Calendar className="w-6 h-6 m-1 text-primary" />
          </div>
          <div className="flex items-center text-sm text-gray-700 justify-end w-full">
            <p>قله کوه اورست</p>
            <MapPin className="w-6 h-6 m-1 text-primary" />
          </div>
        </div>

        {/* Custom Button placed at the bottom and centered */}
        <CustomButton className="w-full sm:w-full md:w-full max-w-xl bg-primary rounded-[8px] p-5 text-lg sm:text-lg md:text-lg hover:bg-primary">
          پیوستن
        </CustomButton>

        {/* Title Above Search Bar (Participated Users) */}
        <div className="text-right mb-1 mt-6 max-w-2xl w-full" dir="rtl">
          <h2 className="text-xl font-semibold text-black mb-4">
            شرکت کنندگان
          </h2>
        </div>

        {/* Search Bar - Formik integration */}
        <Formik initialValues={{ searchTerm: "" }} onSubmit={() => {}}>
          {({ values, handleChange, handleBlur }) => (
            <Form className="flex justify-center w-full max-w-xl">
              <Field
                name="searchTerm"
                render={({ field }: any) => (
                  <CustomInput
                    {...field}
                    icon={<Search />}
                    value={values.searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      handleSearchTermChange(e.target.value);
                    }}
                    onBlur={handleBlur}
                    label="جستجو"
                    width="w-full"
                    className="rounded-[8px]"
                  />
                )}
              />
            </Form>
          )}
        </Formik>

        {/* User Card List */}
        <div className="w-full mt-4 max-w-xl mx-auto">
          <div
            className="w-full flex flex-col items-center space-y-4 overflow-y-auto max-h-[300px]"
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For IE and Edge
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
                isOwner={false}
                className="w-full sm:w-full md:w-full lg:w-full"
              />
            ))}
          </div>
        </div>

        <div className="text-right mt-6 max-w-2xl w-full" dir="rtl">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <img
              src="src/assets/Img/staircase.jpg"
              alt="Staircase"
              className="w-8 h-8 ml-2"
            />
            <span className="mr-2">چالش های مرتبط</span>
          </h2>
        </div>

        {/* Challenge Cards Slideshow (At the end) */}
        <div className="w-full max-w-xl mx-auto relative">
          {/* Challenge Card */}
          <div className="w-full flex justify-center relative">
            <ChallengeCard
              key={mockChallenges[currentChallengeIndex].id}
              title={mockChallenges[currentChallengeIndex].title}
              description={mockChallenges[currentChallengeIndex].description}
              imageUrl={mockChallenges[currentChallengeIndex].imageUrl}
            />
          </div>

          {/* Slideshow Navigation Buttons */}
          <div className="absolute top-1/2 left-0 w-full flex justify-between transform -translate-y-1/2">
            <CustomButton
              className="bg-white text-secondary shadow-none hover:bg-blue-400 p-2 w-7 sm:w-8 md:w-8 rounded-[8px]"
              onClick={prevSlide}
            >
              &#8249;
            </CustomButton>
            <CustomButton
              className="bg-white text-secondary shadow-none hover:bg-blue-400 p-2 w-7 sm:w-8 md:w-8 rounded-[8px]"
              onClick={nextSlide}
            >
              &#8250;
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeManagementPage;
