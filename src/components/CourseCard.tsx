import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./CourseProgress";

interface CardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string | null;
  totalVideoLength: number;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  totalVideoLength,
}: CardProps) => {
  return (
    <Link href={`/courses/${id}/preview`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="bg-[#E0F2FE] rounded-[16px] text-[#0369A1] p-1 gap-2 flex items-center justify-start w-fit px-[10px] pl-1 font-medium text-xs leading-[18px] my-2">
            <span className="bg-white rounded-[16px] px-2 py-[2px]">
              {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
            </span>
            <span>{totalVideoLength} Total Hours</span>
          </div>
          <div className="text-lg md:text-base font-medium group-hover:text-sky-600 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground ">{category}</p>
          
          <div className="mt-[9px]">
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-base md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
