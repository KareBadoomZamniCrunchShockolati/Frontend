import BackButtonAndMenu from "@/components/ChallengeManagement/info/BackButtonAndMenu";
import AddBadgeImg from "@/assets/Img/Icon/badgePlus.svg";
import bdg1 from "@/assets/Img/Icon/bdg1.svg";
import bdg2 from "@/assets/Img/Icon/bdg2.svg";
import bdg3 from "@/assets/Img/Icon/bdg3.svg";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

const BadgePage = () => {
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);
  const [add, setAdd] = useState<number | null>(null);
  const [images, setImages] = useState<(number | null)[]>([null, null, null]);

  const data = [
    {
      ImgSrc: bdg1,
      title: "مالی",
      description: "۵۰ چالش در دسته‌بندی مالی رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg2,
      title: "تناسب اندام",
      description: "۲۵ چالش در دسته‌بندی تناسب اندام رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg3,
      title: "سلامت",
      description: "۱۰ چالش در دسته‌بندی سلامت رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg1,
      title: "مالی",
      description: "۵۰ چالش در دسته‌بندی مالی رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg2,
      title: "تناسب اندام",
      description: "۲۵ چالش در دسته‌بندی تناسب اندام رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg3,
      title: "سلامت",
      description: "۱۰ چالش در دسته‌بندی سلامت رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg1,
      title: "مالی",
      description: "۵۰ چالش در دسته‌بندی مالی رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg2,
      title: "تناسب اندام",
      description: "۲۵ چالش در دسته‌بندی تناسب اندام رو به پایان رسوندی!",
    },
    {
      ImgSrc: bdg3,
      title: "سلامت",
      description: "۱۰ چالش در دسته‌بندی سلامت رو به پایان رسوندی!",
    },
  ];

  return (
    <div className="p-2">
      <BackButtonAndMenu
        onMenuClick={() => {
          console.log("fuck");
        }}
      />
      <div className=" rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-secondary flex flex-col items-center text-xl font-extrabold text-white">
        <div className="flex gap-5 justify-center items-center relative w-full max-w-xl mb-4  pb-20 pt-15">
          <div className="w-1/4 translate-y-[-30px]" onClick={() => setAdd(1)}>
            <img
              src={images[0] !== null ? data[images[0]]?.ImgSrc : AddBadgeImg}
              className="w-full"
              alt=""
            />
          </div>
          <div className="w-1/4 translate-y-15" onClick={() => setAdd(2)}>
            <img
              src={images[1] !== null ? data[images[1]]?.ImgSrc : AddBadgeImg}
              className="w-full"
              alt=""
            />{" "}
          </div>
          <div className="w-1/4 translate-y-[-30px]" onClick={() => setAdd(3)}>
            <img
              src={images[2] !== null ? data[images[2]]?.ImgSrc : AddBadgeImg}
              className="w-full"
              alt=""
            />{" "}
          </div>
        </div>
        <p className="mb-4 text-right">
          نشان‌های انتخابی برای نمایش در صفحه پروفایل
        </p>
      </div>
      <div className="flex justify-between flex-wrap gap-2 mt-10">
        {data.map((data, index) => (
          <div
            className="w-[31%]  px-4 py-2 border-3 border-primary rounded-[8px] shadow-[2px_2px_0px_0px_rgba(255,119,0,1)]"
            key={index}
            onClick={() => {
              if (add !== null) {
                if (add == 1) {
                  let imagesCopy = [...images];
                  imagesCopy[0] = index;
                  setImages(imagesCopy);
                  setAdd(null);
                }
                if (add == 2) {
                  let imagesCopy = [...images];
                  imagesCopy[1] = index;
                  setImages(imagesCopy);
                  setAdd(null);
                }
                if (add == 3) {
                  let imagesCopy = [...images];
                  imagesCopy[2] = index;
                  setImages(imagesCopy);
                  setAdd(null);
                }
              }
            }}
          >
            <img className="w-full" src={data.ImgSrc} alt="" />
            <p className="text-center mt-4">{data.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BadgePage;
