
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl shadow-gray-200/20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            
            // Special styling for the scan button
            if (item.isSpecial) {
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavigation(item.route)}
                  className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                    item.active
                      ? 'text-white bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-lg shadow-pink-500/25'
                      : 'text-white bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 shadow-md shadow-pink-400/20 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-pink-500/25'
                  }`}
                >
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold tracking-wide">{item.label}</span>
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 opacity-20 blur-md -z-10"></div>
                </button>
              );
            }
            
            // Enhanced styling for regular buttons
            return (
              <button
                key={item.route}
                onClick={() => handleNavigation(item.route)}
                className={`group flex flex-col items-center p-3 rounded-xl transition-all duration-300 min-w-[60px] ${
                  item.active
                    ? 'text-pink-600 bg-gradient-to-br from-pink-50 to-purple-50 shadow-sm'
                    : 'text-gray-500 hover:text-pink-600 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 hover:shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all duration-300 ${
                  item.active 
                    ? 'bg-pink-100 shadow-inner' 
                    : 'group-hover:bg-pink-100 group-hover:shadow-inner'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium mt-1 tracking-wide leading-tight">{item.label}</span>
                {/* Active indicator */}
                {item.active && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
