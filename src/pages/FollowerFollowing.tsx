import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ToggleButtons from "@/components/FollowerFollowing/ToggleButtons";
import BackButtonWithUsername from "@/components/FollowerFollowing/BackButtonWithUsername";
import SearchBar from "@/components/FollowerFollowing/SearchBar";
import UserCardList from "@/components/FollowerFollowing/UserCardList";
import DeleteConfirmationModal from "@/components/FollowerFollowing/DeleteConfirmationModal";
import { fetchUsers, removeFollower, removeFollowing } from "@/services/followerFollowingService";
import useUserStore from "@/store/userStore/userStore";
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

  // Effect to update the active tab from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") as 'followers' | 'followings' | null;
    if (tab) {
      setUiState(prevState => ({ ...prevState, activeTab: tab }));
    }
  }, [location.search]);

  // Fetch user data based on selected user and active tab
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

  // Fetch user data on page load or when activeTab or selectedUser changes
  useEffect(() => {
    fetchUserData();
  }, [selectedUser, activeTab]);

  // Switch between followers and followings tab
  const handleTabSwitch = (tab: 'followers' | 'followings') => {
    setUiState(prevState => ({ ...prevState, activeTab: tab }));
    navigate(`/follow/${selectedUser}?tab=${tab}`, { state: { fullName } });
  };

  // Handle delete button click
  const handleDeleteClick = (id: string, username: string) => {
    setUiState(prevState => ({ ...prevState, userToDelete: { id, username }, showDeleteModal: true }));
  };

  // Handle confirmation of user deletion
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

  // Handle canceling the delete action
  const handleDeleteCancel = () => {
    setUiState(prevState => ({ ...prevState, showDeleteModal: false, userToDelete: null }));
  };

  // Search for users
  const handleSearch = (searchTerm: string) => {
    const list = activeTab === 'followers' ? userData.followers : userData.followings;
    if (list) {
      const filteredList = list.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUserData(prevState => ({ ...prevState, filteredUsers: filteredList }));
    }
  };

  // Prevent form submit on Enter keypress
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
