import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, Search, Filter, Mail, Phone, Pencil, Trash2 } from 'lucide-react';
import { Customer } from '../types';
import AddCustomerModal from './AddCustomerModal';
import { useLanguage } from '../contexts/LanguageContext';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (c: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (id: string, c: Partial<Customer>) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function CustomersView({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }: CustomersViewProps) {
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      onDeleteCustomer(id);
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.customers.title}</h2>
          <p className="text-on-surface-variant text-sm">{t.customers.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <UserPlus size={20} />
          {t.customers.newCustomer}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.customers.totalCustomers}</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.customers.active}</p>
            <p className="text-2xl font-bold">{customers.filter(c => c.status === 'Ativo').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-3 rounded-2xl flex flex-wrap gap-4 items-center border border-outline-variant/30">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
            <input
              type="text"
              placeholder={t.customers.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all">
          <Filter size={16} />
          {t.customers.filters}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <motion.div
            layout
            key={customer.id}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 hover:border-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {customer.name.charAt(0)}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                customer.status === 'Ativo' ? 'bg-secondary-container/30 text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
              }`}>
                {customer.status === 'Ativo' ? t.modals.active : t.modals.inactive}
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-1">{customer.name}</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Mail size={14} />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Phone size={14} />
                {customer.phone}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.customers.totalSpent}</p>
                <p className="font-bold text-primary">{formatCurrency(customer.totalSpent)}</p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleEditClick(customer)}
                  className="p-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-surface-container"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(customer.id)}
                  className="p-2 text-on-surface-variant hover:text-error transition-all rounded-lg hover:bg-surface-container"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AddCustomerModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAdd={onAddCustomer} 
        onUpdate={onUpdateCustomer}
        editingCustomer={editingCustomer}
      />
    </div>
  );
}
