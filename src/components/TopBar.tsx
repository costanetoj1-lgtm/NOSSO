import { Search, Bell, History, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function TopBar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center h-16 px-8 bg-surface-bright/80 backdrop-blur-md border-b border-outline-variant z-40 pl-[288px]">
      <div className="flex items-center flex-grow max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            type="text"
            placeholder={t.topbar.search}
            className="w-full pl-10 pr-4 py-2 bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all flex items-center gap-2"
            title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          >
            <Languages size={20} />
            <span className="text-xs font-bold uppercase">{language}</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">
            <History size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-outline-variant"></div>

        <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">
          {t.topbar.checkout}
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">Samuel Sousa</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{t.topbar.manager}</p>
          </div>
          <img
            src="https://picsum.photos/seed/admin/100/100"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-outline-variant object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
