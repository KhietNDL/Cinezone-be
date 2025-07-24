// StatsSection.jsx - Eye-catching statistics section
import React, { useState, useEffect, useRef } from "react";
import { Film, Users, Star, Calendar, MapPin, Clock } from "lucide-react";

const StatsSection = ({ movieData, currentMovies, upcomingMovies }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    totalMovies: 0,
    avgRating: 0,
    totalShows: 0,
    happyCustomers: 0,
  });
  const sectionRef = useRef(null);

  // Calculate actual stats
  const stats = {
    totalMovies: movieData?.length || 0,
    avgRating:
      movieData?.length > 0
        ? movieData.reduce(
            (acc, movie) => acc + (parseFloat(movie.AverageRating) || 0),
            0
          ) / movieData.length
        : 0,
    totalShows: currentMovies?.length + upcomingMovies?.length || 0,
    happyCustomers: 15420, // Static number for demo
  };

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Animate numbers when visible
  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      const animateNumber = (target, key) => {
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedNumbers((prev) => ({
            ...prev,
            [key]: key === "avgRating" ? current : Math.floor(current),
          }));
        }, interval);
      }; // Start animations with delays
      setTimeout(() => animateNumber(stats.totalMovies, "totalMovies"), 0);
      setTimeout(() => animateNumber(stats.avgRating, "avgRating"), 200);
      setTimeout(() => animateNumber(stats.totalShows, "totalShows"), 400);
      setTimeout(
        () => animateNumber(stats.happyCustomers, "happyCustomers"),
        600
      );
    }
  }, [
    isVisible,
    stats.totalMovies,
    stats.avgRating,
    stats.totalShows,
    stats.happyCustomers,
  ]);

  const statsData = [
    {
      icon: Film,
      number: animatedNumbers.totalMovies,
      label: "Movies Available",
      suffix: "+",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      icon: Star,
      number: animatedNumbers.avgRating,
      label: "Average Rating",
      suffix: "/10",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      icon: Calendar,
      number: animatedNumbers.totalShows,
      label: "Active Shows",
      suffix: "+",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      icon: Users,
      number: animatedNumbers.happyCustomers,
      label: "Happy Customers",
      suffix: "+",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="w-full py-16 md:py-20 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-slate-800/30 to-slate-900/50" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6a57f5]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6a57f5]/10 border border-[#6a57f5]/20 mb-6 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <MapPin size={16} className="text-[#6a57f5]" />
            <span className="text-[#6a57f5] text-sm font-medium">
              CineZone Statistics
            </span>
          </div>

          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Cinema in{" "}
            <span className="bg-gradient-to-r from-[#6a57f5] to-blue-500 bg-clip-text text-transparent">
              Numbers
            </span>
          </h2>

          <p
            className={`text-gray-400 text-lg max-w-2xl mx-auto transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Experience the magic of cinema with our impressive collection and
            stellar service
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${600 + index * 150}ms` }}
            >
              {/* Card */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 hover:border-slate-600/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#6a57f5]/10">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                />

                {/* Icon Container */}
                <div
                  className={`${stat.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  <stat.icon size={28} className={stat.iconColor} />
                </div>

                {/* Number */}
                <div className="mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-white block">
                    {stat.label === "Average Rating"
                      ? Number(stat.number).toFixed(1)
                      : typeof stat.number === "string"
                      ? stat.number
                      : stat.number.toLocaleString()}
                    <span className="text-xl text-gray-400">{stat.suffix}</span>
                  </span>
                </div>

                {/* Label */}
                <p className="text-gray-400 text-sm md:text-base font-medium">
                  {stat.label}
                </p>

                {/* Hover Effect Line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Accent */}
        <div
          className={`flex justify-center mt-16 transition-all duration-1000 delay-1200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock size={16} />
            <span>Updated in real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
