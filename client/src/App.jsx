import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import SignInPage from './pages/Auth.jsx'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';


export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        
     

        <main className="flex-grow p-4 md:p-8">
          <Routes>
            
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignInPage />} />

            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn> 
                      <Dashboard /> 
                  </SignedIn>
                  <SignedOut>
                      <RedirectToSignIn /> 
                  </SignedOut>
                </>
              }
            />

            <Route path="/" element={
             <>
               <SignedIn>
                   <Dashboard />
               </SignedIn>
               <SignedOut>
                   <RedirectToSignIn />
               </SignedOut>
             </>
            } />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}