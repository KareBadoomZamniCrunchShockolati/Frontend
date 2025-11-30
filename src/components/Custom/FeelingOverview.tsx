import sad from "../../assets/Img/Icon/emoji-sad.svg";
import happy from "../../assets/Img/Icon/emoji-happy.svg";
const FeelingOverview = () => {
  return (
    <div className="relative border border-black py-2 mt-10 bg-[rgba(56,114,221,0.06)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-[8px]">
      <img
        className="absolute"
        style={{ left: 5, bottom: "15%" }}
        src={sad}
        alt=""
      />
      <img
        className="absolute"
        style={{ right: 5, bottom: "15%" }}
        src={happy}
        alt=""
      />
      <div className="flex-1 relative h-6 mt-5 mx-10 ">
        {/* Background track */}
        <div className="absolute inset-0 bg-gray-200 rounded-full border-2 border-gray-300" />

        {/* Red fill (left from center) */}
        <div
          className=" absolute top-0 bottom-0 bg-gradient-to-r from-red-500 to-red-400 rounded-l-full border-2 border-red-600 transition-all duration-200"
          style={{
            left: `${50 - 20}%`,
            right: "50%",
          }}
        />

        {/* Green fill (right from center) */}
        <div
          className="absolute top-0 bottom-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-r-full border-2 border-teal-600 transition-all duration-200"
          style={{
            left: "50%",
            right: `${50 - 10}%`,
          }}
        />

        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 z-10" />
      </div>
    </div>
  );
};

export default FeelingOverview;
