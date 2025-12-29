import type { ChallengeDataDetails } from "@/types/challengeElementsTypes";
import { DEFAULT_CHALLENGE_IMG } from "@/data/mockImages";


export const defaultChallengeData: ChallengeDataDetails = {
  commentsEnabled: false,
  categories: [],
  type: 'عمومی',
  memberCount: '0',
  title: 'عنوان چالش',
  description:
    'این چالش برای آزمایش استقامت و مهارت‌های حل مسئله شما طراحی شده است. سفر شامل پیمودن زمین‌های سخت و غلبه بر موانع مختلف است. آیا آماده‌اید تا این ماجراجویی را شروع کنید و مرزهای خود را بسنجید؟',
  dateRange: 'از 28 اردیبهشت تا 8 شهریور - سه روز در هفته',
  location: 'قله کوه اورست',
  Img: DEFAULT_CHALLENGE_IMG,
  participants: [],
  like_count: 0,
  start_time: '28 اردیبهشت',
  end_time: '8 شهریور',
  visibility: 'public',
};


export const mockChallenges = [
    {
      id: "1",
      title: "Mountain Climb Challenge",
      description: "Climb a mountain in under 12 hours.",
      imageUrl:
        "https://www.muchbetteradventures.com/magazine/content/images/size/w2000/2024/04/mount-everest-at-sunset.jpg",
    },
    {
      id: "2",
      title: "Desert Trek Challenge",
      description: "Complete a 30km desert trek in a single day.",
      imageUrl:
        "https://www.travelandleisure.com/thmb/Desert-Dunes_Fancyview_gettyimages-1216349476-f180b973c62f4b74b10b87bb736d9e9d.jpg",
    },
    {
      id: "3",
      title: "Ocean Swim Challenge",
      description: "Swim across an open water stretch of 2km.",
      imageUrl:
        "https://www.adventure-life.com/sites/default/files/styles/hero_mobile/public/hero_images/hero-the-coastline-of-new-zealand.jpg?itok=V6n33P__",
    },
  ];