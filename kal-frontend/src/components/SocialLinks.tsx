import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Pinterest } from 'lucide-react';
import { cn } from '../lib/utils';

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'colored';
  showLabels?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  size = 'md',
  variant = 'default',
  showLabels = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/kalungu',
      icon: Facebook,
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-600',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/kalungu',
      icon: Twitter,
      color: 'hover:text-blue-400',
      bgColor: 'hover:bg-blue-400',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/kalungu',
      icon: Instagram,
      color: 'hover:text-pink-600',
      bgColor: 'hover:bg-pink-600',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/kalungu',
      icon: Youtube,
      color: 'hover:text-red-600',
      bgColor: 'hover:bg-red-600',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/kalungu',
      icon: Linkedin,
      color: 'hover:text-blue-700',
      bgColor: 'hover:bg-blue-700',
    },
    {
      name: 'Pinterest',
      url: 'https://pinterest.com/kalungu',
      icon: Pinterest,
      color: 'hover:text-red-500',
      bgColor: 'hover:bg-red-500',
    },
  ];

  const getVariantClasses = (link: typeof socialLinks[0]) => {
    switch (variant) {
      case 'minimal':
        return 'text-gray-400 hover:text-gray-600';
      case 'colored':
        return `text-white ${link.bgColor} ${link.color}`;
      default:
        return `text-gray-400 ${link.color}`;
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center justify-center rounded-full transition-colors',
              sizeClasses[size],
              variant === 'colored' ? 'bg-gray-600' : 'bg-gray-100',
              getVariantClasses(link)
            )}
            title={link.name}
          >
            <Icon className={iconSizeClasses[size]} />
            {showLabels && (
              <span className="ml-2 text-sm font-medium">{link.name}</span>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
