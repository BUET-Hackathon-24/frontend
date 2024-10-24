import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
/**
 * Combines and merges class names together.
 *
 * @param {...any} inputs - The class names to combine and merge.
 * @returns {string} The combined and merged class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
