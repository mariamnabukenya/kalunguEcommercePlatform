// SEO utilities for meta tags and structured data
class SEOService {
  // Set page title
  setTitle(title: string, siteName: string = 'Kalungu Clothing'): void {
    document.title = `${title} | ${siteName}`;
  }

  // Set meta description
  setDescription(description: string): void {
    this.setMetaTag('description', description);
  }

  // Set meta keywords
  setKeywords(keywords: string[]): void {
    this.setMetaTag('keywords', keywords.join(', '));
  }

  // Set Open Graph tags
  setOpenGraph(data: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    if (data.title) this.setMetaTag('og:title', data.title, 'property');
    if (data.description) this.setMetaTag('og:description', data.description, 'property');
    if (data.image) this.setMetaTag('og:image', data.image, 'property');
    if (data.url) this.setMetaTag('og:url', data.url, 'property');
    if (data.type) this.setMetaTag('og:type', data.type, 'property');
  }

  // Set Twitter Card tags
  setTwitterCard(data: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  }): void {
    this.setMetaTag('twitter:card', data.card || 'summary_large_image', 'name');
    if (data.title) this.setMetaTag('twitter:title', data.title, 'name');
    if (data.description) this.setMetaTag('twitter:description', data.description, 'name');
    if (data.image) this.setMetaTag('twitter:image', data.image, 'name');
    if (data.creator) this.setMetaTag('twitter:creator', data.creator, 'name');
  }

  // Set canonical URL
  setCanonical(url: string): void {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  // Set meta tag
  private setMetaTag(name: string, content: string, attribute: string = 'name'): void {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  // Generate structured data for product
  generateProductStructuredData(product: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images?.map((img: any) => img.image_url) || [],
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Kalungu',
      },
      offers: {
        '@type': 'Offer',
        price: product.current_price,
        priceCurrency: 'USD',
        availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Kalungu Clothing',
        },
      },
      aggregateRating: product.review_count > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: product.average_rating,
        reviewCount: product.review_count,
      } : undefined,
    };
  }

  // Generate structured data for organization
  generateOrganizationStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Kalungu Clothing',
      url: 'https://kalungu.com',
      logo: 'https://kalungu.com/logo.png',
      description: 'Premium clothing brand offering the latest trends in men\'s and women\'s fashion.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Fashion Street',
        addressLocality: 'New York',
        addressRegion: 'NY',
        postalCode: '10001',
        addressCountry: 'US',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'customer service',
        email: 'info@kalungu.com',
      },
      sameAs: [
        'https://facebook.com/kalungu',
        'https://twitter.com/kalungu',
        'https://instagram.com/kalungu',
      ],
    };
  }

  // Generate structured data for breadcrumbs
  generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  // Add structured data to page
  addStructuredData(data: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Remove structured data
  removeStructuredData(): void {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }

  // Generate sitemap data
  generateSitemapData(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>): string {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
    
    return sitemap;
  }

  // Generate robots.txt content
  generateRobotsTxt(sitemapUrl?: string): string {
    let robots = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /cart/
Disallow: /profile/
Disallow: /orders/
Disallow: /addresses/
Disallow: /reviews/
Disallow: /wishlist/`;

    if (sitemapUrl) {
      robots += `\n\nSitemap: ${sitemapUrl}`;
    }

    return robots;
  }
}

export const seoService = new SEOService();
export default seoService;
