import ReactPlayer from "react-player";

const VideoPlayer = ({ url }) => {
  return (
    <div className="bg-black rounded-lg overflow-hidden aspect-video">
      {url ? (
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          config={{
            youtube: {
              playerVars: { showinfo: 1 },
            },
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          No video available
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
