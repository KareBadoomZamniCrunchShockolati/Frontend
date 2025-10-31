import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ToggleButtons from "@/components/Follower_Following/ToggleButtons";
import BackButtonWithUsername from "@/components/Follower_Following/BackButtonWithUsername";
import SearchBar from "@/components/Follower_Following/SearchBar";
import UserCardList from "@/components/Follower_Following/UserCardList";
import DeleteConfirmationModal from "@/components/Follower_Following/DeleteConfirmationModal";

interface User {
  id: string;
  username: string;
  imagePath: string;
}

const FollowerFollowingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'followers' | 'followings'>('followers');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null);
  const [followers, setFollowers] = useState<User[]>([]); 
  const [followings, setFollowings] = useState<User[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);

  const fullName = location.state?.fullName || "Unknown User"; 

  const loggedInUserId = '1'; // Replace with actual logic for logged-in user ID

  const isOwner = loggedInUserId === '1'; 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") as 'followers' | 'followings' | null;
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'followers' ? '/api/followers' : '/api/followings';
        const response = await fetch(`${endpoint}?userId=${loggedInUserId}`);
        if (response.ok) {
          const data = await response.json();
          if (activeTab === 'followers') {
            setFollowers(data.users);
          } else {
            setFollowings(data.users);
          }
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUserId, activeTab]);

  const handleTabSwitch = (tab: 'followers' | 'followings') => {
    setActiveTab(tab);
    navigate(`/follow?tab=${tab}`, { state: { fullName } });
  };

  const handleDeleteClick = (id: string, username: string) => {
    setUserToDelete({ id, username });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`/api/removeFollower`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: loggedInUserId, followerId: userToDelete.id }),
        });

        if (response.ok) {
          if (activeTab === 'followers') {
            setFollowers(followers.filter(user => user.id !== userToDelete.id));
          } else {
            setFollowings(followings.filter(user => user.id !== userToDelete.id));
          }
        } else {
          console.error('Failed to remove user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }

      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <BackButtonWithUsername username={fullName} onBackClick={() => navigate('/dashboard')} />
      <ToggleButtons activeTab={activeTab} onTabSwitch={handleTabSwitch} />

      <Formik
        initialValues={{ searchTerm: '' }}
        validationSchema={Yup.object({
          searchTerm: Yup.string(),
        })}
        onSubmit={(values) => console.log(values.searchTerm)}
      >
        {({ values, handleChange, handleBlur }) => {
          const ChosenList = activeTab === 'followers' ? followers : followings;

          return (
            <Form className="w-full max-w-md mb-6 flex flex-col items-center justify-center">
              <SearchBar searchTerm={values.searchTerm} onSearchTermChange={handleChange} onBlur={handleBlur} />
              {loading ? (
                <p className="font-semibold text-primary text-2xl">در حال بارگذاری...</p>
              ) : (
                <UserCardList
                  users={ChosenList}
                  onDelete={handleDeleteClick}
                  isOwner={isOwner} 
                />
              )}
            </Form>
          );
        }}
      </Formik>

      {showDeleteModal && userToDelete && (
        <DeleteConfirmationModal
          username={userToDelete.username}
          listType={activeTab}
          onDeleteConfirm={handleDeleteConfirmation}
          onDeleteCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default FollowerFollowingPage;
