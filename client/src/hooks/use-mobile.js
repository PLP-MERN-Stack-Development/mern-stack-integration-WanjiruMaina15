import { useState, useEffect } from 'react';

// Define the breakpoint (e.g., 768px for Tailwind's 'md' breakpoint)
const MOBILE_BREAKPOINT = 768; 

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check the screen width
    const checkMobile = () => {
      // window.innerWidth is the current width of the viewport
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // 1. Run once on mount
    checkMobile(); 

    // 2. Add event listener to recalculate on resize
    window.addEventListener('resize', checkMobile);

    // 3. Cleanup function to remove the listener
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};