import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";

const heroImages = ["/hero.png", "/hero.png", "/hero.png"];

const HeroSection = () => (
  <Box
    position="relative"
    height="100vh"
    sx={{
      zIndex: 1,
    }}
  >
    <Swiper
      effect={"creative"}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      speed={800}
      loop={true}
      creativeEffect={{
        prev: { shadow: false, translate: ["-40%", 0, -1] },
        next: { translate: ["100%", 0, 0] },
      }}
      modules={[EffectCreative, Autoplay]}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {heroImages.map((image, index) => (
        <SwiperSlide key={index}>
          <Box
            component="img"
            src={image}
            alt={`Hero Image ${index + 1}`}
            sx={{
              width: "100vw",
              height: "100vh",
              minHeight: "100vh",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>

    <Box
      sx={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "10%",
        zIndex: 2,
      }}
    >
      <Typography
        textTransform="uppercase"
        color="background.default"
        fontWeight="bold"
        fontSize="3rem"
        textAlign="center"
      >
        Welcome to the works
      </Typography>
      <Typography
        color="background.default"
        fontSize="1.5rem"
        sx={{ mt: 2 }}
        textAlign="center"
      >
        A vibrant oasis in the heart of Bengaluru, where movement, culture and
        creativity come alive.
      </Typography>
    </Box>
  </Box>
);

export default HeroSection;
