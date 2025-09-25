import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Check } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import toast from 'react-hot-toast';

interface NewsletterForm {
  email: string;
}

interface NewsletterSignupProps {
  className?: string;
  title?: string;
  description?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  title = 'Stay Updated',
  description = 'Subscribe to our newsletter for the latest fashion trends and exclusive offers.',
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterForm>();

  const onSubmit = async (data: NewsletterForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      reset();
      toast.success('Successfully subscribed to newsletter!');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <Check className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Thank you for subscribing!
        </h3>
        <p className="text-green-700">
          You'll receive our latest updates and exclusive offers.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <Mail className="w-8 h-8 text-primary-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          Subscribe Now
        </Button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-3">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSignup;
