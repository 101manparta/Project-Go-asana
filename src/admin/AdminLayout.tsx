import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  UserCheck, 
  CreditCard, 
  Bot, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  currentRoute: string;
  navigate: (route: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentRoute, navigate, children }) => {
  const { user, isAdmin, logout } = useAuth();

  const adminNav = [
    { label: 'Overview', route: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', route: '/admin/bookings', icon: Calendar },
    { label: 'Schedule', route: '/admin/schedule', icon: Calendar },
    { label: 'Classes', route: '/admin/classes', icon: BookOpen },
    { label: 'Instructors', route: '/admin/instructors', icon: UserCheck },
    { label: 'Customers', route: '/admin/customers', icon: Users },
    { label: 'Memberships', route: '/admin/memberships', icon: CreditCard },
    { label: 'Studio Copilot', route: '/admin/copilot', icon: Bot },
    { label: 'Analytics', route: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', route: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row antialiased font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1 border border-white/10">
                <img
                  src="/public/assets/aistudio/image_2c9304de.png"
                  alt="ASANA-Yoga Admin"
                  className="w-full h-full object-contain filter invert"
                />
              </div>
              <div>
                <span className="font-serif font-semibold text-xs uppercase tracking-wider text-white block">
                  ASANA-Yoga Admin
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  v1.0 &bull; Operations Node
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;

              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-white text-neutral-950 shadow-md font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer / Return to Public */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                SA
              </div>
              <div>
                <p className="font-medium text-white text-[11px] truncate max-w-[100px]">
                  {user?.displayName || 'Admin'}
                </p>
                <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">
                  {user?.role || 'SUPER_ADMIN'}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="text-neutral-400 hover:text-red-400 p-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-neutral-400 hover:text-white text-[11px] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Public Site</span>
          </button>
        </div>
      </aside>

      {/* Admin Content Viewport */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-neutral-900 p-4 sm:p-8 lg:p-10">
        {children}
      </main>

    </div>
  );
};
