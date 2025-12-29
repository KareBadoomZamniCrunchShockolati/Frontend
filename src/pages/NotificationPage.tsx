import ChallengeCard from "@/components/Custom/ChallangeCard";
import CustomBtn from "@/components/Custom/CustomBtn";
import CustomButton from "@/components/Custom/CustomButton";
import TopBackText from "@/components/Custom/TopBackText";
import TopProfile from "@/components/topProfile";
import { divIcon } from "leaflet";
import profileImg from "@/assets/Img/Icon/User.svg";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
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
  },
];

const NotificationPage = () => {
  return (
    <div className="p-4">
      <TopBackText text="اعلانات" />
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
    </div>
  );
};
export default NotificationPage;

const NotificationCard = ({
  type,
  username,
  challengeName,
}: {
  type: string;
  username: string;
  challengeName?: string;
}) => {
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
          <div className="flex flex-row-reverse w-6/7">
            <img className="rounded-full" src={profileImg} alt="" />
            <p className="w-4/5 text-right">{username} شما را دنبال می‌کند</p>
          </div>
        </div>
      )}
    </>
  );
};
