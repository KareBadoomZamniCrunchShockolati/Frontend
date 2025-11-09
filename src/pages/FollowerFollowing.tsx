import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ToggleButtons from "@/components/FollowerFollowing/ToggleButtons";
import BackButtonWithUsername from "@/components/FollowerFollowing/BackButtonWithUsername";
import SearchBar from "@/components/FollowerFollowing/SearchBar";
import UserCardList from "@/components/FollowerFollowing/UserCardList";
import DeleteConfirmationModal from "@/components/FollowerFollowing/DeleteConfirmationModal";
import { fetchUsers } from "@/services/followerFollowingService";
import useUserStore from "@/store/userStore/userStore";
import { removeFollower, removeFollowing } from "@/services/followerFollowingService";
import type { FollowerFollowingUser } from "@/types/followerFollowing";


const FollowerFollowingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { token, id: loggedInUserId } = useUserStore(state => state);

  const { userId } = useParams();
  const selectedUser = userId || "0";


  const [userData, setUserData] = useState({
    followers: [] as FollowerFollowingUser[],
    followings: [] as FollowerFollowingUser[],
    filteredUsers: [] as FollowerFollowingUser[],
  });

  const [uiState, setUiState] = useState({
    activeTab: 'followers' as 'followers' | 'followings',
    showDeleteModal: false,
    userToDelete: null as { id: string; username: string } | null,
    loading: false,
    error: null as string | null,
  });

  const { activeTab, showDeleteModal, userToDelete, loading, error } = uiState;
  const fullName = location.state?.fullName || "Unknown User";
  const isOwner = loggedInUserId === selectedUser;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") as 'followers' | 'followings' | null;
    if (tab) {
      setUiState(prevState => ({ ...prevState, activeTab: tab }));
    }
  }, [location.search]);

  const fetchUserData = async () => {
    setUiState(prevState => ({ ...prevState, loading: true, error: null }));
    try {
      const users = await fetchUsers(selectedUser, activeTab);
      setUserData(prevState => ({
        ...prevState,
        [activeTab]: users || [],
        filteredUsers: users || [],
      }));
      setUiState(prevState => ({ ...prevState, loading: false }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUiState(prevState => ({
        ...prevState,
        loading: false,
        error: "Failed to load users. Please try again later.",
      }));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [selectedUser, activeTab]);

  const handleTabSwitch = (tab: 'followers' | 'followings') => {
    setUiState(prevState => ({ ...prevState, activeTab: tab }));
    navigate(`/follow/${selectedUser}?tab=${tab}`, { state: { fullName } });
  };

  const handleDeleteClick = (id: string, username: string) => {
    setUiState(prevState => ({ ...prevState, userToDelete: { id, username }, showDeleteModal: true }));
  };

  const handleDeleteConfirmation = async () => {
    if (userToDelete && token) {
      try {
        let response;
  
        console.log("Authorization token:", token);
  
        if (activeTab === 'followers') {
          response = await removeFollower(loggedInUserId, userToDelete.id, token);
        } else if (activeTab === 'followings') {
          response = await removeFollowing(loggedInUserId, userToDelete.id, token);
        }
  
        if (response) {
          setUserData(prevState => ({
            ...prevState,
            [activeTab]: prevState[activeTab].filter(user => user.id !== userToDelete.id),
            filteredUsers: prevState[activeTab].filter(user => user.id !== userToDelete.id),
          }));
          setUiState(prevState => ({
            ...prevState,
            showDeleteModal: false,
            userToDelete: null,
          }));
        } else {
          setUiState(prevState => ({
            ...prevState,
            error: `Failed to remove ${activeTab.slice(0, -1)}. Please try again.`,
          }));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setUiState(prevState => ({
          ...prevState,
          error: 'Error deleting user. Please try again later.',
        }));
      }
    } else {
      setUiState(prevState => ({
        ...prevState,
        error: 'Authentication required to perform this action.',
      }));
    }
  };
  

  const handleDeleteCancel = () => {
    setUiState(prevState => ({ ...prevState, showDeleteModal: false, userToDelete: null }));
  };

  const handleSearch = (searchTerm: string) => {
    const list = activeTab === 'followers' ? userData.followers : userData.followings;
    if (list) {
      const filteredList = list.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUserData(prevState => ({ ...prevState, filteredUsers: filteredList }));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <BackButtonWithUsername 
        username={fullName} 
        onBackClick={() => navigate(`/dashboard/${selectedUser}`)} 
      />
      <ToggleButtons activeTab={activeTab} onTabSwitch={handleTabSwitch} />

      <Formik
        initialValues={{ searchTerm: '' }}
        validationSchema={Yup.object({
          searchTerm: Yup.string(),
        })}
        onSubmit={() => {}}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form
            className="w-full max-w-md mb-6 flex flex-col items-center justify-center"
            onKeyDown={handleKeyDown}
          >
            <SearchBar 
              searchTerm={values.searchTerm} 
              onSearchTermChange={(e) => {
                handleChange(e);
                handleSearch(e.target.value);
              }} 
              onBlur={handleBlur} 
            />
            {loading ? (
              <p className="font-semibold text-primary text-2xl">در حال بارگذاری...</p>
            ) : error ? (
              <p className="font-semibold text-error text-2xl">{error}</p>
            ) : (
              <UserCardList 
                users={userData.filteredUsers}
                onDelete={handleDeleteClick} 
                isOwner={isOwner} 
              />
            )}
          </Form>
        )}
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
