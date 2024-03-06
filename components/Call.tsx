"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState } from "react";
import ScreenSharing from "./ScreenSharing";

function Call(
  props: Readonly<{
    appId: string;
    channelName: string;
    uid: string;
    token: string;
  }>
) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const [isScreenShared, setIsScreenShared] = useState(false);
  const [isAbsolute, setIsAbsolute] = useState(false);

  return (
    <AgoraRTCProvider client={client}>
      <Videos
        channelName={props.channelName}
        AppID={props.appId}
        uid={props.uid}
        token={props.token}
        isScreenShared={isScreenShared}
        isAbsolute={isAbsolute}
      />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4 space-x-2">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
        <button
          type="button"
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          onClick={() => {
            setIsScreenShared((prev) => !prev);
          }}
        >
          Toggle screen
        </button>
        <button
          type="button"
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          onClick={() => {
            setIsAbsolute((prev) => !prev);
          }}
        >
          {isAbsolute ? "Relative" : "Absolute"}
        </button>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos(
  props: Readonly<{
    channelName: string;
    AppID: string;
    uid: string;
    token: string;
    isScreenShared: boolean;
    isAbsolute: boolean;
  }>
) {
  const { AppID, channelName, uid, isScreenShared, isAbsolute } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const token = localStorage.getItem("ag-token");
  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
    uid: null,
  });

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );
  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className={`grid  gap-1 flex-1`}
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
          style={{
            position: isAbsolute ? "absolute" : "relative",
          }}
        />

        {remoteUsers.map((user) => (
          <RemoteUser user={user} key={user.uid} />
        ))}
        {isScreenShared && (
          <ScreenSharing
            isScreenSharing={isScreenShared}
            AppID={AppID}
            channelName={channelName}
            token=""
            uid="323758496"
          />
        )}
      </div>
    </div>
  );
}

export default Call;
