"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  LocalUser,
} from "agora-rtc-react";
import AppInput from "@/app/video/app-input";

export default function WaitingRoom() {
  const router = useRouter();
  const [media, setMedia] = useState({
    audio: false,
    video: false,
  });
  const localTracks = useRef<{
    videoTrack: ICameraVideoTrack | null;
    audioTrack: IMicrophoneAudioTrack | null;
  }>({
    videoTrack: null,
    audioTrack: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();

        setMedia((prev) => ({
          ...prev,
          video: !!videoTrack,
        }));
        localTracks.current.videoTrack = videoTrack;
      } catch (videoError) {
        console.log({ mediaError: videoError });
      }
      try {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "music_standard",
        });

        setMedia((prev) => ({
          ...prev,
          audio: !!audioTrack,
        }));
        localTracks.current.audioTrack = audioTrack;
      } catch (audioError) {
        console.log({ mediaError: audioError });
      }
    })();
  }, []);

  const isLoading =
    !localTracks.current.audioTrack || !localTracks.current.videoTrack;

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 mt-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
        <span className="text-black">NextJS</span> x{" "}
        <span className="text-blue-500">Agora</span>
      </h1>
      <div className="flex flex-col gap-6">
        <LocalUser
          audioTrack={localTracks.current.audioTrack}
          cameraOn={media.video}
          playVideo={media.video}
          micOn={media.audio}
          playAudio={media.audio}
          videoTrack={localTracks.current.videoTrack}
          style={{
            width: "15rem",
            aspectRatio: "9/16",
            background: "white",
          }}
        >
          <div className="flex justify-center items-center h-full">
            {isLoading && (
              <div
                className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </LocalUser>

        <div className="flex gap-2 justify-center">
          <button
            className={`p-2 rounded-md bg-red-300 ${
              media.audio && "bg-blue-500"
            }`}
          >
            Audio
          </button>
          <button
            className={`p-2 rounded-md bg-red-300 ${
              media.audio && "bg-blue-500"
            }`}
          >
            Video
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            channel: { value: string };
            appId: { value: string };
            token: { value: string };
            uid: { value: string };
          };

          localStorage.setItem("ag-token", target.token.value);

          router.push(
            `/channel/${target.channel.value}?appId=${
              target.appId.value
            }&token=${String(target.token.value)}&uid=${target.uid.value}`
          );
        }}
      >
        <div className="space-y-4">
          <AppInput label="Meeting ID" name="channel" />
          <AppInput label="App ID" name="appId" />
          <AppInput label="Token" name="token" />
          <AppInput label="participant Id" name="uid" />
        </div>
        <div className="text-center">
          <button className="inline-flex items-center justify-center px-5 py-3 mt-5 text-base font-medium text-center text-white bg-blue-400 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
