import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { staticFile } from "remotion";

// Newspaper background images
const NEWSPAPER_BACKGROUNDS = [
  "backgrounds/random newspaper text backgdrop (1).jpg",
  "backgrounds/random newspaper text backgdrop.jpg",
  "backgrounds/random newspaper text cutouts backgdrop (1).jpg",
  "backgrounds/random newspaper text cutouts backgdrop (2).jpg",
  "backgrounds/random newspaper text cutouts backgdrop (3).jpg",
  "backgrounds/random newspaper text cutouts backgdrop (4).jpg",
];

const getRandomBackground = (index: number) => {
  return NEWSPAPER_BACKGROUNDS[index % NEWSPAPER_BACKGROUNDS.length];
};

interface ColorTheme {
  background: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  bubbleBg: string;
  bubbleBorder: string;
  bubbleText: string;
  accentGlow: string;
}

const THEMES: Record<string, ColorTheme> = {
  mightyDark: {
    background: "#141414",
    headerBg: "linear-gradient(135deg, #141414 0%, #1F1F25 100%)",
    headerBorder: "rgba(255, 255, 255, 0.1)",
    headerText: "#ffffff",
    bubbleBg: "linear-gradient(135deg, #141414 0%, #1F1F25 100%)",
    bubbleBorder: "rgba(255, 255, 255, 0.15)",
    bubbleText: "#ffffff",
    accentGlow: "rgba(255, 255, 255, 0.03)",
  },
  melodicaPurple: {
    background: "#151515",
    headerBg: "linear-gradient(135deg, #9F5AFD 0%, #FE54D1 100%)",
    headerBorder: "rgba(255, 255, 255, 0.2)",
    headerText: "#ffffff",
    bubbleBg: "linear-gradient(135deg, #151515 0%, #1a1a1a 100%)",
    bubbleBorder: "rgba(159, 90, 253, 0.3)",
    bubbleText: "#ffffff",
    accentGlow: "rgba(159, 90, 253, 0.1)",
  },
  melodicaGradient: {
    background: "#0a0a1a",
    headerBg: "linear-gradient(135deg, #093DF8 0%, #BC5FFC 100%)",
    headerBorder: "rgba(255, 255, 255, 0.2)",
    headerText: "#ffffff",
    bubbleBg: "linear-gradient(135deg, #093DF8 0%, #BC5FFC 100%)",
    bubbleBorder: "rgba(188, 95, 252, 0.4)",
    bubbleText: "#ffffff",
    accentGlow: "rgba(9, 61, 248, 0.15)",
  },
};

// Batch image data - organized by video groups
export const BATCH_VIDEOS = [
  {
    id: 1,
    title: "COOL PROMPT IDEAS - PART 1",
    theme: "mightyDark" as const,
    images: [
      { imageSrc: "batch-images/batch-image-11 (1).png", prompt: "AI Fashion Concept #11" },
      { imageSrc: "batch-images/batch-image-12 (2).png", prompt: "AI Fashion Concept #12" },
      { imageSrc: "batch-images/batch-image-13 (1).png", prompt: "AI Fashion Concept #13" },
      { imageSrc: "batch-images/batch-image-16.png", prompt: "AI Fashion Concept #16" },
    ],
  },
  {
    id: 2,
    title: "COOL PROMPT IDEAS - PART 2",
    theme: "melodicaPurple" as const,
    images: [
      { imageSrc: "batch-images/batch-image-17.png", prompt: "AI Fashion Concept #17" },
      { imageSrc: "batch-images/batch-image-26.png", prompt: "AI Fashion Concept #26" },
      { imageSrc: "batch-images/batch-image-27.png", prompt: "AI Fashion Concept #27" },
      { imageSrc: "batch-images/batch-image-28.png", prompt: "AI Fashion Concept #28" },
    ],
  },
  {
    id: 3,
    title: "COOL PROMPT IDEAS - PART 3",
    theme: "melodicaGradient" as const,
    images: [
      { imageSrc: "batch-images/batch-image-29.png", prompt: "AI Fashion Concept #29" },
      { imageSrc: "batch-images/batch-image-30.png", prompt: "AI Fashion Concept #30" },
      { imageSrc: "batch-images/batch-image-32.png", prompt: "AI Fashion Concept #32" },
      { imageSrc: "batch-images/batch-image-34.png", prompt: "AI Fashion Concept #34" },
    ],
  },
  {
    id: 4,
    title: "COOL PROMPT IDEAS - PART 4",
    theme: "mightyDark" as const,
    images: [
      { imageSrc: "batch-images/batch-image-41.png", prompt: "AI Fashion Concept #41" },
      { imageSrc: "batch-images/batch-image-43.png", prompt: "AI Fashion Concept #43" },
      { imageSrc: "batch-images/batch-image-44.png", prompt: "AI Fashion Concept #44" },
      { imageSrc: "batch-images/batch-image-49.png", prompt: "AI Fashion Concept #49" },
    ],
  },
  {
    id: 5,
    title: "COOL PROMPT IDEAS - PART 5 (BONUS)",
    theme: "melodicaPurple" as const,
    images: [
      { imageSrc: "batch-images/batch-image-5 (5).png", prompt: "AI Fashion Concept #5" },
      { imageSrc: "batch-images/batch-image-50.png", prompt: "AI Fashion Concept #50" },
    ],
  },
];

