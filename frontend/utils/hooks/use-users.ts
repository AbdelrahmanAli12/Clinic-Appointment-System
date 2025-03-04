import { useEffect, useState } from 'react';
import { openNotification } from '..';
import { UserInfoProps } from '../types';

const useUsers = ({ refreshToken = null, endpointQuery = '' }) => {
  const [allUsers, setAllUsers] = useState<UserInfoProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUsers() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users${endpointQuery}`);
        const result = await response.json();

        if (!response.ok && result.operation !== 200)
          return openNotification({
            type: 'error',
            message: result.message ?? 'API Failed to get users',
          });

        setAllUsers(result.data);
      } catch (error) {
        console.error('Failed while getting all users ', error);
        openNotification({
          message: 'Failed to get all users ' + error,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    getUsers();
  }, [refreshToken]);

  return {
    allUsers,
    loading,
  };
};

export default useUsers;
