"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Typography, Card, CardBody, Rating } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTestimonials } from "@/lib/mockData";
import type { Testimonial } from "@/lib/types";

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

export function TestimonialCarousel() {
  const testimonials = getTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [avatarErrors, setAvatarErrors] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  // Use useCallback to prevent recreation of this function on each render
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, testimonials.length]);

  // Auto rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleImageError = (id: string) => {
    setAvatarErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Generate a random background color based on the user's name
  const getAvatarBgColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-red-500", "bg-green-500", 
      "bg-yellow-500", "bg-purple-500", "bg-pink-500", 
      "bg-indigo-500", "bg-teal-500", "bg-orange-500"
    ];
    
    // Use the sum of char codes to determine color
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <div 
      className="relative w-full overflow-hidden px-4 py-12" 
      onMouseEnter={() => setIsPaused(false)} 
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <Typography variant="h6" color="orange" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            TESTIMONIALS
          </Typography>
          <Typography variant="h3" color="blue-gray" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            What People Say About Us
          </Typography>
          <Typography
            variant="lead"
            className="mt-2 mx-auto max-w-3xl text-center font-normal !text-gray-500"
            placeholder={null}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Hear from donors, organizations, and communities who have experienced the transparency and impact of our platform.
          </Typography>
        </div>

        <div className="relative h-[400px] md:h-[350px]">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`absolute w-full transform transition-all duration-500 ease-in-out ${
                index === activeIndex
                  ? "opacity-100 translate-x-0 z-10"
                  : index === (activeIndex + 1) % testimonials.length
                  ? "opacity-0 translate-x-full z-0"
                  : "opacity-0 -translate-x-full z-0"
              }`}
              shadow={false}
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <CardBody
                className="flex flex-col items-center p-6 text-center"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-gray-900 shadow-lg flex items-center justify-center">
                  {avatarErrors[testimonial.id] ? (
                    <div className={`h-full w-full flex items-center justify-center text-white text-xl font-bold ${getAvatarBgColor(testimonial.name)}`}>
                      {getInitials(testimonial.name)}
                    </div>
                  ) : (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(testimonial.id)}
                    />
                  )}
                </div>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-1"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {testimonial.name}
                </Typography>
                <Typography
                  variant="small"
                  className="mb-4 font-normal text-gray-700"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {testimonial.role}
                </Typography>
                <div className="mb-6">
                  <Rating value={testimonial.rating} readonly placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </div>
                <Typography
                  variant="paragraph"
                  className="mb-8 max-w-2xl font-normal text-gray-600"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  "{testimonial.content}"
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === activeIndex ? "bg-gray-900 w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute top-1/2 -mt-6 flex w-full justify-between px-4">
          <button
            onClick={handlePrev}
            className="rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCarousel;