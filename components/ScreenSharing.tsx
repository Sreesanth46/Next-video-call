import AgoraRTC, {
  LocalVideoTrack,
  useJoin,
  useLocalScreenTrack,
  usePublish,
  useTrackEvent,
} from "agora-rtc-react";
import React, { useEffect, useRef, useState } from "react";

interface IScreenSharingProps {
  AppID: string;
  channelName: string;
  token: string;
  uid: string;
  isScreenSharing: boolean;
}

const ScreenSharing: React.FC<IScreenSharingProps> = (props) => {
  const { AppID, channelName, token, uid, isScreenSharing = false } = props;
  const [screenSharing, setScreenSharing] = useState(isScreenSharing);
  const screenShareClient = useRef(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const { screenTrack, isLoading, error } = useLocalScreenTrack(
    true,
    {},
    "auto",
    screenShareClient.current
  );

  useJoin(
    {
      appid: AppID,
      channel: channelName,
      token,
      uid,
    },
    true,
    screenShareClient.current
  );
  // useTrackEvent(screenTrack, "track-ended", () => {
  //   setScreenSharing(false);
  // });
  useEffect(() => {
    if (error) setScreenSharing(false);
  }, [error, setScreenSharing]);

  usePublish(
    Array.isArray(screenTrack) ? screenTrack : [screenTrack],
    screenTrack !== null,
    screenShareClient.current
  );

  if (isLoading) {
    return <p>Sharing screen...</p>;
  }
  return (
    <LocalVideoTrack
      track={Array.isArray(screenTrack) ? screenTrack[0] : screenTrack}
      play={true}
    />
  );
};
export default ScreenSharing;
