import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Lock, ThumbsUp } from "lucide-react";

interface Profile {
  id: number;
  image: string;
  fallback: string;
}

interface ChallengeCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  profiles: Profile[];
  initialLikes?: number;
  coverImage?: string;
}

export default function ChallengeCard({
  title,
  description,
  startDate,
  endDate,
  profiles,
  initialLikes = 0,
  coverImage = "/images/sample-cover.jpg",
}: ChallengeCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLikes((prev) => prev + (isLiked ? -1 : 1));
    setIsLiked(!isLiked);
  };

  return (
    <Card className="w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
      {/* تصویر بالا */}
      <div className="relative h-52 sm:h-64">
        <img
          src={coverImage}
          alt="Challenge Cover"
          className="w-full h-full object-cover"
        />
        {/* فید سفید پایین تصویر */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/0 to-transparent"></div>

        {/* آواتارها روی عکس */}
        <div className="absolute bottom-3 left-4 flex -space-x-3">
          {profiles.slice(0, 3).map((profile) => (
            <Avatar
              key={profile.id}
              className="h-10 w-10 border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200"
            >
              <AvatarImage src={profile.image} />
              <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                {profile.fallback}
              </AvatarFallback>
            </Avatar>
          ))}
          {profiles.length > 3 && (
            <Avatar className="h-10 w-10 border-2 border-white bg-gray-100 text-gray-600 text-sm flex items-center justify-center cursor-default">
              +{profiles.length - 3}
            </Avatar>
          )}
        </div>

        {/* آیکون قفل بالا سمت راست */}
        <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-md rounded-full p-2">
          <Lock className="h-5 w-5 text-gray-800" />
        </div>
      </div>

      {/* محتوای پایین */}
      <CardHeader className="pt-3 px-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </CardHeader>

      <CardContent className="px-6 pb-5">
        <div className="flex items-center justify-between mt-4 text-gray-700 text-sm sm:text-base">
          {/* لایک */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-transform duration-300 hover:scale-105 ${
              isLiked ? "scale-110" : ""
            }`}
          >
            <ThumbsUp
              className={`h-5 w-5 transition-colors duration-300 ${
                isLiked ? "fill-blue-500 text-blue-500" : "text-gray-700"
              }`}
            />
            <span
              className={`font-semibold ${
                isLiked ? "text-blue-500" : "text-gray-800"
              }`}
            >
              {likes}
            </span>
          </button>

          {/* تاریخ‌ها */}
          <div className="flex flex-col items-end text-xs sm:text-sm">
            <div className="flex gap-2">
              <span className="text-gray-800 font-semibold">{startDate}</span>
              <span className="text-gray-500">شروع</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-800 font-semibold">{endDate}</span>
              <span className="text-gray-500">پایان</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
