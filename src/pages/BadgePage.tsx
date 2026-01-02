import { useEffect, useState } from "react";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import TopBackText from "@/components/Custom/TopBackText";
import AddBadgeImg from "@/assets/Img/Icon/badgePlus.svg";
import bdg1 from "@/assets/Img/Icon/bdg1.svg";
import bdg2 from "@/assets/Img/Icon/bdg2.svg";
import bdg3 from "@/assets/Img/Icon/bdg3.svg";
import { cn } from "@/lib/utils";

type bdg = {
  ImgSrc: string;
  title: string;
  description: string;
  done: number;
  goal: number;
};

const BadgePage = () => {
  const [selectedBadge, setSelectedBadge] = useState<bdg | null>(null);
  const [add, setAdd] = useState<number | null>(null);
  const [images, setImages] = useState<(number | null)[]>([null, null, null]);
  const [isOpen, setIsOpen] = useState(false);

  const data: bdg[] = [
    {
      ImgSrc: bdg1,
      title: "مالی",
      description: "۵۰ چالش در دسته‌بندی مالی رو به پایان رسوندی!",
      done: 20,
      goal: 30,
    },
    {
      ImgSrc: bdg2,
      title: "تناسب اندام",
      description: "۲۵ چالش در دسته‌بندی تناسب اندام رو به پایان رسوندی!",
      done: 15,
      goal: 40,
    },
    {
      ImgSrc: bdg3,
      title: "سلامت",
      description: "۱۰ چالش در دسته‌بندی سلامت رو به پایان رسوندی!",
      done: 5,
      goal: 20,
    },
    {
      ImgSrc: bdg1,
      title: "مالی",
      description: "۵۰ چالش در دسته‌بندی مالی رو به پایان رسوندی!",
      done: 20,
      goal: 30,
    },
    {
      ImgSrc: bdg2,
      title: "تناسب اندام",
      description: "۲۵ چالش در دسته‌بندی تناسب اندام رو به پایان رسوندی!",
      done: 15,
      goal: 40,
    },
    {
      ImgSrc: bdg3,
      title: "سلامت",
      description: "۱۰ چالش در دسته‌بندی سلامت رو به پایان رسوندی!",
      done: 5,
      goal: 20,
    },
    {
      ImgSrc: bdg1,
      title: "مالی",
      description: "۵۰ چالش در دسته‌بندی مالی رو به پایان رسوندی!",
      done: 20,
      goal: 30,
    },
    {
      ImgSrc: bdg2,
      title: "تناسب اندام",
      description: "۲۵ چالش در دسته‌بندی تناسب اندام رو به پایان رسوندی!",
      done: 15,
      goal: 40,
    },
    {
      ImgSrc: bdg3,
      title: "سلامت",
      description: "۱۰ چالش در دسته‌بندی سلامت رو به پایان رسوندی!",
      done: 5,
      goal: 20,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-2">
      <TopBackText text="نشان ها" />
      <div className="rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-foreground bg-secondary flex flex-col items-center text-xl font-extrabold text-white">
        <div className="flex gap-5 justify-center items-center relative w-full max-w-xl mb-4 pb-20 pt-15">
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
            />
          </div>
          <div className="w-1/4 translate-y-[-30px]" onClick={() => setAdd(3)}>
            <img
              src={images[2] !== null ? data[images[2]]?.ImgSrc : AddBadgeImg}
              className="w-full"
              alt=""
            />
          </div>
        </div>
        <p className="mb-4 text-right px-4">
          نشان‌های انتخابی برای نمایش در صفحه پروفایل
        </p>
      </div>
      <div className="flex justify-between flex-wrap gap-2 mt-10">
        {data.map((data, index) => (
          <div
            className="w-[31%] relative px-4 py-2 border-3 border-primary rounded-[8px] shadow-[2px_2px_0px_0px_rgba(255,119,0,1)] bg-card"
            key={index}
            onClick={() => {
              if (add !== null) {
                let used = false;
                for (let i of images) {
                  if (index == i) used = true;
                }

                if (add == 1 && !used) {
                  let imagesCopy = [...images];

                  imagesCopy[0] = index;
                  setImages(imagesCopy);
                  setAdd(null);
                }
                if (add == 2 && !used) {
                  let imagesCopy = [...images];
                  imagesCopy[1] = index;
                  setImages(imagesCopy);
                  setAdd(null);
                }
                if (add == 3 && !used) {
                  let imagesCopy = [...images];
                  imagesCopy[2] = index;
                  setImages(imagesCopy);
                  setAdd(null);
                }
              } else {
                setSelectedBadge(data);
                setIsOpen(true);
              }
            }}
          >
            {add && (
              <div
                className={cn(
                  "w-4 h-4 border-2 border-foreground absolute right-2 rounded-[4px]",
                  images.includes(index) && "bg-foreground"
                )}
              ></div>
            )}
            <img className="w-full" src={data.ImgSrc} alt="" />
            <p className="text-center mt-4 text-foreground">{data.title}</p>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {isOpen && selectedBadge && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 transition-opacity"
          />

          <div
            className="border-2 border-foreground fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl z-50 animate-slide-up px-8 h-[70vh]"
            style={{
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div className="h-2/3 flex flex-col gap-3 py-8 justify-center items-center border-3 border-primary rounded-lg mt-8">
              <img
                src={selectedBadge.ImgSrc}
                alt="selected image"
                className="max-h-full object-contain"
              />
              <p className="font-bold text-2xl text-foreground">{selectedBadge.title}</p>
              <p className="text-center text-foreground">{selectedBadge.description}</p>
            </div>
            <div className="flex flex-col gap-2 justify-evenly mt-5 rounded-lg h-1/5 border-3 border-secondary pt-4">
              <CustomSlider value={selectedBadge.done / selectedBadge.goal} />

              <Fraction up={selectedBadge.done} down={selectedBadge.goal} />
            </div>
          </div>
          <style>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

function CustomSlider({ value }: { value?: number }) {
  value = value ? value * 100 : 0;
  return (
    <div className="w-full max-w-md bg-card rounded-lg">
      <div className="relative w-4/5 h-5 rounded-lg overflow-hidden m-auto border-2 border-foreground">
        <div
          className="h-full rounded-lg bg-muted-foreground"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

interface DatFractionProps {
  up: number;
  down: number;
}
const Fraction = ({ up, down }: DatFractionProps) => {
  return (
    <div className="flex justify-center px-2 py-0.5">
      <div className="mr-2 text-2xl text-foreground">{convertToPersianDigits(String(up))}</div>
      <div className="mt-2 mr-2 text-foreground">
        {"/  " + convertToPersianDigits(String(down))}
      </div>
    </div>
  );
};

export default BadgePage;