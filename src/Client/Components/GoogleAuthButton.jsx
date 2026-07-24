import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '../../store/authSlice';

const GoogleAuthButton = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Replace this with the actual Google Client ID from Google Cloud Console
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleCredentialResponse = async (response) => {
      try {
        const resultAction = await dispatch(loginWithGoogle(response.credential));
        if (loginWithGoogle.fulfilled.match(resultAction)) {
          if (onSuccess) onSuccess();
        } else {
          if (onError) onError(resultAction.payload || 'Google Login failed');
        }
      } catch (error) {
        if (onError) onError('An error occurred during Google Sign-in');
      }
    };

    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        { theme: 'outline', size: 'large', width: '100%', text: 'continue_with', shape: 'pill' } 
      );
    }
  }, [dispatch, onSuccess, onError]);

  return (
    <div className="w-full flex justify-center my-4">
      <div ref={googleButtonRef} className="w-full"></div>
    </div>
  );
};

export default GoogleAuthButton;
