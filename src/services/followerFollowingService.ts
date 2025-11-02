import { getData } from "./services";

export const fetchUsers = async (loggedInUserId: string, activeTab: 'followers' | 'followings') => {
    const endpoint = activeTab === 'followers' 
      ? `/api/v1/users/${loggedInUserId}/followers`
      : `/api/v1/users/${loggedInUserId}/following`;
  
    try {
      const data = await getData({ endPoint: endpoint });
      return data.users;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  };