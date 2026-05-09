import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Save } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate?: (id: string, product: Partial<Product>) => void;
  editingProduct?: Product | null;
}

export default function AddProductModal({ isOpen, onClose, onAdd, onUpdate, editingProduct }: AddProductModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Eletrônicos',
    price: '',
    stock: '',
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString(),
      });
    } else {
      setFormData({ name: '', sku: '', category: 'Eletrônicos', price: '', stock: '' });
    }
  }, [editingProduct, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const stock = parseInt(formData.stock);
    const status = (stock <= 0 ? 'Esgotado' : stock <= 3 ? 'Estoque Baixo' : stock > 50 ? 'Estoque Alto' : 'Em Estoque') as Product['status'];
    
    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      stock,
      status,
      image: editingProduct?.image || `https://picsum.photos/seed/${formData.name}/100/100`,
    };

    if (editingProduct && onUpdate) {
      onUpdate(editingProduct.id, productData);
    } else {
      onAdd(productData);
    }
    
    onClose();
    if (!editingProduct) {
      setFormData({ name: '', sku: '', category: 'Eletrônicos', price: '', stock: '' });
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
              <h3 className="text-xl font-bold">{editingProduct ? 'Editar Produto' : t.modals.newProduct}</h3>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-surface-container border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant gap-2 hover:border-primary hover:text-primary transition-all cursor-pointer">
                  <Upload size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t.modals.uploadPhoto}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.productName}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Ex: iPhone 15 Pro Max"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.sku}</label>
                  <input
                    required
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="PH-000000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.category}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option>Eletrônicos</option>
                    <option>Acessórios</option>
                    <option>Periféricos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.price}</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.modals.stock}</label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="0"
                  />
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
                  className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Save size={18} />
                  {t.modals.saveProduct}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
