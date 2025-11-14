import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/Custom/CustomButton";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import UserCardList from "@/components/ChallengeManagement/public/UserCardsList";
import BackButton from "@/components/ChallengeManagement/edit/BackButton";
import ImageAndBadgeContainerEdit from "@/components/ChallengeManagement/edit/ImageAndBadgeContainerEdit";
import TitleAndDescriptionInput from "@/components/ChallengeManagement/edit/TitleAndDescriptionInput";
import DateAndLocationInput from "@/components/ChallengeManagement/edit/DateAndLocationInput";

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
  const [challengeTitle, setChallengeTitle] = useState("عنوان چالش");
  const [challengeDescription, setChallengeDescription] = useState(
    "این چالش برای آزمایش استقامت و مهارت‌های حل مسئله شما طراحی شده است. سفر شامل پیمودن زمین‌های سخت و غلبه بر موانع مختلف است. آیا آماده‌اید تا این ماجراجویی را شروع کنید و مرزهای خود را بسنجید؟"
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
      <div className="flex-1 flex flex-col  justify-center items-start">
        <BackButton onClick={handleBack} />
        <ImageAndBadgeContainerEdit
          onImageChange={handleImageChange}
          imageUrl={imageUrl}
        />

        <TitleAndDescriptionInput
          title={challengeTitle}
          onTitleChange={handleTitleChange}
          description={challengeDescription}
          onDescriptionChange={handleDescriptionChange}
        />

        {/* Date and Location Fields */}
        <div className="space-y-4 mb-4 text-right w-full max-w-xl">
          {/* Date Field */}
          <DateAndLocationInput
            challengeDate={challengeDate}
            challengeLocation={challengeLocation}
            onDateChange={handleDateChange}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Title Above Search Bar (Participated Users) */}
        <div className="text-right mb-1 mt-6 max-w-2xl w-full" dir="rtl">
          <h2 className="text-xl font-semibold text-black mb-4">
            شرکت کنندگان
          </h2>
        </div>

        <SearchBar searchTerm="" onSearchTermChange={handleSearchTermChange} />

        <UserCardList
          users={filteredUsers}
          onDelete={handleDelete}
          isOwner={true}
        />
      </div>
      {/* Custom Button placed at the bottom and centered */}
      <CustomButton className="mt-10 w-full sm:w-full md:w-full max-w-xl bg-primary rounded-[8px] p-5 text-lg sm:text-lg md:text-lg hover:bg-primary">
        اتمام ویرایش
      </CustomButton>
    </div>
  );
};

export default ChallengeEdit;
