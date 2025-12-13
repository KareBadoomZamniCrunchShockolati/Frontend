import { useState } from "react";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import tick from "@/assets/Img/Icon/tick-square.svg";
import cross from "@/assets/Img/Icon/Close Square.svg";
import thumb from "@/assets/Img/Group 101.png";
import TopBackText from "./TopBackText";
const AcceptList = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
  const searchedUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className=" p-4 bg-light-orange">
      <TopBackText text="درخواست‌ های پیوستن" />
      <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
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
          {searchedUsers.map((user) => (
            <div className="flex justify-between border bg-white border-black rounded-xl p-4 mt-4 items-center">
              <div className="flex gap-4 items-center">
                <img
                  className="w-16 h-16 rounded-full border-1 border-black"
                  src={""}
                  alt="profile"
                />
                <p className="font-semibold text-xl">{user.username}</p>
              </div>
              <div className="flex gap-2">
                <button>
                  <img src={cross} alt="" />
                </button>
                <button>
                  <img src={tick} alt="" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcceptList;
