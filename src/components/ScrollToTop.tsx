
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when path changes
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    // Also add a slight delay scroll to make sure all content is loaded
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
