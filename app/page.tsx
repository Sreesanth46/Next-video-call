import React from "react";
import dynamic from "next/dynamic";

export default function Page() {
  const WaitingRoom = dynamic(() => import("@/components/WaitingRoom"), {
    ssr: false,
  });
  return <WaitingRoom />;
}
