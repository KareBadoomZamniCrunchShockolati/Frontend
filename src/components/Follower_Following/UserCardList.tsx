import React from 'react';
import UserCard from '@/components/Follower_Following/UserCard';

interface UserCardListProps {
  users: { id: string; username: string; imagePath: string }[];
  onDelete: (id: string, username: string) => void;
}

const UserCardList: React.FC<UserCardListProps> = ({ users, onDelete }) => {
  return (
    <div className="w-full max-w-md flex justify-center overflow-y-auto max-h-96 scrollbar-custom">
      {users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              username={user.username}
              imagePath={user.imagePath}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="font-semibold m-10 text-primary text-5xl">!موردی یافت نشد</p>
      )}
    </div>
  );
};

export default UserCardList;
