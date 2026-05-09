import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Filter, Trash2, Calendar, User, Package, DollarSign } from 'lucide-react';
import { Transaction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TransactionsViewProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionsView({ transactions, onDeleteTransaction }: TransactionsViewProps) {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.client.toLowerCase().includes(search.toLowerCase()) ||
      tx.product.toLowerCase().includes(search.toLowerCase()) ||
      tx.date.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm(t.transactions.deleteConfirm)) {
      onDeleteTransaction(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.transactions.title}</h2>
          <p className="text-on-surface-variant text-sm">{t.transactions.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
          <input 
            type="text" 
            placeholder={t.transactions.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none cursor-pointer"
          >
            <option value="all">{t.transactions.allStatus}</option>
            <option value="Finalizada">{t.status.completed}</option>
            <option value="Pendente">{t.status.pending}</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.dashboard.customer}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.dashboard.date}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.product}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.price}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.status}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t.inventory.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map((tx) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={tx.id} 
                    className="hover:bg-primary-container/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-primary text-xs">
                          {tx.clientInitial}
                        </div>
                        <span className="text-sm font-medium">{tx.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <Calendar size={14} />
                        {tx.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Package size={14} className="text-on-surface-variant" />
                        {tx.product}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        {formatCurrency(tx.value)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'Finalizada' ? 'bg-secondary-container text-on-secondary-container' : 
                        tx.status === 'Cancelada' ? 'bg-error-container text-on-error-container' :
                        'bg-surface-container text-on-surface-variant'
                      }`}>
                        {tx.status === 'Finalizada' ? t.status.completed : 
                         tx.status === 'Cancelada' ? 'Cancelada' : t.status.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-on-surface-variant hover:text-error transition-all rounded-lg hover:bg-white active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant/30">
                <ShoppingBag size={32} />
              </div>
              <p className="text-on-surface-variant font-medium">Nenhuma transação encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
