import CustomButton from "@/components/Custom/CustomButton";
import TopBackText from "@/components/Custom/TopBackText";
import profileImg from "@/assets/Img/Icon/User.svg";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import happy from "@/assets/Img/Icon/emoji-happy.svg";
import { Navigate, useNavigate } from "react-router-dom";
import bell from "@/assets/Img/Icon/bell.svg";
import { useEffect, useState } from "react";
import "@/data/mockSocket"; // ← just importing starts the server
import { divIcon } from "leaflet";

const newData = [
  {
    type: "inviteChallenge",
    username: "sina",
    challengeName: "first challenge",
  },
  {
    type: "inviteChallenge",
    username: "saman",
    challengeName: "second challenge",
  },
  {
    type: "inviteChallenge",
    username: "mahdi",
    challengeName: "third challenge",
  },
  {
    type: "followed",
    username: "mina",
    userId: "1",
  },
];
const oldData = [
  {
    type: "inviteChallenge",
    username: "sina",
    challengeName: "first challenge",
  },
  {
    type: "inviteChallenge",
    username: "saman",
    challengeName: "second challenge",
  },
  {
    type: "progress",
  },
];

const NotificationPage = () => {
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    const socket = new window.WebSocket("ws://localhost:8080");
    let new_data;
    socket.onmessage = (event) => {
      console.log("RECEIVED:", JSON.parse(event.data));
      new_data = JSON.parse(event.data);
      console.log(new_data.message);
      setData((prev) => [...prev, new_data.message + new_data.c]);
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-4">
      <TopBackText text="اعلانات" icon={bell} />
      <div className="flex flex-col p-4  gap-4 bg-primary border-3 border-black rounded-2xl">
        <p className="text-right font-extrabold text-2xl text-white">جدید</p>
        {newData.map((x) => {
          return x.type == "followed" ? (
            <NotificationCard type={x.type} username={x.username} />
          ) : (
            <NotificationCard
              type={x.type}
              username={x.username}
              challengeName={x.challengeName}
            />
          );
        })}
      </div>
      <div className="flex flex-col p-4 mt-6 gap-4 bg-secondary border-3 border-black rounded-2xl">
        <div className="flex flex-row-reverse gap-2 font-extrabold text-2xl text-white text-end">
          <p className=" ">{convertToPersianDigits("30")}</p>
          <p>روز گذشته</p>
        </div>
        {newData.map((x) => {
          return x.type == "followed" ? (
            <NotificationCard
              type={x.type}
              username={x.username}
              userId={x.userId}
            />
          ) : (
            <NotificationCard
              type={x.type}
              username={x.username}
              challengeName={x.challengeName}
            />
          );
        })}
        <ProgressCard message=" تونستی 5 روز پشت سر هم به چالش کوه‌نوردی روی دریا پایبند بمونی این خیلی عالیه" />
      </div>
      {data && data.map((x) => <div>{x}</div>)}
    </div>
  );
};
export default NotificationPage;

const NotificationCard = ({
  type,
  username,
  challengeName,
  userId,
}: {
  type: string;
  username: string;
  challengeName?: string;
  userId?: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      {type == "inviteChallenge" ? (
        <div className="flex gap-4 rounded-2xl bg-white justify-between p-4 border-2 border-black">
          <CustomButton className="bg-primary ">مشاهده</CustomButton>
          <div className="text-right w-6/7">{`دعوت کرد شما را به ${challengeName} ${username}`}</div>
        </div>
      ) : (
        <div className="flex gap-4 rounded-2xl bg-white justify-between p-4 border-2 border-black">
          <CustomButton className="bg-primary  ">دنبال کردن</CustomButton>
          <div className="flex gap-4 flex-row-reverse w-6/7">
            <img
              onClick={() => navigate(`/dashboard/${userId}`)}
              className="rounded-full"
              src={profileImg}
              alt=""
            />
            <p className="w-4/5 text-right">{username} شما را دنبال می‌کند</p>
          </div>
        </div>
      )}
    </>
  );
};
const ProgressCard = ({ message }: { message: string }) => {
  return (
    <div className="flex gap-4 rounded-2xl bg-white justify-between p-4 border-2 border-black">
      <p className="text-end">{`${message}`}</p>
      <img src={happy} alt="" />
    </div>
  );
};
