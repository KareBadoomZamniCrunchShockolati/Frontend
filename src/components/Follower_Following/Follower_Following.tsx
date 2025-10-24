import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ToggleButtons from '@/components/Follower_Following/ToggleButtons';
import BackButtonWithUsername from '@/components/Follower_Following/BackButtonWithUsername'; 
import SearchBar from '@/components/Follower_Following/SearchBar';  
import UserCardList from '@/components/Follower_Following/UserCardList';  
import DeleteConfirmationModal from '@/components/Follower_Following/DeleteConfirmationModal';  // Import the DeleteConfirmationModal

const FollowerFollowingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'followers' | 'followings'>('followers');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null);
  const [username] = useState('Username'); // This should be dynamic or passed as a prop in real use case

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

  const handleTabSwitch = (tab: 'followers' | 'followings') => {
    setActiveTab(tab);
  };

  const handleDeleteClick = (id: string, username: string) => {
    setUserToDelete({ id, username });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (userToDelete) {
      console.log(`Deleting user: ${userToDelete.username}`);
  
      // Remove user from the active tab (followers or followings)
      if (activeTab === 'followers') {
        setFollowers(followers.filter(user => user.id !== userToDelete.id));
      } else if (activeTab === 'followings') {
        setFollowings(followings.filter(user => user.id !== userToDelete.id));
      }
  
      // Close the modal
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const validationSchema = Yup.object({});

  const handleSubmit = (values: { searchTerm: string }) => {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      {/* Main Username & Back Button */}
      <BackButtonWithUsername 
        username={username} 
        onBackClick={() => console.log("Back button clicked!")} // You can define your back action here
      />

      {/* Toggle Buttons (Followers / Followings) */}
      <ToggleButtons activeTab={activeTab} onTabSwitch={handleTabSwitch} />

      {/* Formik Form for Search */}
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
              {/* Search Bar */}
              <SearchBar 
                searchTerm={values.searchTerm} 
                onSearchTermChange={handleChange} 
                onBlur={handleBlur} 
              />

              {/* List of Followers or Followings using UserCardList */}
              <UserCardList users={ChosenList} onDelete={handleDeleteClick} />
            </Form>
          );
        }}
      </Formik>

      {/* Modal for Delete Confirmation */}
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
