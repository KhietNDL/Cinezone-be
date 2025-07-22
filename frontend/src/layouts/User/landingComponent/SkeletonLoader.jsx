// SkeletonLoader.jsx - Advanced skeleton loading component
import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative h-[100vh] sm:h-[500px] md:h-[700px] lg:h-[760px] w-full bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-center h-full w-full md:px-10 gap-6 md:gap-8">
            {/* Poster Skeleton */}
            <div className="hidden md:block flex-shrink-0 w-[200px] lg:w-[250px]">
              <div className="w-full h-[350px] bg-slate-700 rounded-2xl shadow-2xl" />
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col justify-center mt-auto mb-[100px] md:mb-0 md:mt-0 w-full space-y-6 md:w-1/2 lg:w-3/5">
              {/* Genres skeleton */}
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-slate-700 rounded-full w-16" />
                <div className="h-6 bg-slate-700 rounded-full w-20" />
                <div className="h-6 bg-slate-700 rounded-full w-14" />
              </div>

              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="h-10 bg-slate-700 rounded w-3/4" />
                <div className="h-6 bg-slate-700 rounded w-32 md:hidden" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2 hidden md:block">
                <div className="h-4 bg-slate-700 rounded w-full" />
                <div className="h-4 bg-slate-700 rounded w-5/6" />
                <div className="h-4 bg-slate-700 rounded w-4/6" />
              </div>

              {/* Buttons skeleton */}
              <div className="flex flex-row gap-3">
                <div className="h-10 bg-slate-700 rounded-full w-28" />
                <div className="h-10 bg-slate-700 rounded-full w-36" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicators skeleton */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-12 h-1 bg-slate-700 rounded-full" />
          ))}
        </div>
      </div>

      {/* Section Skeletons */}
      {[...Array(3)].map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="w-full px-4 md:px-[30px] pt-[30px] md:pt-[40px] space-y-8"
        >
          {/* Section Title Skeleton */}
          <div className="flex justify-center">
            <div className="h-8 bg-slate-700 rounded w-48" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="flex gap-4 md:gap-8 overflow-hidden">
            {[...Array(5)].map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="flex-shrink-0 w-[280px] md:w-[320px]"
              >
                <MovieCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MovieCardSkeleton = () => {
  return (
    <div className="bg-slate-800 flex flex-col h-full rounded-xl animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-[400px] bg-slate-700 rounded-tl-xl rounded-tr-xl">
        {/* Rating badge skeleton */}
        <div className="absolute top-2 right-2 bg-slate-600 rounded-lg px-2 py-1 flex items-center gap-1">
          <div className="w-3 h-3 bg-slate-500 rounded" />
          <div className="w-6 h-3 bg-slate-500 rounded" />
        </div>
      </div>

      {/* Title skeleton */}
      <div className="px-2 py-4 h-16 flex items-center justify-center">
        <div className="h-4 bg-slate-700 rounded w-3/4" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex justify-evenly items-center w-full px-2 pb-4 h-20 space-x-2">
        <div className="h-8 bg-slate-700 rounded-full w-24" />
        <div className="h-8 bg-slate-700 rounded-full w-20" />
      </div>
    </div>
  );
};

const PromotionCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center pb-2 rounded-xl space-y-2 animate-pulse">
      <div className="relative h-[180px] w-full md:h-[200px] lg:h-[180px] bg-slate-700 rounded-md">
        {/* Decorative elements skeleton */}
        <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-slate-600 top-[-20px] right-[20%]" />
        <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-slate-600 bottom-[-20px] right-[20%]" />
        <div className="absolute h-[75%] top-[12%] border-dashed border-slate-600 border-2 right-[35%]" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
export { MovieCardSkeleton, PromotionCardSkeleton };
