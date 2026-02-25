import { Composition } from "remotion";
import { BatchImagesCarousel } from "./compositions/BatchImagesCarousel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BatchCarousel-Video1"
        component={() => <BatchImagesCarousel videoId={1} />}
        durationInFrames={480}
        fps={30}
        width={1280}
        height={720}
        audioCodec={null}
      />
      <Composition
        id="BatchCarousel-Video2"
        component={() => <BatchImagesCarousel videoId={2} />}
        durationInFrames={480}
        fps={30}
        width={1280}
        height={720}
        audioCodec={null}
      />
      <Composition
        id="BatchCarousel-Video3"
        component={() => <BatchImagesCarousel videoId={3} />}
        durationInFrames={480}
        fps={30}
        width={1280}
        height={720}
        audioCodec={null}
      />
      <Composition
        id="BatchCarousel-Video4"
        component={() => <BatchImagesCarousel videoId={4} />}
        durationInFrames={480}
        fps={30}
        width={1280}
        height={720}
        audioCodec={null}
      />
      <Composition
        id="BatchCarousel-Video5"
        component={() => <BatchImagesCarousel videoId={5} />}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
        audioCodec={null}
      />
    </>
  );
};

export default RemotionRoot;
