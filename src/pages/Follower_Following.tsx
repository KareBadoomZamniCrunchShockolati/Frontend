import React, { useState } from 'react';
import UserCard from "@/components/Follower_Following/UserCard";
import CustomButton from '@/components/Custom/CustomButton';

const FollowerFollowingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'followers' | 'followings'>('followers');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data (replace with actual data fetching)
  const followers = [
    { id: '1', username: 'mahditd0010', imagePath: 'path_to_image1' },
    { id: '2', username: 'samiskh', imagePath: 'path_to_image2' },
    { id: '3', username: 'CNumb6004', imagePath: 'path_to_image3' },
    { id: '7', username: 'Soroush1384ak', imagePath: 'path_to_image4' },

  ];
  
  const followings = [
    { id: '4', username: 'User4', imagePath: 'path_to_image4' },
    { id: '5', username: 'User5', imagePath: 'path_to_image5' },
    { id: '6', username: 'User6', imagePath: 'path_to_image6' },
  ];

  const handleTabSwitch = (tab: 'followers' | 'followings') => {
    setActiveTab(tab);
  };

  const filteredList = (activeTab === 'followers' ? followers : followings).filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4">
      {/* Main Username & Back Button */}
      <div className="flex items-center mb-6">
        <button className="text-blue-500 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 className="font-bold text-xl">Username</h2>
      </div>

      {/* Toggle Buttons (Followers / Followings) */}
      <div className="mb-6">
      <CustomButton className={`px-4 py-2 ${activeTab === 'followings' ? 'bg-white text-blue-500' : 'bg-gray-200'} rounded-r-none hover:bg-none`}
          onClick={() => handleTabSwitch('followers')}>
          Followers
        </CustomButton>
        <CustomButton className={`px-4 py-2 ${activeTab === 'followings' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-l-none hover:bg-none`}
          onClick={() => handleTabSwitch('followings')}>
          Followings
        </CustomButton>

      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List of Followers or Followings using UserCard */}
      <div>
        {filteredList.length > 0 ? (
          filteredList.map((user) => (
            <UserCard key={user.id} id={user.id} username={user.username} imagePath={user.imagePath} />
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default FollowerFollowingPage;
