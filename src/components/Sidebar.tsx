import { LayoutDashboard, Store, Package, Users, Settings, HelpCircle, Plus, LogOut, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { t } = useLanguage();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const menuItems = [
    { id: 'dashboard', label: t.sidebar.dashboard, icon: LayoutDashboard },
    { id: 'pos', label: t.sidebar.pos, icon: Store },
    { id: 'inventory', label: t.sidebar.inventory, icon: Package },
    { id: 'customers', label: t.sidebar.customers, icon: Users },
    { id: 'transactions', label: t.sidebar.transactions, icon: ShoppingBag },
  ];

  const footerItems = [
    { id: 'settings', label: t.sidebar.settings, icon: Settings },
    { id: 'support', label: t.sidebar.support, icon: HelpCircle },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col py-8 z-50">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
          <Package size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">SalesHub Pro</h1>
          <p className="text-xs text-on-surface-variant font-medium opacity-70">Enterprise Edition</p>
        </div>
      </div>

      <nav className="flex-grow px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <item.icon size={20} fill={currentView === item.id ? "currentColor" : "none"} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4 space-y-6">
        <button 
          onClick={() => onViewChange('pos')}
          className="w-full bg-primary text-on-primary h-12 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} strokeWidth={3} />
          {t.sidebar.newSale}
        </button>

        <div className="space-y-1 border-t border-outline-variant pt-6">
          {footerItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === item.id ? 'bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
