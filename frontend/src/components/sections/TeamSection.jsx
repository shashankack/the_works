import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import useTrainers from "../../hooks/useTrainers";
import { useCachedTrainers } from "../../hooks/useCachedTrainers";
import trainersBg from "../../assets/images/teams_bg.png";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import gsap from "gsap";

const TeamSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Use cached trainers hook with public data (adminMode: false)
  const { trainers, loading, error } = useCachedTrainers({ adminMode: false });

  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const swiperRef = useRef(null);

  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const textRef = useRef(null);

  const animateOutro = () => {
    return gsap.to([nameRef.current, roleRef.current, textRef.current], {
      duration: 0.3,
      yPercent: -100,
      opacity: 0,
      stagger: 0.05,
      ease: "power2.in",
    });
  };

  const animateIntro = () => {
    return gsap.fromTo(
      [nameRef.current, roleRef.current, textRef.current],
      { yPercent: 100, opacity: 0 },
      {
        duration: 0.4,
        yPercent: 0,
        opacity: 1,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  };

  const changeSlide = (newIndex) => {
    if (animating || newIndex === activeIndex || !trainers.length) return;

    setAnimating(true);

    // Animate out current content
    animateOutro().eventCallback("onComplete", () => {
      // Update the index and slide
      setActiveIndex(newIndex);

      // Use setTimeout to ensure DOM updates before animating in
      setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.slideTo(newIndex, 300, false); // Add duration and disable auto-animation
        }

        // Animate in new content after a small delay
        setTimeout(() => {
          animateIntro().eventCallback("onComplete", () => {
            setAnimating(false);
          });
        }, 100);
      }, 50);
    });
  };

  const handlePrev = () => {
    if (!trainers.length) return;
    const newIndex = activeIndex === 0 ? trainers.length - 1 : activeIndex - 1;
    changeSlide(newIndex);
  };

  const handleNext = () => {
    if (!trainers.length) return;
    const newIndex = activeIndex === trainers.length - 1 ? 0 : activeIndex + 1;
    changeSlide(newIndex);
  };

  const handleSlideChange = (swiper) => {
    // Only trigger animation if it's not already animating and the change wasn't triggered programmatically
    if (!animating && swiper.activeIndex !== activeIndex) {
      changeSlide(swiper.activeIndex);
    }
  };

  const currentTrainer = trainers[activeIndex];

  // Initial animation when trainers load
  useEffect(() => {
    if (trainers.length > 0 && !animating) {
      // Set initial state
      gsap.set([nameRef.current, roleRef.current, textRef.current], {
        yPercent: 100,
        opacity: 0,
      });

      // Animate in after a short delay
      setTimeout(() => {
        animateIntro();
      }, 500);
    }
  }, [trainers.length]);

  // Show loading state
  if (loading) {
    return (
      <Box
        height={isMobile ? "auto" : "100vh"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#E9E3DA",
          backgroundImage: `url(${trainersBg})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Typography variant="h4" color="#B35A26">
          Loading our amazing trainers...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box
        height={isMobile ? "auto" : "100vh"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#E9E3DA",
          backgroundImage: `url(${trainersBg})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // Show empty state
  if (!trainers.length) {
    return (
      <Box
        height={isMobile ? "auto" : "100vh"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#E9E3DA",
          backgroundImage: `url(${trainersBg})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Typography variant="h4" color="#B35A26">
          No trainers available at the moment
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      height={isMobile ? "auto" : "100vh"}
      px={isMobile ? 1 : 10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={isMobile ? "column" : "row"}
      sx={{
        backgroundColor: "#E9E3DA",
        backgroundImage: `url(${trainersBg})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: theme.palette.brown,
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {isMobile && (
        <Typography
          variant="h4"
          fontSize="8vw"
          fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
          fontWeight={700}
          mb={1}
          sx={{ letterSpacing: 1, textTransform: "uppercase" }}
        >
          Meet Our Trainers
        </Typography>
      )}
      <Box
        width={isMobile ? " 95vw" : "30vw"}
        height={isMobile ? "40vh" : "60vh"}
        sx={{ position: "relative" }}
      >
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          speed={300}
          allowTouchMove={!animating}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          navigation={{
            prevEl: prevBtnRef.current,
            nextEl: nextBtnRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevBtnRef.current;
            swiper.params.navigation.nextEl = nextBtnRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          style={{ height: "100%" }}
        >
          {trainers.map((trainer) => (
            <SwiperSlide key={trainer.id}>
              <Box
                component="img"
                src={trainer.profileImage || "/default-trainer.png"}
                alt={trainer.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  userSelect: "none",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Stack
        ml={isMobile ? 0 : 6}
        width={isMobile ? "100%" : "40vw"}
        height={isMobile ? "auto" : "60vh"}
        justifyContent="space-between"
      >
        <Stack gap={2}>
          {!isMobile && (
            <Typography
              variant={isMobile ? "h5" : "h3"}
              fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
              fontWeight={700}
              mb={1}
              sx={{ letterSpacing: 1, textTransform: "uppercase" }}
            >
              Meet Your Coach
            </Typography>
          )}

          <Box overflow="hidden">
            <Typography
              ref={nameRef}
              variant="h3"
              fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
              fontWeight={700}
              sx={{ color: "#B35A26" }}
            >
              {currentTrainer?.name || "Expert Trainer"}
            </Typography>
          </Box>

          <Box overflow="hidden">
            <Typography
              ref={roleRef}
              variant="h6"
              fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
              fontWeight={600}
              color={theme.palette.orange}
              textTransform="uppercase"
              letterSpacing={1}
            >
              {currentTrainer?.specializations &&
              currentTrainer.specializations.length > 0
                ? currentTrainer.specializations.join(" • ")
                : "Fitness Specialist"}
            </Typography>
          </Box>

          <Box overflow="hidden" minHeight={150}>
            <Typography
              ref={textRef}
              variant="h6"
              fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
              color={theme.palette.brown}
              mb={10}
            >
              {currentTrainer?.bio ||
                "Dedicated to helping you achieve your fitness goals with expertise and passion."}
            </Typography>
          </Box>
        </Stack>

        {/* Navigation Buttons */}
        {!isMobile && (
          <Stack direction="row" pb={2} pl={2} gap={4}>
            <ArrowBackIosIcon
              aria-label="previous"
              fontSize="large"
              color="primary"
              ref={prevBtnRef}
              onClick={handlePrev}
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  color: theme.palette.orange,
                  cursor: "pointer",
                  transform: "scale(1.1) translateX(-5px)",
                },
              }}
            />

            <ArrowForwardIosIcon
              fontSize="large"
              color="primary"
              ref={nextBtnRef}
              onClick={handleNext}
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  color: theme.palette.orange,
                  cursor: "pointer",
                  transform: "scale(1.1) translateX(5px)",
                },
              }}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default TeamSection;
