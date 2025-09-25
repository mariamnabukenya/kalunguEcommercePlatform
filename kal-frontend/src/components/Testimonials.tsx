import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
  className?: string;
  title?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials: propTestimonials,
  className = '',
  title = 'What Our Customers Say',
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default testimonials if none provided
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      content: 'The quality of clothing from Kalungu is exceptional. I\'ve been a customer for over a year and every piece I\'ve purchased has exceeded my expectations.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Business Professional',
      content: 'Great customer service and fast shipping. The clothes fit perfectly and the materials are top-notch. Highly recommend!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Stylist',
      content: 'Kalungu has become my go-to brand for trendy yet timeless pieces. The attention to detail and craftsmanship is outstanding.',
      rating: 5,
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Entrepreneur',
      content: 'I love the modern designs and the fact that they use sustainable materials. It\'s refreshing to find a brand that cares about both style and the environment.',
      rating: 4,
    },
  ];

  const testimonials = propTestimonials || defaultTestimonials;

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={cn('bg-gray-50 py-16', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="relative">
          {/* Testimonial Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Quote className="w-8 h-8 text-primary-600 mx-auto mb-6" />
            
            <blockquote className="text-lg text-gray-700 mb-6 italic">
              "{currentTestimonial.content}"
            </blockquote>

            <div className="flex items-center justify-center space-x-1 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    'w-5 h-5',
                    index < currentTestimonial.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-center space-x-3">
              {currentTestimonial.avatar ? (
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {currentTestimonial.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="text-left">
                <div className="font-semibold text-gray-900">
                  {currentTestimonial.name}
                </div>
                <div className="text-sm text-gray-500">
                  {currentTestimonial.role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                index === currentIndex
                  ? 'bg-primary-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
