import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  id: string;
  username: string;
  imagePath: string;
}

const UserCard: React.FC<UserCardProps> = ({ id, username, imagePath }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the user's dashboard
    navigate(`/dashboard/${id}`);
  };

  return (
    <div
      className="flex items-center justify-between p-2 w-88 h-24 border border-black rounded-[7px] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center space-x-4">
        <img
          className="w-16 h-16 rounded-full border-1 border-black"
          src={imagePath}
          alt="profile"
        />
        <span className="font-bold">{username}</span>
      </div>
      <button className="text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 mr-2 border-2 border-primary rounded-[11px]"
        >
          <path d="M6 18L18 6M6 6l12 12" className="transform scale-70 origin-center" />
        </svg>
      </button>
    </div>
  );
};

export default UserCard;
