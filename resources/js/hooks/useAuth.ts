import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../store/store';
import { getUser, setToken } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(setToken(storedToken));
    }
    
    if (storedToken && !user && !isLoading) {
      dispatch(getUser());
    }
  }, [dispatch, token, user, isLoading]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
  };
};