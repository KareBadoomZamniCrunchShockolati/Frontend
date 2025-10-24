import { useState } from 'react';
import { Formik, Form } from 'formik';
import { ArrowLeft } from 'lucide-react';
import * as Yup from 'yup';
import UserCard from '@/components/Follower_Following/UserCard';
import CustomButton from '@/components/Custom/CustomButton';
import CustomInput from '@/components/Custom/CustomInput';

const FollowerFollowingPage: React.FC = () => {
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
      <div className="flex justify-start items-center mb-10 w-full">
        <button className="text-primary w-13 h-13 border-2 border-primary rounded-[12.5px] px-2 py-2 flex items-center justify-center mr-4">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>

        <h2 className="font-bold text-xl mt-2">Username</h2>
      </div>

      {/* Toggle Buttons (Followers / Followings) */}
      <div className="mb-6 flex justify-start">
        <CustomButton
          className={`px-4 py-2 h-8 ${activeTab === 'followings' ? 'bg-secondary text-white hover:bg-secondary' : 'bg-white text-secondary hover:bg-white'} rounded-r-none border-r-[0.5px] w-44 font-semibold`}
          onClick={() => handleTabSwitch('followings')}
        >
          دنبال شوندگان
        </CustomButton>
        <CustomButton
          className={`px-4 py-2 h-8 ${activeTab === 'followers' ? 'bg-secondary text-white hover:bg-secondary' : 'bg-white text-secondary hover:bg-white'} rounded-l-none border-l-[0.5px] w-44 font-semibold`}
          onClick={() => handleTabSwitch('followers')}
        >
          دنبال کنندگان
        </CustomButton>
      </div>

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
              {/* Search Input Field */}
              <div className="flex justify-center mb-3">
                <CustomInput
                  className="w-88 h-8 rounded-[12.5px]"
                  name="searchTerm"
                  label=""
                  value={values.searchTerm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {/* List of Followers or Followings using UserCard */}
              <div className="w-full max-w-md flex justify-center overflow-y-auto max-h-96 scrollbar-custom">
                {ChosenList.length > 0 ? (
                  <div className="space-y-2">
                    {ChosenList.map((user) => (
                      <UserCard
                        key={user.id}
                        id={user.id}
                        username={user.username}
                        imagePath={user.imagePath}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-semibold m-10 text-primary text-5xl">!موردی یافت نشد</p>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Modal for Delete Confirmation */}
      {showDeleteModal && userToDelete && (
        <>
          {/* Overlay with onClick to trigger cancel */}
          <div 
            className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-50 pointer-events-auto" 
            onClick={handleDeleteCancel} // Cancel on overlay click
          ></div>

          {/* Confirmation Modal */}
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg p-4 z-60 border-2 border-black"
            onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicked
          >
            <div className="flex flex-col items-center">
              <p className="font-bold text-lg mb-4">آیا مطمئن هستید که می‌خواهید {userToDelete?.username} را حذف کنید؟</p>

              <div className="flex flex-col space-x-4">
                <CustomButton 
                  className="bg-white-500 text-primary px-4 py-2 mb-3 rounded-lg shadow-primary border-primary hover:bg-white" 
                  onClick={handleDeleteConfirmation}
                >
                  حذف
                </CustomButton>
                <CustomButton 
                  className="bg-white text-secondary px-4 py-2 rounded-lg shadow-secondary border-secondary hover:bg-white" 
                  onClick={handleDeleteCancel}
                >
                  انصراف
                </CustomButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


export default FollowerFollowingPage;
