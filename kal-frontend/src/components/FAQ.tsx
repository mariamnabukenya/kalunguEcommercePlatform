import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  faqs?: FAQItem[];
  className?: string;
  title?: string;
  allowMultipleOpen?: boolean;
}

const FAQ: React.FC<FAQProps> = ({
  faqs: propFaqs,
  className = '',
  title = 'Frequently Asked Questions',
  allowMultipleOpen = false,
}) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Default FAQs if none provided
  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Items must be in new condition with tags attached. We provide free return shipping for orders over $50.',
    },
    {
      id: 2,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days within the US. Express shipping is available for 1-2 business days. International shipping takes 7-14 business days depending on the destination.',
    },
    {
      id: 3,
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates are calculated at checkout based on your location. Customs duties and taxes may apply and are the responsibility of the customer.',
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely.',
    },
    {
      id: 5,
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can track your package using the tracking number on our website or the carrier\'s website.',
    },
    {
      id: 6,
      question: 'What if my item doesn\'t fit?',
      answer: 'If your item doesn\'t fit, you can return it within 30 days for a full refund or exchange. We recommend checking our size guide before ordering to ensure the best fit.',
    },
    {
      id: 7,
      question: 'Do you have a size guide?',
      answer: 'Yes, we provide detailed size guides for all our products. You can find the size guide on each product page. We recommend measuring yourself and comparing with our size charts for the best fit.',
    },
    {
      id: 8,
      question: 'Are your products sustainable?',
      answer: 'We\'re committed to sustainability and use eco-friendly materials whenever possible. Many of our products are made from organic cotton, recycled materials, and sustainable fabrics.',
    },
  ];

  const faqs = propFaqs || defaultFaqs;

  const toggleItem = (id: number) => {
    if (allowMultipleOpen) {
      setOpenItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(id) 
          ? [] 
          : [id]
      );
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16', className)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600">
          Find answers to common questions about our products and services
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openItems.includes(faq.id);
          
          return (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
