
import React from 'react';
import { Home, Search, Camera, History, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BottomNavigationProps {
  currentRoute: string;
}

export const BottomNavigation = ({ currentRoute }: BottomNavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', route: '/', active: currentRoute === '/' },
    { icon: Search, label: 'Search', route: '/search', active: currentRoute === '/search' },
    { icon: Camera, label: 'Scan', route: '/scan', active: currentRoute === '/scan' },
    { icon: History, label: 'History', route: '/history', active: false },
    { icon: Book, label: 'Foods', route: '/food-facts', active: currentRoute === '/food-facts' },
  ];

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => handleNavigation(item.route)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              <IconComponent className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
