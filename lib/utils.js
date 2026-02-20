import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, differenceInYears, differenceInMonths } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
}

export function formatRelativeTime(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date) {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const now = new Date();

  const years = differenceInYears(now, dob);
  const months = differenceInMonths(now, dob) % 12;

  let display = '';
  if (years > 0) {
    display = `${years} year${years !== 1 ? 's' : ''}`;
    if (months > 0) {
      display += `, ${months} month${months !== 1 ? 's' : ''}`;
    }
  } else {
    display = `${months} month${months !== 1 ? 's' : ''}`;
  }

  return { years, months, display };
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}