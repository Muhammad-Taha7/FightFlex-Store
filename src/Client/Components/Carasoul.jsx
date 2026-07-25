import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

export const Carousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch API Data
  useEffect(() => {
    const controller = new AbortController();

    const fetchCarouselImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/carousel", {
          signal: controller.signal,
        });
        const data = await response.json();

        if (data.success && Array.isArray(data.carousels)) {
          setImages(data.carousels);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching carousel images:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
    return () => controller.abort();
  }, []);

  // Navigation Handlers
  const nextSlide = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Auto-play interval
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length, nextSlide]);

  if (loading) {
    return (
      <div className="w-full h-64 md:h-[35rem] lg:h-[42rem] animate-pulse bg-gray-900 flex items-center justify-center text-gray-400 font-bold tracking-wider">
        LOADING FIGHTFLEX...
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden group select-none shadow-2xl">
      {/* Slide Container */}
      <div className="relative h-64 sm:h-96 md:h-[35rem] lg:h-[55rem] w-full">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((item, index) => (
            <div
              key={item._id || index}
              className="relative flex-shrink-0 w-full h-full"
            >
              <img
                src={item.imageUrl}
                alt={item.title || `Slide ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* OVERLAY LAYOUT: Left Text & Right Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end md:items-center justify-between px-4 sm:px-12 md:px-16 pb-8 md:pb-0 gap-3 sm:gap-4">
                
                {/* LEFT SIDE: Professional FightFlex Text (Chota font mobile par) */}
                <div className="max-w-xs sm:max-w-xl text-left space-y-1 sm:space-y-3 z-10">
                  <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-900/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-black tracking-widest uppercase rounded-md shadow-md">
                    FightFlex Apparel
                  </span>
                  <h2 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-lg">
                    {item.title || "Unleash Your Power"}
                  </h2>
                  <p className="text-[11px] sm:text-sm md:text-base text-gray-200 font-medium line-clamp-2 md:line-clamp-none max-w-md drop-shadow leading-snug sm:leading-normal">
                    {item.subtitle || "Premium activewear engineered for extreme performance, durability, and ultimate style."}
                  </p>
                </div>

                {/* RIGHT SIDE: Action Button */}
                <div className="z-10 flex-shrink-0 self-end md:self-center mb-0.5 md:mb-0">
                  <Link
                    to={item.link || "/men"}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-900 hover:bg-black text-white font-extrabold text-[11px] sm:text-base px-3.5 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-gray-900/50 hover:scale-105 transition-all duration-300 no-underline uppercase tracking-wider"
                  >
                    <span>Shop Now</span>
                    <svg
                      className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-300 cursor-pointer border border-white/10 opacity-0 group-hover:opacity-100"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-300 cursor-pointer border border-white/10 opacity-0 group-hover:opacity-100"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-1.5 sm:space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? "w-5 sm:w-9 bg-gray-900"
                    : "w-1.5 sm:w-2.5 bg-white/50 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};