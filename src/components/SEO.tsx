import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useThemeSettings } from '../contexts/ThemeSettingsContext';
import { PageSEOConfig } from '../types';

export interface SEOProps {
  pageKey?: string; // e.g. 'home', 'team', 'matches', 'standings', 'news', 'ground', 'goals', 'formation', 'gallery', 'about', 'contact'
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any> | Record<string, any>[];
}

export const SEO: React.FC<SEOProps> = ({
  pageKey,
  title: explicitTitle,
  description: explicitDesc,
  keywords: explicitKeywords,
  canonical: explicitCanonical,
  ogTitle: explicitOgTitle,
  ogDescription: explicitOgDesc,
  ogImage: explicitOgImage,
  ogType = 'website',
  twitterTitle: explicitTwTitle,
  twitterDescription: explicitTwDesc,
  twitterImage: explicitTwImage,
  noIndex: explicitNoIndex,
  structuredData,
}) => {
  const { seo, branding, settings } = useThemeSettings();
  const location = useLocation();

  // Resolve page-level override from admin config if present
  const pageOverride: PageSEOConfig | undefined = pageKey && seo.pages ? seo.pages[pageKey] : undefined;

  // Compute final metadata
  const baseCanonicalUrl = (seo.canonicalUrl || 'https://faryal-fc.vercel.app').replace(/\/+$/, '');
  const pathname = location.pathname.startsWith('/') ? location.pathname : `/${location.pathname}`;
  const defaultPageCanonical = `${baseCanonicalUrl}${pathname === '/' ? '' : pathname}`;

  const finalTitle =
    explicitTitle ||
    pageOverride?.title ||
    seo.siteTitle ||
    'Faryal FC | Official Football Club Website';

  const finalDescription =
    explicitDesc ||
    pageOverride?.description ||
    seo.metaDescription ||
    'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.';

  const finalKeywords =
    explicitKeywords ||
    pageOverride?.keywords ||
    seo.keywords ||
    'Faryal FC, football club, Karachi football, Pakistan football, squad, standings';

  const finalCanonical =
    explicitCanonical ||
    pageOverride?.canonicalUrl ||
    defaultPageCanonical;

  const defaultShareImage =
    seo.ogImage ||
    branding.logo ||
    '/faryal_crest.png';

  const finalOgImage =
    explicitOgImage ||
    pageOverride?.ogImage ||
    defaultShareImage;

  const finalOgTitle =
    explicitOgTitle ||
    pageOverride?.ogTitle ||
    pageOverride?.title ||
    finalTitle;

  const finalOgDescription =
    explicitOgDesc ||
    pageOverride?.ogDescription ||
    pageOverride?.description ||
    finalDescription;

  const finalTwTitle =
    explicitTwTitle ||
    seo.twitterTitle ||
    finalOgTitle;

  const finalTwDescription =
    explicitTwDesc ||
    seo.twitterDescription ||
    finalOgDescription;

  const finalTwImage =
    explicitTwImage ||
    seo.twitterImage ||
    finalOgImage;

  // Determine Robots directive
  const isAdminOrLogin = pathname.startsWith('/admin') || pathname === '/login';
  const shouldNoIndex =
    explicitNoIndex ||
    pageOverride?.noIndex ||
    isAdminOrLogin ||
    seo.robotsIndex === false;
  const shouldNoFollow = isAdminOrLogin || seo.robotsFollow === false;

  const robotsDirective = shouldNoIndex
    ? shouldNoFollow
      ? 'noindex, nofollow'
      : 'noindex, follow'
    : shouldNoFollow
    ? 'index, nofollow'
    : seo.robots || 'index, follow';

  useEffect(() => {
    // 1. Title
    document.title = finalTitle;

    // Helper for Meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for Link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);
    setMetaTag('name', 'robots', robotsDirective);
    setMetaTag('name', 'author', 'Faryal FC');
    setMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');

    // 3. Canonical URL
    setLinkTag('canonical', finalCanonical);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', finalOgTitle);
    setMetaTag('property', 'og:description', finalOgDescription);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:image', finalOgImage.startsWith('http') ? finalOgImage : `${baseCanonicalUrl}${finalOgImage.startsWith('/') ? '' : '/'}${finalOgImage}`);
    setMetaTag('property', 'og:site_name', seo.siteName || branding.clubName || 'Faryal FC');
    setMetaTag('property', 'og:locale', seo.locale || 'en_PK');

    // 5. Twitter / X Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTwTitle);
    setMetaTag('name', 'twitter:description', finalTwDescription);
    setMetaTag('name', 'twitter:image', finalTwImage.startsWith('http') ? finalTwImage : `${baseCanonicalUrl}${finalTwImage.startsWith('/') ? '' : '/'}${finalTwImage}`);
    if (seo.twitterHandle) {
      setMetaTag('name', 'twitter:site', seo.twitterHandle);
      setMetaTag('name', 'twitter:creator', seo.twitterHandle);
    }

    // 6. Schema.org JSON-LD Structured Data
    const fullOrgSchema = {
      '@context': 'https://schema.org',
      '@type': 'SportsTeam',
      name: branding.clubName || 'Faryal FC',
      alternateName: branding.shortName || 'FFC',
      sport: 'Soccer / Football',
      foundingDate: settings?.founded || '2024',
      logo: `${baseCanonicalUrl}${branding.logo || '/faryal_crest.png'}`,
      image: `${baseCanonicalUrl}${finalOgImage}`,
      url: baseCanonicalUrl,
      description: finalDescription,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings?.ground?.address || '20-A Main Rd, Model Colony Block 24 Model Colony',
        addressLocality: 'Karachi',
        addressCountry: 'PK',
      },
      location: {
        '@type': 'Place',
        name: settings?.ground?.name || 'Faryal FC Ground',
        address: settings?.ground?.address || '20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: settings?.ground?.latitude || 24.903822,
          longitude: settings?.ground?.longitude || 67.194202,
        },
      },
      sameAs: [
        settings?.socials?.instagram,
        settings?.socials?.facebook,
        settings?.socials?.youtube,
        settings?.socials?.twitter,
      ].filter(Boolean),
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Faryal FC',
      url: baseCanonicalUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseCanonicalUrl}/matches?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    let schemasToInject: any[] = [fullOrgSchema, websiteSchema];
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        schemasToInject = [...schemasToInject, ...structuredData];
      } else {
        schemasToInject.push(structuredData);
      }
    }

    // Inject or update ld+json script
    let scriptElement = document.getElementById('faryal-fc-dynamic-jsonld') as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'faryal-fc-dynamic-jsonld';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemasToInject);

  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalCanonical,
    finalOgTitle,
    finalOgDescription,
    finalOgImage,
    finalTwTitle,
    finalTwDescription,
    finalTwImage,
    ogType,
    robotsDirective,
    baseCanonicalUrl,
    seo,
    branding,
    settings,
    structuredData,
  ]);

  return null;
};
