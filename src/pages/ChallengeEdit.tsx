import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomButton from "@/components/Custom/CustomButton";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import UserCardList from "@/components/ChallengeManagement/public/UserCardsList";
import BackButton from "@/components/ChallengeManagement/edit/BackButton";
import ImageAndBadgeContainerEdit from "@/components/ChallengeManagement/edit/ImageAndBadgeContainerEdit";
import TitleAndDescriptionInput from "@/components/ChallengeManagement/edit/TitleAndDescriptionInput";
import DateAndLocationInput from "@/components/ChallengeManagement/edit/DateAndLocationInput";

const ChallengeEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const challenge = location.state?.challenge;
  

  interface User {
    id: string;
    username: string;
    imagePath: string;
    bio: string;
    followersCount: number;
    followingCount: number;
    doneChallengesCount: number;
  }
  

  if (!challenge) {
    return <div>Challenge not found!</div>;
  }

  const {
    imageUrl,
    title,
    description,
    dateRange,
    location: challengeLocation,
    participants,
  } = challenge;
  
  const [image, setImage] = useState(imageUrl);
  const [users, setUsers] = useState<User[]>(participants);
  const [searchTerm, setSearchTerm] = useState("");
  const [challengeTitle, setChallengeTitle] = useState(title);
  const [challengeDescription, setChallengeDescription] = useState(description);
  const [challengeDate, setChallengeDate] = useState(dateRange); 
  const [challengeLocationState, setChallengeLocation] = useState(challengeLocation); 

  const handleDelete = (id: string, username: string) => {
    setUsers(users.filter((user) => user.id !== id));
    console.log(`${username} has been removed.`);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
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

  const filteredUsers = users.filter((user: User) =>
  user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
);


  const handleFinishEditing = () => {
    // Save the updated challenge info and navigate back to the info page
    const updatedChallenge = {
      title: challengeTitle,
      description: challengeDescription,
      date: challengeDate,
      location: challengeLocationState,
      image: image,
      participants: participants,
    };

    // You can use navigate with state to pass updated challenge back to the info page
    navigate("/challenge", {
      state: {challenge : updatedChallenge}, // Passing updated challenge as state
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex-1 flex flex-col justify-start items-center w-full">
      <div className="flex justify-between w-full items-center max-w-xl">
        <BackButton onClick={handleBack} />
        </div>

        {/* Image and Badge Section */}
        <ImageAndBadgeContainerEdit
          onImageChange={handleImageChange}
          imageUrl={image}
        />

        {/* Challenge Title and Description */}
        <div className="w-full max-w-xl">
          <TitleAndDescriptionInput
            title={challengeTitle}
            onTitleChange={handleTitleChange}
            description={challengeDescription}
            onDescriptionChange={handleDescriptionChange}
          />
        </div>

        {/* Date and Location Fields */}
        <div className="space-y-4 mb-4 text-right w-full max-w-xl">
          <DateAndLocationInput
            challengeDate={challengeDate}
            challengeLocation={challengeLocationState}
            onDateChange={handleDateChange}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Title Above Search Bar (Participated Users) */}
        <div className="text-right mb-1 mt-6 max-w-2xl w-full" dir="rtl">
          <h2 className="text-xl font-semibold text-black mb-4">شرکت کنندگان</h2>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
        />

        <UserCardList
          users={filteredUsers}
          onDelete={handleDelete}
          isOwner={true}
        />
      </div>

      {/* Custom Button placed at the bottom and centered */}
      <div className="flex justify-center w-full mt-10">
        <CustomButton
          className="w-full sm:w-full md:w-full max-w-xl bg-primary rounded-[8px] p-5 text-lg sm:text-lg md:text-lg hover:bg-primary"
          onClick={handleFinishEditing} // On button click, save changes and navigate back
        >
          اتمام ویرایش
        </CustomButton>
      </div>
    </div>
  );
};

export default ChallengeEdit;
