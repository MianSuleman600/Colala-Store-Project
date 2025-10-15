import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  Home, 
  MessageCircle, 
  ShoppingCart, 
  Settings,
  Calendar
} from "lucide-react";

import { openModal } from "../../redux/modalSlice";

const tabConfig = [
  {
    id: "Home",
    path: "/",
    icon: Home,
    label: "Home",
    protected: false
  },
  {
    id: "Feed", 
    path: "/feed",
    icon: Calendar,
    label: "Feed",
    protected: true
  },
  {
    id: "Chat",
    path: "/chat", 
    icon: MessageCircle,
    label: "Chat",
    protected: true
  },
  {
    id: "Orders",
    path: "/orders",
    icon: ShoppingCart, 
    label: "Orders",
    protected: true
  },
  {
    id: "Settings",
    path: "/settings",
    icon: Settings,
    label: "Settings", 
    protected: true
  }
];

function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const brandColor = user?.store?.theme_color || "#EF4444";

  const handleTabClick = useCallback(
    (tab) => {
      if (tab.protected && !isAuthenticated) {
        dispatch(openModal("login"));
        return;
      }
      navigate(tab.path);
    },
    [navigate, isAuthenticated, dispatch]
  );

  const isActiveTab = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)' // Handle iPhone home indicator
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveTab(tab.path);
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{
                backgroundColor: isActive ? brandColor : 'transparent',
                borderRadius: isActive ? '12px' : '0'
              }}
            >
              <Icon 
                size={20} 
                className={`mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`}
              />
              <span 
                className={`text-xs font-medium ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BottomTabBar;
