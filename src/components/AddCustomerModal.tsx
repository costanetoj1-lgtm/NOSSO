import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Save } from 'lucide-react';
import { Customer } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: Omit<Customer, 'id'>) => void;
  onUpdate?: (id: string, customer: Partial<Customer>) => void;
  editingCustomer?: Customer | null;
}

export default function AddCustomerModal({ isOpen, onClose, onAdd, onUpdate, editingCustomer }: AddCustomerModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Ativo' as const,
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        status: editingCustomer.status,
      });
    } else {
      setFormData({ name: '', email: '', phone: '', status: 'Ativo' });
    }
  }, [editingCustomer, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const customerData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      totalSpent: editingCustomer?.totalSpent || 0,
      lastPurchase: editingCustomer?.lastPurchase || 'Nunca',
    };

    if (editingCustomer && onUpdate) {
      onUpdate(editingCustomer.id, customerData);
    } else {
      onAdd(customerData);
    }
    
    onClose();
    if (!editingCustomer) {
      setFormData({ name: '', email: '', phone: '', status: 'Ativo' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-outline-variant"
          >
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="text-xl font-bold">{editingCustomer ? 'Editar Cliente' : t.modals.newCustomer}</h3>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserPlus size={32} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.customerName}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.email}</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.phone}</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.initialStatus}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.status === 'Ativo'}
                        onChange={() => setFormData({ ...formData, status: 'Ativo' })}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{t.modals.active}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.status === 'Inativo'}
                        onChange={() => setFormData({ ...formData, status: 'Inativo' })}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{t.modals.inactive}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  {t.modals.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-secondary text-on-secondary rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Save size={18} />
                  {t.modals.saveCustomer}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
