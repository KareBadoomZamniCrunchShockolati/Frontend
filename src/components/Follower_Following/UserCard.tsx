import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from "lucide-react";

interface UserCardProps {
  id: string;
  username: string;
  imagePath: string;
  onDelete: (id: string, username: string) => void;
  isOwner: boolean; // Add isOwner here
}

const UserCard: React.FC<UserCardProps> = ({ id, username, imagePath, onDelete, isOwner }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
    onDelete(id, username); // Call the onDelete function passed via props
  };

  return (
    <div
      className="flex items-center justify-between mb-2 p-2 w-88 sm:w-100 md:w-110 h-24 border border-black rounded-[7px] cursor-pointer"
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
      {isOwner && ( // Only show delete button if the user is the profile owner
        <button className="text-primary" onClick={handleDeleteClick}>
          <X className='w-6 h-6 mr-2 border-2 border-primary rounded-[11px] hover:bg-orange-100' />
        </button>
      )}
    </div>
  );
};

export default UserCard;
