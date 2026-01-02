import CustomButton from "@/components/Custom/CustomButton";
import TopBackText from "@/components/Custom/TopBackText";
import profileImg from "@/assets/Img/Icon/User.svg";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import happy from "@/assets/Img/Icon/emoji-happy.svg";
import bell from "@/assets/Img/Icon/bell.svg";
import { useEffect, useState } from "react";
import "@/data/mockSocket";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-4">
      <TopBackText text="اعلانات" icon={bell} />

      <div className="flex flex-col p-4 gap-4 bg-primary border-3 border-foreground rounded-2xl">
        <p className="text-right font-extrabold text-2xl text-white">جدید</p>
        {newData.map((x, index) => (
          <NotificationCard
            key={index}
            type={x.type}
            username={x.username}
            challengeName={x.challengeName}
            userId={x.userId}
          />
        ))}
      </div>

      <div className="flex flex-col p-4 mt-6 gap-4 bg-secondary border-3 border-foreground rounded-2xl">
        <div className="flex flex-row-reverse gap-2 font-extrabold text-2xl text-white text-end">
          <p>{convertToPersianDigits("30")}</p>
          <p>روز گذشته</p>
        </div>
        {oldData.map((x, index) => (
          <NotificationCard
            key={index}
            type={x.type}
            username={x.username}
            challengeName={x.challengeName}
            userId={x.userId}
          />
        ))}
        <ProgressCard message=" تونستی 5 روز پشت سر هم به چالش کوه‌نوردی روی دریا پایبند بمونی این خیلی عالیه" />
      </div>

      {data && data.map((x, i) => <div key={i} className="mt-4 text-foreground">{x}</div>)}
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
      {type === "inviteChallenge" ? (
        <div className="flex gap-4 rounded-2xl bg-card justify-between p-4 border-2 border-foreground">
          <CustomButton className="bg-primary text-primary-foreground">مشاهده</CustomButton>
          <div className="text-right text-foreground flex-1">
            {username} شما را به چالش {challengeName} دعوت کرد
          </div>
        </div>
      ) : (
        <div className="flex gap-4 rounded-2xl bg-card justify-between p-4 border-2 border-foreground">
          <CustomButton className="bg-primary text-primary-foreground">دنبال کردن</CustomButton>
          <div className="flex gap-4 flex-row-reverse flex-1 items-center">
            <img
              onClick={() => userId && navigate(`/dashboard/${userId}`)}
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              src={profileImg}
              alt={username}
            />
            <p className="text-right text-foreground">{username} شما را دنبال می‌کند</p>
          </div>
        </div>
      )}
    </>
  );
};

const ProgressCard = ({ message }: { message: string }) => {
  return (
    <div className="flex gap-4 rounded-2xl bg-card justify-between p-4 border-2 border-foreground items-center">
      <p className="text-end text-foreground flex-1">{message}</p>
      <img src={happy} alt="خوشحال" className="w-12 h-12" />
    </div>
  );
};