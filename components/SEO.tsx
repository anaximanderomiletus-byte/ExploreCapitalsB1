import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = "geography, capitals, world map, quiz, education, learning, countries, flags, population",
  image = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop", // High-res map placeholder
  type = "website",
  structuredData
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | ExploreCapitals`;

    // 2. Helper to update or create meta tags
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Standard Meta Tags
    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('robots', 'index, follow');

    // 4. Open Graph / Social Media
    setProperty('og:title', `${title} | ExploreCapitals`);
    setProperty('og:description', description);
    setProperty('og:type', type);
    setProperty('og:url', window.location.href);
    setProperty('og:image', image);
    setProperty('og:site_name', 'ExploreCapitals');

    // 5. Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', `${title} | ExploreCapitals`);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // 6. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', window.location.href);

    // 7. Structured Data (JSON-LD)
    let scriptJSONLD = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      if (!scriptJSONLD) {
        scriptJSONLD = document.createElement('script');
        scriptJSONLD.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptJSONLD);
      }
      scriptJSONLD.textContent = JSON.stringify(structuredData);
    }

    // Cleanup: We generally don't remove meta tags on unmount in SPAs to prevent 
    // "flashing" or missing tags before the next page loads, 
    // but the next component will overwrite them immediately.
  }, [title, description, keywords, image, type, structuredData]);

  return null;
};

export default SEO;