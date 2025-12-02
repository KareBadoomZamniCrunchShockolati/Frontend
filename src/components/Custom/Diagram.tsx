import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Diagram({ freq }: { freq: number }) {
  const data = [
    { date: "۱۶/۰۹", value: 100 },
    { date: "۱۶/۰۹", value: 75 },
    { date: "۱۶/۰۹", value: 55 },
    { date: "۱۶/۰۹", value: 30 },
    { date: "۱۶/۰۹", value: 45 },
    { date: "۱۶/۰۹", value: 85 },
    { date: "۱۶/۰۹", value: 25 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));
  const averageLine = 65; // Positioning the average line
  console.log(freq);

  return (
    <Card className="border border-black py-2 mt-10 bg-light-blue-challengestats shadow-card rounded-md">
      <CardContent>
        <p className="text-2xl font-medium text-right mb-5">
          روز های مختلف چالش
        </p>

        <div className=" relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-5 flex flex-col justify-between text-sm text-gray-600 pr-2">
            <span>۱۰۰٪</span>
            <span>۷۵٪</span>
            <span>۵۰٪</span>
            <span>۲۵٪</span>
            <span>۰٪</span>
          </div>
          {/* Chart area */}
          <div className="ml-12 relative">
            {/* Average line with label */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-orange-400 z-10"
              style={{ top: `${100 - averageLine}%` }}
            >
              <div className="absolute -top-4 right-8 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                میانگین
              </div>
            </div>

            {/* Bars container */}
            <div className="flex items-end justify-around h-[200px] pt-8">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 mx-1"
                >
                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-sm border-2 border-blue-600 transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${Math.floor((item.value * 165) / freq)}px`,
                      maxWidth: "80px",
                    }}
                  />
                  {/* Date label */}
                  <span className="mt-2 text-sm text-gray-700">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
