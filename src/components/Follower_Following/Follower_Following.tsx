import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ToggleButtons from "@/components/Follower_Following/ToggleButtons";
import BackButtonWithUsername from "@/components/Follower_Following/BackButtonWithUsername";
import SearchBar from "@/components/Follower_Following/SearchBar";
import UserCardList from "@/components/Follower_Following/UserCardList";
import DeleteConfirmationModal from "@/components/Follower_Following/DeleteConfirmationModal";

const FollowerFollowingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'followers' | 'followings'>('followers');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null);
  const [followers, setFollowers] = useState([
    { id: '1', username: 'mahditd0010', imagePath: 'path_to_image1' },
    { id: '2', username: 'samiskh', imagePath: 'path_to_image2' },
    { id: '3', username: 'CNumb6004', imagePath: 'path_to_image3' },
    { id: '7', username: 'Soroush1384ak', imagePath: 'path_to_image4' },
  ]);
  const [followings, setFollowings] = useState([
    { id: '4', username: 'User4', imagePath: 'path_to_image4' },
    { id: '5', username: 'User5', imagePath: 'path_to_image5' },
    { id: '6', username: 'User6', imagePath: 'path_to_image6' },
  ]);

  // Retrieve fullName from the navigation state
  const fullName = location.state?.fullName || "Unknown User"; 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") as 'followers' | 'followings' | null;
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabSwitch = (tab: 'followers' | 'followings') => {
    setActiveTab(tab);
    navigate(`/follow?tab=${tab}`, { state: { fullName } }); // Pass fullName in state
  };

  const handleDeleteClick = (id: string, username: string) => {
    setUserToDelete({ id, username });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (userToDelete) {
      console.log(`Deleting user: ${userToDelete.username}`);
  
      if (activeTab === 'followers') {
        setFollowers(followers.filter(user => user.id !== userToDelete.id));
      } else if (activeTab === 'followings') {
        setFollowings(followings.filter(user => user.id !== userToDelete.id));
      }
  
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const validationSchema = Yup.object({
    searchTerm: Yup.string().min(3, 'Search term must be at least 3 characters').required('')
  });

  const handleSubmit = (values: { searchTerm: string }) => {
    console.log("Search term:", values.searchTerm);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <BackButtonWithUsername username={fullName} onBackClick={() => navigate('/dashboard')} />

      <ToggleButtons activeTab={activeTab} onTabSwitch={handleTabSwitch} />

      <Formik
        initialValues={{ searchTerm: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, handleChange, handleBlur }) => {
          const ChosenList = activeTab === 'followers' ? followers : followings;

          return (
            <Form className="w-full max-w-md mb-6 flex flex-col items-center justify-center">
              <SearchBar searchTerm={values.searchTerm} onSearchTermChange={handleChange} onBlur={handleBlur} />
              <UserCardList users={ChosenList} onDelete={handleDeleteClick} />
            </Form>
          );
        }}
      </Formik>

      {showDeleteModal && userToDelete && (
        <DeleteConfirmationModal
          username={userToDelete.username}
          onDeleteConfirm={handleDeleteConfirmation}
          onDeleteCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default FollowerFollowingPage;
