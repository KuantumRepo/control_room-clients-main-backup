/**
 * Strips all HTML tags from a string.
 * This is a lightweight alternative to DOMPurify for server-side use
 * where we only want to remove tags and not preserve any HTML.
 *
 * @param value The string to sanitize
 * @returns The string with all HTML tags removed
 */
export function stripHtmlTags(value: string): string {
    if (!value) return '';
    return value.replace(/<[^>]*>?/gm, '');
}
