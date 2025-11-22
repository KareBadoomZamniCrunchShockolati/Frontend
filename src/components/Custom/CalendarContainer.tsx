import CalendarDay from "./CalendarDay";
import arrowLeft from "@/assets/Img/Icon/ArrLeft.svg";
import arrowRight from "@/assets/Img/Icon/ArrRight.svg";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface CalendarContainerProps {
  arr2: number[]; // or DateObject[] if you have your own type
}

const CalendarContainer = ({ arr2 }: CalendarContainerProps) => {
  const DAYS_TO_SHOW = 7;
  console.log(arr2);

  function generateDays(startDay2: number): number[] {
    const res: number[] = [];
    for (let x = 0; x < arr2.length; x++) {
      if (arr2[x] === startDay2) {
        for (let y = 0; y < DAYS_TO_SHOW && x + y < arr2.length; y++) {
          res.push(arr2[x + y]);
        }
        return res;
      }
    }
    return [];
  }

  const [day, setDay] = useState<number | null>(null);
  const [startDay, setStartDay] = useState(1);
  const [currentDays, setCurrenctDays] = useState(() => generateDays(1));
  const [nextDays, setNextDays] = useState<number[]>([]);
  const [direction, setDirection] = useState<"" | "left" | "right">("");
  const [isAnimating, setIsAnimating] = useState(false);

  const goNext = () => {
    if (isAnimating) return;
    setDirection("left");
    setIsAnimating(true);

    const newStart = startDay + DAYS_TO_SHOW;
    const generateDays2 = generateDays(newStart);

    setNextDays(generateDays2);
    setDay(null);

    setTimeout(() => {
      setStartDay(newStart);
      setCurrenctDays(generateDays2);
      setDirection("");
      setIsAnimating(false);
    }, 300);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setDirection("right");
    setIsAnimating(true);

    const newStart = startDay - DAYS_TO_SHOW;
    const generateDays2 = generateDays(newStart);

    setNextDays(generateDays2);

    setTimeout(() => {
      setStartDay(newStart);
      setCurrenctDays(generateDays2);
      setDirection("");
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative flex items-center overflow-hidden justify-between bg-[#FFEBE3] mx-2 rounded-[8px] h-[90px] my-[100px] py-3 border-2 border-black">
      {/* Arrows */}
      <img
        onClick={goPrev}
        src={arrowLeft}
        className="relative z-20 cursor-pointer"
        alt="prev"
      />

      {/* Current panel */}
      <div
        className={cn(
          "absolute left-0 top-0 w-full h-full flex items-center justify-start pointer-events-none",
          direction === "left"
            ? "carousel-exit-left"
            : direction === "right"
              ? "carousel-exit-right"
              : ""
        )}
      >
        <div className="w-full  flex items-center justify-between pointer-events-auto px-6">
          {currentDays.map((x) => (
            <CalendarDay
              key={x}
              num={x}
              cDay={day}
              setDay={setDay}
              highlight={x === day}
            />
          ))}
        </div>
      </div>

      {/* Entering panel */}
      {direction && (
        <div
          className={cn(
            "absolute left-0 top-0 w-full h-full flex items-center justify-start pointer-events-none",
            direction === "left"
              ? "carousel-enter-right"
              : "carousel-enter-left"
          )}
        >
          <div className="w-full flex items-center justify-between pointer-events-auto px-6">
            {nextDays.map((x) => (
              <CalendarDay
                key={x}
                num={x}
                cDay={day}
                setDay={setDay}
                highlight={x === day}
              />
            ))}
          </div>
        </div>
      )}

      <img
        onClick={goNext}
        src={arrowRight}
        className="relative z-20 cursor-pointer"
        alt="next"
      />
    </div>
  );
};

export default CalendarContainer;
