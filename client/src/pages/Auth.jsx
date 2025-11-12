import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const navigate = useNavigate();

  // Define the URL the user should be redirected to after successful sign-in/sign-up.
  const DASHBOARD_URL = "/dashboard"; 

  // The Clerk <SignIn /> component handles both Login and Registration forms.
  return (
    <div className="flex justify-center items-center py-10">
      <SignIn 
      
        routing="path" 
        path="/login" 
        signUpUrl="/register"
        signInForceRedirectUrl={DASHBOARD_URL} 
        signUpForceRedirectUrl={DASHBOARD_URL}
      />
    </div>
  );
}