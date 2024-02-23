"use client";

import Call from "@/components/Call";
import { useSearchParams } from "next/navigation";

export default function Page({
  params,
}: Readonly<{ params: { channelName: string } }>) {
  const searchParams = useSearchParams();

  const appId = searchParams.get("appId");
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  console.log({ token, uid, appId });
  return (
    <main className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {params.channelName}
      </p>
      <Call
        appId={appId!}
        channelName={params.channelName}
        token={token!}
        uid={uid!}
      ></Call>
    </main>
  );
}
