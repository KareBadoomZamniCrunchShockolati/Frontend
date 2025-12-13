import { useState } from "react";
import thumb from "@/assets/Img/Group 101.png";
import TopBackText from "./TopBackText";
import checked from "@/assets/Img/Icon/checked.svg";
// import UserIconGray from "@/assets/Img/UserUnknownGray.png";
// import UserIconOrange from "@/assets/Img/UserUnknownOrange.png";
// import UserIconBlue from "@/assets/Img/UserUnknownBlue.png";
import userI from "@/assets/Img/Icon/User.svg";
import { cn } from "@/lib/utils";
const InviteList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<
    { id: number; username: string }[]
  >([]);
  type UserColor = "gray" | "orange" | "blue";
  type User = { id: number; username: string };
  const users: User[] = [
    { id: 1, username: "sina" },
    { id: 2, username: "ali" },
    { id: 3, username: "reza" },
    { id: 4, username: "mohammad" },
    { id: 5, username: "hossein" },
    { id: 6, username: "vahid" },
    { id: 7, username: "nima" },
    { id: 8, username: "amir" },
    { id: 9, username: "hamed" },
  ];
  const Chip = ({
    id,
    username,
    color,
  }: {
    id: number;
    username: string;
    color: UserColor;
  }) => (
    <div
      onClick={() => {
        setSelectedUsers(
          selectedUsers.filter((user) => {
            return user.id != id;
          })
        );
      }}
      className={cn(
        "flex items-end gap-1 rounded-full pr-2",
        color === "gray"
          ? "bg-gray-300"
          : color === "orange"
            ? "bg-orange-300"
            : "bg-blue-300"
      )}
    >
      <div className="rounded-full w-[25px] h-[25px]">
        <img src={userI} alt="" />
      </div>
      <div>{username}</div>
    </div>
  );

  return (
    <div className=" p-4 bg-light-orange">
      <TopBackText text="دعوت افراد جدید" />
      {/* <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
       */}
      <div className="mb-6 p-4 border-2 border-blue-400 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user, index) => (
            <Chip
              id={user.id}
              username={user.username}
              color={
                index % 3 === 0 ? "gray" : index % 3 === 1 ? "orange" : "blue"
              }
            />
          ))}
        </div>
      </div>
      <div
        className="h-full scrollbar-svg"
        style={{
          backgroundColor: "#FFF8F5",
          height: "calc(100vh )",
          overflowY: "scroll",
          paddingRight: "8px",
          "--thumb-image": `url('${thumb}')`,
        }}
      >
        <style>{`
              .scrollbar-svg::-webkit-scrollbar {
                width: 16px;
              }
              
              .scrollbar-svg::-webkit-scrollbar-track {
                background: #E5E7EB;
                border-radius: 100px;
              }
              
              .scrollbar-svg::-webkit-scrollbar-thumb {
                background: #7CB5E8 url('${thumb}') center/50%  no-repeat;
                border-radius: 100px;
                border: 3px solid white;
              }
              
              .scrollbar-svg::-webkit-scrollbar-thumb:hover {
                background-color: #6BA5D8;
              }
              
              .scrollbar-svg::-webkit-scrollbar-button {
                display: none;
              }
            `}</style>
        <div className="flex flex-col w-full">
          {users.map((user) => (
            <div
              onClick={() => {
                if (selectedUsers.find((u) => u.id === user.id))
                  setSelectedUsers(
                    selectedUsers.filter((u) => u.id !== user.id)
                  );
                else setSelectedUsers([...selectedUsers, user]);
              }}
              className="flex justify-between border bg-white border-black rounded-xl p-4 mt-4 items-center"
            >
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <img
                    className="w-16 h-16 rounded-full border-1 border-black"
                    src={""}
                    alt="profile"
                  />
                  <img
                    className={cn(
                      "absolute right-0 bottom-0",
                      selectedUsers.find((u) => u.id === user.id)
                        ? "block"
                        : "hidden"
                    )}
                    src={checked}
                    alt=""
                  />
                </div>
                <p className="font-semibold text-xl">{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InviteList;
