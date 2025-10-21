import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import UserCard from "@/components/Follower_Following/UserCard";
import CustomButton from '@/components/Custom/CustomButton';
import CustomInput from "@/components/Custom/CustomInput";

const FollowerFollowingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'followers' | 'followings'>('followers');

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

  // Validation schema for the search term field (you can adjust it)
  const validationSchema = Yup.object({
    searchTerm: Yup.string().min(3, "حداقل ۳ کاراکتر وارد کنید")
  });

  // Handle Formik form submission
  const handleSubmit = (values: { searchTerm: string }) => {
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      {/* Main Username & Back Button */}
      <div className="flex justify-start items-center mb-6 w-full">
      <button 
        className="text-orange-500 border-2 border-orange-500 rounded-[12.5px] px-4 py-2 flex items-center justify-center mr-4 hover:bg-orange-500 hover:text-white shadow-md hover:shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="orange" strokeWidth="2" className="w-6 h-6">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>

        <h2 className="font-bold text-xl">Username</h2>
      </div>

      {/* Toggle Buttons (Followers / Followings) */}
      <div className="mb-6 flex justify-start">
        <CustomButton
          className={`px-4 py-2 ${activeTab === 'followings' ? 'bg-secondary text-white hover:bg-secondary' : 'bg-white text-secondary hover:bg-white'} rounded-r-none border-r-[0.5px]`}
          onClick={() => handleTabSwitch('followings')}
        >
          دنبال شوندگان
        </CustomButton>
        <CustomButton
          className={`px-4 py-2 ${activeTab === 'followers' ? 'bg-secondary text-white hover:bg-secondary' : 'bg-white text-secondary hover:bg-white'} rounded-l-none border-l-[0.5px]`}
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
          // Filter the list based on search term
          const filteredList = (activeTab === 'followers' ? followers : followings).filter((user) =>
            user.username.toLowerCase().includes(values.searchTerm.toLowerCase())
          );

          return (
            <Form className="w-full max-w-md mb-6">
              {/* Search Input Field */}
              <CustomInput className ='w-100'
                name="searchTerm"
                label=""
                value={values.searchTerm}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* List of Followers or Followings using UserCard */}
              <div className="w-full max-w-md flex justify-center">
                {filteredList.length > 0 ? (
                  <div className="space-y-2">
                    {filteredList.map((user) => (
                      <UserCard key={user.id} id={user.id} username={user.username} imagePath={user.imagePath}/>
                    ))}
                  </div>
                ) : (
                  <p className="font-black">!موردی یافت نشد</p>
                )}
              </div>

            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FollowerFollowingPage;
