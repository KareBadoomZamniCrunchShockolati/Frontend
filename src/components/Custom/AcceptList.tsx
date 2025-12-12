import { useState } from "react";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import tick from "@/assets/Img/Icon/tick-square.svg";
import cross from "@/assets/Img/Icon/Close Square.svg";
import thumb from "@/assets/Img/Group 101.png";
const AcceptList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="p-4">
      <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <div
        className="scrollbar-svg"
        style={{
          height: "400px",
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div className="flex justify-between border border-black rounded-xl p-4 mt-4 items-center">
              <div className="flex gap-4 items-center">
                <img
                  className="w-16 h-16 rounded-full border-1 border-black"
                  src={""}
                  alt="profile"
                />
                <p className="font-semibold text-xl">sina</p>
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
