// src/components/SkeletonChallengeCard.tsx
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lock, LockOpen, Bookmark } from "lucide-react";

export default function SkeletonChallengeCard() {
  return (
    <Card
      className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-shadow-strong border-2 border-black bg-white animate-pulse"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row">
        {/* تصویر کاور - skeleton */}
        <div className="w-full md:w-2/5 relative flex-shrink-0 h-40 md:h-auto bg-neutral-gray">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-gray to-neutral-gray-bold" />

          {/* skeleton آواتارهای شرکت‌کنندگان */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <Avatar
                  key={i}
                  className="h-8 w-8 border-2 border-white bg-gray-300"
                >
                  <AvatarFallback className="bg-gray-300" />
                </Avatar>
              ))}
              <div className="h-8 w-8 border-2 border-white bg-gray-300 rounded-full" />
            </div>
            <div className="h-6 w-16 bg-gray-300 rounded-full" />
          </div>

          {/* وضعیت عضویت */}
          <div className="absolute bottom-4 right-4">
            <div className="h-8 w-32 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* محتوا - skeleton */}
        <div
          className="md:w-3/5 flex flex-col justify-between p-4 md:p-5 w-full"
          dir="rtl"
        >
          {/* هدر */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-primary/20 bg-gray-300">
                  <AvatarFallback className="bg-gray-300" />
                </Avatar>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                  <div className="h-3 w-20 bg-gray-300 rounded" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-300 rounded" />
                <div className="h-10 w-10 bg-gray-300 rounded-full" />
              </div>
            </div>

            {/* عنوان و توضیحات */}
            <div className="mb-4 space-y-3"
            dir="rtl">
              <div className="h-6 w-4/5 bg-gray-300 rounded" />
              <div className="h-5 w-full bg-gray-300 rounded" />
              <div className="h-5 w-3/4 bg-gray-300 rounded" />
            </div>

            {/* اطلاعات تاریخ و کامنت */}
            <div className="flex flex-wrap gap-6 text-sm mb-4 pb-4 border-b border-gray-200"
            dir="rtl">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-300 rounded" />
                <div className="h-5 w-24 bg-gray-300 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-300 rounded" />
                <div className="h-5 w-24 bg-gray-300 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-300 rounded" />
                <div className="h-5 w-20 bg-gray-300 rounded flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-full" />
                  <div className="h-4 w-8 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* دکمه‌های پایین (کامنت شده در اصلی) - می‌تونی حذف کنی */}
          {/* <div className="flex items-center gap-3">
            <div className="h-10 w-20 bg-gray-300 rounded-lg" />
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
          </div> */}
        </div>
      </div>
    </Card>
  );
}
