// components/ChallengeManagement/create/CreationStepOne.tsx
import React from "react";
import { Upload } from "lucide-react";
import TitleAndDescription from "@/components/ChallengeManagement/create/TitleAndDescription";

interface Step1BasicInfoProps {
  title: string;
  description: string;
  image: string | null;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onImageChange: (img: string | null) => void;
  errors?: {
    title?: string;
    description?: string;
  };
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  title,
  description,
  image,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  errors, // این مهمه!
}) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onImageChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-xl relative space-y-8">
      {/* پاس دادن خطاها به TitleAndDescription */}
      <TitleAndDescription
        title={title}
        onTitleChange={onTitleChange}
        description={description}
        onDescriptionChange={onDescriptionChange}
        errors={errors}
      />

      {/* آپلود تصویر */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 text-right mb-3">
          تصویر چالش (اختیاری)
        </label>
        <div
          className="flex justify-center items-center bg-[#FFF1E5] p-10 cursor-pointer rounded-[8px] border-2 border-black border-dotted transition-all hover:bg-orange-50"
          onClick={() => document.getElementById("imgUpload")?.click()}
        >
          <input id="imgUpload" type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {!image ? (
            <div className="flex flex-col items-center">
              <Upload className="text-primary text-4xl mb-4" />
              <span className="text-primary text-xl font-medium">اضافه کردن عکس</span>
              <p className="text-sm text-gray-500 mt-2">می‌تونی بعداً هم اضافه کنی</p>
            </div>
          ) : (
            <img src={image} alt="پیش‌نمایش" className="max-h-64 rounded-lg shadow-lg" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;