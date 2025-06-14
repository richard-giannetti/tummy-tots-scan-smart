
// Get age badge color based on tip age
export const getAgeBadgeColor = (tipAge: string) => {
  if (tipAge.includes('0-6')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (tipAge.includes('6-12')) return 'bg-green-100 text-green-800 border-green-200';
  if (tipAge.includes('12') || tipAge.includes('24')) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};
