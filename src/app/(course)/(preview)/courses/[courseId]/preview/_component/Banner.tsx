import React from 'react'
import PreviewButton from './PreviewButton';
import EnrollButton from './EnrollButton';
import { Separator } from '@/components/ui/separator';

interface BannerProps{
  courseId: string;
  price: number;
  purchased: boolean;
}

const Banner = ({
  courseId,
  price,
  purchased
}: BannerProps) => {
  console.log(courseId, price, purchased)
  return (
    <div className='w-full banner py-8 px-12 mt-8 rounded-[12px] flex items-center justify-start gap-[100px]'>
      <div className="flex flex-col gap-4 items-start justify-center ">
        <div className="text-3xl font-semibold text-white">Ready to start building?</div>
        <div className="font-normal text-base text-[#D2D2D2]">Track your progress, watch with subtitles, change quality & speed, and more.</div>
      </div>
      <div className="flex flex-col items-center justify-center gap-[13px] flex-1">
        {!purchased && (
          <EnrollButton courseId={courseId} price={price} />
          )}
        {!purchased && (
          <div className="w-full flex items-center justify-center gap-2 text-[#B1B1B1] px-5">
            <Separator className='bg-[#B1B1B1] w-1/2' />
            <span className='font-medium text-sm'>OR</span>
            <Separator className='bg-[#B1B1B1] w-1/2' />
          </div>
        )}
        <PreviewButton courseId={courseId} />
      </div>
    </div>
  )
}

export default Banner