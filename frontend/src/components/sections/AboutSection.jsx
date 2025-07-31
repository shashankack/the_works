import { Box, Typography, useMediaQuery, useTheme, Stack } from "@mui/material";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import founderImg from "/founder.png";
import founderImgMobile from "/raghu_founder.jpg";

const aboutData = [
  {
    title: "Our Legacy and Vision",
    description:
      "Rooted in The Nilgiris 1905 legacy, The Works blends tradition and creativity a space for communities to move, connect, and grow together.",
  },
  {
    title: "Our Space",
    description:
      "The Works is a space where movement, art, and community come together. Whether you're training, creating, or connecting it’s a place to grow, express, and belong.",
  },
  {
    title: "What to expect",
    description:
      "Train with purpose at The Works personalized kickboxing and Muay Thai sessions that build strength, confidence, and discipline, in and out of the gym.",
  },
];

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const stackRef = useRef(null);
  const textContainerRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stackRef.current,
        { yPercent: -150 },
        {
          yPercent: 0,
          ease: "back",
          delay: 0.5,
          duration: 0.6,
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top top",
            end: "bottom+=100 top",
            toggleActions: "play none none none", //
          },
        }
      );
    }, stackRef);

    gsap.fromTo(
      titleRef.current,
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out",
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out",
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => ctx.revert();
  });

  return (
    <>
      {isMobile ? (
        <Stack bgcolor={theme.palette.beige} overflow="hidden">
          <Box
            height="60vh"
            bgcolor={theme.palette.orange}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              component="img"
              src={founderImgMobile}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            fontSize="8vw"
            color={theme.palette.orange}
            textTransform="uppercase"
            fontWeight={500}
            whiteSpace="nowrap"
            textAlign="center"
            mt={3}
          >
            Meet our founder
          </Typography>
          <Typography
            color={theme.palette.orange}
            variant="body1"
            fontSize="4.2vw"
            fontWeight={400}
            textAlign="justify"
            mx="auto"
            width={"95%"}
            sx={{
              textAlignLast: "center",
            }}
          >
            Meet Raghuram martial artist, community builder, legacy holder. With
            deep roots in Muay Thai and Kickboxing, he turned passion into
            purpose running a private gym and now, The Works. It’s not just
            about strength, it’s about self-expression, discipline, and creating
            space for others to thrive.
          </Typography>
        </Stack>
      ) : (
        <Box>
          <Box
            zIndex={10}
            position="relative"
            height="100vh"
            bgcolor={"primary.main"}
            display="flex"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
          >
            <Box
              ref={textContainerRef}
              ml="-15vw"
              position="relative"
              height={700}
              width="55vw"
              display="flex"
              flexDirection="column"
              justifyContent="start"
              alignItems="center"
              textAlign="center"
              padding={20}
            >
              <Box overflow="hidden">
                <Typography
                  ref={titleRef}
                  variant="h2"
                  fontSize="3.4vw"
                  textTransform="uppercase"
                  fontWeight={500}
                  whiteSpace="nowrap"
                  color="background.default"
                >
                  Meet our founder
                </Typography>
              </Box>
              <Typography
                ref={textRef}
                variant="body1"
                fontSize="1.3vw"
                fontWeight={400}
                mt={2}
                textAlign="justify"
                width={"80%"}
                color="background.default"
              >
                Meet Raghuram martial artist, community builder, legacy holder.
                With deep roots in Muay Thai and Kickboxing, he turned passion
                into purpose running a private gym and now, The Works. It’s not
                just about strength, it’s about self-expression, discipline, and
                creating space for others to thrive.
              </Typography>

              <Box
                width="50vw"
                overflow="hidden"
                sx={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "35vw",
                }}
              >
                <Box
                  component="img"
                  src={founderImg}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Stack
            borderColor={theme.palette.orange}
            bgcolor={theme.palette.beige}
            height="70vh"
            direction="row"
            gap={10}
            p={10}
            justifyContent="space-evenly"
          >
            <Stack
              ref={stackRef}
              direction="row"
              gap={10}
              width="100%"
              justifyContent="space-evenly"
            >
              {aboutData.map((item, index) => (
                <Box
                  key={index}
                  bgcolor="primary.main"
                  width="100%"
                  maxWidth="20vw"
                  boxShadow="6px 6px 0 0 #4E2916"
                >
                  <Typography
                    variant="h6"
                    fontSize="1.4vw"
                    textTransform="uppercase"
                    fontWeight={500}
                    whiteSpace="nowrap"
                    textAlign="center"
                    color="background.default"
                    mt={5}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontSize="1.4vw"
                    fontWeight={400}
                    mt={2}
                    textAlign="start"
                    width={"80%"}
                    marginX="auto"
                    color="background.default"
                  >
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default AboutSection;