const MainHeader: React.FC<{ title: string; theme: ColorTheme }> = ({ title, theme }) => {
  const frame = useCurrentFrame();

  const headerEntry = spring({
    frame: frame,
    fps: 30,
    config: { damping: 15, stiffness: 100, mass: 1 },
  });

  const opacity = interpolate(headerEntry, [0, 1], [0, 1]);
  const translateY = interpolate(headerEntry, [0, 1], [-50, 0]);
  const scale = interpolate(headerEntry, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          background: theme.headerBg,
          padding: "40px 60px",
          margin: "0 20px",
          borderRadius: 24,
          border: `2px solid ${theme.headerBorder}`,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontFamily: '"Teko", "Impact", "Arial Black", sans-serif',
            fontSize: 100,
            fontWeight: 700,
            color: theme.headerText,
            margin: 0,
            textAlign: "center",
            letterSpacing: "8px",
            textTransform: "uppercase",
            lineHeight: 0.9,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, transparent, ${theme.headerText}40, transparent)`,
            marginTop: 12,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};

const TextBubble: React.FC<{ text: string; theme: ColorTheme }> = ({ text, theme }) => {
  const frame = useCurrentFrame();

  const appear = spring({
    frame: frame - 30,
    fps: 30,
    config: {
      damping: 15,
      stiffness: 100,
      mass: 1.5,
    },
  });

  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const scale = interpolate(appear, [0, 1], [0.5, 1]);
  const translateY = interpolate(appear, [0, 1], [30, 0]);

  const glowPulse = Math.sin(frame * 0.05) * 0.5 + 0.5;
  const glowOpacity = interpolate(glowPulse, [0, 1], [0.1, 0.3]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: `translate(-50%, 0)`,
        opacity,
        transformOrigin: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -13,
          background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)`,
          borderRadius: 38,
          opacity: glowOpacity,
          filter: "blur(25px)",
          zIndex: -1,
        }}
      />

      <div
        style={{
          background: theme.bubbleBg,
          borderRadius: 35,
          padding: "45px 60px",
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 50px rgba(255, 255, 255, ${glowOpacity * 0.1})`,
          position: "relative",
          border: `1px solid ${theme.bubbleBorder}`,
          backdropFilter: "blur(10px)",
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: theme.bubbleText,
            textTransform: "uppercase",
            letterSpacing: "8px",
            marginBottom: 15,
            textAlign: "center",
            fontFamily: '"Teko", "Impact", "Arial Black", sans-serif',
            opacity: 0.9,
          }}
        >
          ⚡ PROMPT
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 500,
            color: theme.bubbleText,
            fontFamily: '"Teko", "Arial", sans-serif',
            lineHeight: 1.3,
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

interface SlideProps {
  imageSrc: string;
  prompt: string;
  startFrame: number;
  theme: ColorTheme;
  videoIndex: number;
}

const Slide: React.FC<SlideProps> = ({ imageSrc, prompt, startFrame, theme, videoIndex }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  const imageEntry = spring({
    frame: relativeFrame,
    fps: 30,
    config: { damping: 12, stiffness: 60, mass: 1 },
  });

  const opacity = interpolate(imageEntry, [0, 1], [0, 1]);
  const scale = interpolate(imageEntry, [0, 1], [0.3, 1]);
  const rotate = interpolate(imageEntry, [0, 1], [-5, 0]);
  const slideX = interpolate(imageEntry, [0, 1], [-200, 0]);

  const floatOffset = Math.sin(relativeFrame * 0.015) * 20;
  const floatRotate = Math.sin(relativeFrame * 0.01) * 0.8;

  const maxWidth = width * 0.9;
  const maxHeight = height * 0.65;

  const glowPulse = Math.sin(relativeFrame * 0.03) * 0.5 + 0.5;
  const glowOpacity = interpolate(glowPulse, [0, 1], [0.1, 0.3]);
  const shadowOpacity = interpolate(glowPulse, [0, 1], [0.3, 0.6]);
  const shadowBlur = interpolate(glowPulse, [0, 1], [30, 60]);

  const randomBackground = getRandomBackground(videoIndex);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      {/* Newspaper Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          overflow: "hidden",
        }}
      >
        <img
          src={staticFile(randomBackground)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(30%) contrast(1.1) brightness(0.9)",
          }}
          alt="Newspaper background"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: theme.background,
            opacity: 0.7,
          }}
        />
      </div>

      {/* Animated glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% ${50 + floatOffset}%, ${theme.accentGlow} 0%, transparent 50%)`,
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, calc(-50% + ${floatOffset}px))`,
          width: maxWidth,
          height: maxHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={staticFile(imageSrc)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: 20,
            opacity,
            transform: `scale(${scale}) rotate(${rotate + floatRotate}deg) translateX(${slideX}px)`,
            boxShadow: `0 ${20 + shadowBlur/2}px ${60 + shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}), 0 0 ${40 * glowOpacity}px ${theme.accentGlow}`,
            border: `1px solid ${theme.bubbleBorder}`,
          }}
          alt="Slide"
        />
      </div>

      <TextBubble text={prompt} theme={theme} />
    </AbsoluteFill>
  );
};

interface BatchImagesCarouselProps {
  videoId: number;
}

export const BatchImagesCarousel: React.FC<BatchImagesCarouselProps> = ({ videoId }) => {
  const frame = useCurrentFrame();

  const videoData = BATCH_VIDEOS.find(v => v.id === videoId);
  if (!videoData) return null;

  const theme = THEMES[videoData.theme];
  const slides = videoData.images.map((img, index) => ({
    imageSrc: img.imageSrc,
    prompt: img.prompt,
    startFrame: index * 120, // 120 frames = 4 seconds per slide at 30fps
  }));

  const totalDuration = slides.length * 120;

  const currentSlideIndex = slides.findIndex(
    (slide, index) =>
      frame >= slide.startFrame &&
      (index === slides.length - 1 || frame < slides[index + 1].startFrame)
  );

  if (currentSlideIndex === -1 || frame >= totalDuration) {
    return (
      <AbsoluteFill style={{ backgroundColor: theme.background }}>
        <MainHeader title={videoData.title} theme={theme} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: theme.headerText,
            fontSize: 48,
            fontFamily: '"Teko", sans-serif',
          }}
        >
          END OF SHOW
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <>
      <MainHeader title={videoData.title} theme={theme} />
      <Slide {...slides[currentSlideIndex]} theme={theme} videoIndex={videoId} />
    </>
  );
};
