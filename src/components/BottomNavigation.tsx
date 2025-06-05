
import React from 'react';
import { Home, Search, Camera, History, Book, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BottomNavigationProps {
  currentRoute: string;
}

export const BottomNavigation = ({ currentRoute }: BottomNavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', route: '/', active: currentRoute === '/' },
    { icon: Search, label: 'Search', route: '/search', active: currentRoute === '/search' },
    { icon: Camera, label: 'Scan', route: '/scan', active: currentRoute === '/scan', isSpecial: true },
    { icon: ChefHat, label: 'Recipes', route: '/recipes', active: currentRoute === '/recipes' },
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
          
          // Special styling for the scan button
          if (item.isSpecial) {
            return (
              <button
                key={item.route}
                onClick={() => handleNavigation(item.route)}
                className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all transform hover:scale-105 ${
                  item.active
                    ? 'text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg'
                    : 'text-white bg-gradient-to-r from-pink-400 to-purple-400 shadow-md hover:from-pink-500 hover:to-purple-500'
                }`}
              >
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">{item.label}</span>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-30 blur-sm -z-10"></div>
              </button>
            );
          }
          
          // Regular styling for other buttons
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
