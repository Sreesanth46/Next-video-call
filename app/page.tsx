"use client";
import { useRouter } from "next/navigation";
import AppInput from "./video/app-input";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 mt-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
        <span className="text-black">NextJS</span> x{" "}
        <span className="text-blue-500">Agora</span>
      </h1>
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
          <AppInput
            value="765b5fbbb5f4496cbdf8128646dd8fbd"
            label="App ID"
            name="appId"
          />
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
