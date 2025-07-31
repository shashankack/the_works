import { useEffect, useRef } from "react";
import AboutSection from "../components/sections/AboutSection";
import ActivitesSection from "../components/sections/ActivitesSection";
import ContactSection from "../components/sections/ContactSection";
import HeroSection from "../components/sections/HeroSection";
import TeamSection from "../components/sections/TeamSection";

const Home = () => {
  const activitiesSectionRef = useRef(null);

  useEffect(() => {
    // Check if user just logged in and had a pending registration
    const pendingRegistration = sessionStorage.getItem('pendingRegistration');
    if (pendingRegistration) {
      try {
        const activity = JSON.parse(pendingRegistration);
        // Clear the pending registration
        sessionStorage.removeItem('pendingRegistration');
        
        // Scroll to activities section and trigger registration
        if (activitiesSectionRef.current) {
          activitiesSectionRef.current.scrollIntoView({ 
            behavior: 'smooth' 
          });
          
          // Small delay to ensure scroll is complete, then trigger registration
          setTimeout(() => {
            // Trigger the registration for this activity
            // This would need to be implemented in ActivitesSection
            const event = new CustomEvent('triggerRegistration', { 
              detail: activity 
            });
            window.dispatchEvent(event);
          }, 1000);
        }
      } catch (error) {
        console.error("Failed to parse pending registration:", error);
        sessionStorage.removeItem('pendingRegistration');
      }
    }
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <div ref={activitiesSectionRef}>
        <ActivitesSection />
      </div>
      <TeamSection />
      <ContactSection />
    </>
  );
};

export default Home;
