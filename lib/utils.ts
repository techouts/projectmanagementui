import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-50 text-green-700 border-green-200',
    planning: 'bg-blue-50 text-blue-700 border-blue-200',
    on_hold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    on_bench: 'bg-orange-50 text-orange-700 border-orange-200',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  return colors[status as keyof typeof colors] || colors.inactive;
};