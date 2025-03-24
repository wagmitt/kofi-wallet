'use client';

/**
 * Content types that can be fetched from markdown files
 */
export enum ContentType {
  TERMS = 'terms',
  PRIVACY = 'privacy',
  DISCLAIMER = 'disclaimer',
}

/**
 * Get the appropriate file path based on content type
 */
function getContentPath(contentType: ContentType): string {
  switch (contentType) {
    case ContentType.TERMS:
      return '/kofi-terms-of-service.md';
    case ContentType.PRIVACY:
      return '/kofi-privacy.md';
    case ContentType.DISCLAIMER:
      return '/kofi-disclaimer.md';
    default:
      return '/kofi-terms-of-service.md';
  }
}

/**
 * Get the appropriate title based on content type
 */
export function getContentTitle(contentType: ContentType): string {
  switch (contentType) {
    case ContentType.TERMS:
      return 'Terms of Service';
    case ContentType.PRIVACY:
      return 'Privacy Policy';
    case ContentType.DISCLAIMER:
      return 'Legal Disclaimer';
    default:
      return 'Terms of Service';
  }
}

/**
 * Fetch markdown content by type
 * @param contentType Type of content to fetch
 * @returns Promise with the content and last updated date
 */
export async function fetchContent(contentType: ContentType = ContentType.TERMS): Promise<{
  content: string;
  lastUpdated: string;
}> {
  try {
    const path = getContentPath(contentType);
    const response = await fetch(path);
    const text = await response.text();

    // Extract the "Last Updated" date from the markdown content
    const lastUpdatedMatch = text.match(/\*\*Last Updated: ([^*]+)\*\*/);
    const lastUpdated = lastUpdatedMatch && lastUpdatedMatch[1] ? lastUpdatedMatch[1].trim() : '';

    return {
      content: text,
      lastUpdated,
    };
  } catch (error) {
    console.error(`Error loading ${contentType} content:`, error);
    return {
      content: `Failed to load ${contentType} content. Please try again later.`,
      lastUpdated: '',
    };
  }
}

/**
 * Legacy function for backwards compatibility
 * @deprecated Use fetchContent instead
 */
export async function fetchTermsContent(): Promise<{
  content: string;
  lastUpdated: string;
}> {
  return fetchContent(ContentType.TERMS);
}
