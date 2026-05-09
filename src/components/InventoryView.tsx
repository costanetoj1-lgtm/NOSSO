import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, AlertTriangle, BadgeDollarSign, Tags, Search, Filter, RefreshCcw, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import MetricCard from './MetricCard';
import AddProductModal from './AddProductModal';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface InventoryViewProps {
  products: Product[];
  onAddProduct: (p: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, p: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function InventoryView({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: InventoryViewProps) {
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      onDeleteProduct(id);
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    });
  };

  const getStatusLabel = (status: string) => {
    if (status === 'Em Estoque') return t.status.inStock;
    if (status === 'Estoque Baixo') return t.status.lowStock;
    if (status === 'Estoque Alto') return t.status.highStock;
    return t.status.outOfStock;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.inventory.title}</h2>
          <p className="text-on-surface-variant text-sm">{t.inventory.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <PlusCircle size={20} />
          {t.inventory.addProduct}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label={t.inventory.totalItems}
          value={products.reduce((acc, p) => acc + p.stock, 0)}
          change={12}
          changeType="up"
          icon={Package}
          colorClass="bg-primary-container/20 text-primary"
        />
        <MetricCard
          label={t.inventory.lowStock}
          value={products.filter(p => p.stock > 0 && p.stock <= 3).length}
          changeType="down"
          icon={AlertTriangle}
          colorClass="bg-error-container/20 text-error"
        />
        <MetricCard
          label={t.inventory.totalValue}
          value={formatCurrency(products.reduce((acc, p) => acc + (p.price * p.stock), 0) / 1000) + 'k'}
          icon={BadgeDollarSign}
          colorClass="bg-secondary-container/20 text-secondary"
        />
        <MetricCard
          label={t.inventory.categories}
          value={new Set(products.map(p => p.category)).size}
          icon={Tags}
          colorClass="bg-tertiary-container/20 text-tertiary"
        />
      </div>

      <div className="bg-surface-container-low p-3 rounded-2xl flex flex-wrap gap-4 items-center border border-outline-variant/30">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
            <input
              type="text"
              placeholder={t.inventory.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
        <select className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary">
          <option>{t.inventory.allCategories}</option>
          <option>Eletrônicos</option>
          <option>Acessórios</option>
        </select>
        <select className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary">
          <option>{t.inventory.allStatus}</option>
          <option>{t.status.inStock}</option>
          <option>{t.status.lowStock}</option>
          <option>{t.status.outOfStock}</option>
        </select>
        <button 
          onClick={() => {setSearch('');}}
          className="flex items-center gap-2 px-4 py-2 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all"
        >
          <RefreshCcw size={16} />
          {t.inventory.clear}
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.product}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.category}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.price}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.stock}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.status}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t.inventory.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-primary/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/30">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{product.name}</p>
                        <p className="text-[11px] text-on-surface-variant font-mono uppercase opacity-70">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{product.stock} un.</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      product.status === 'Em Estoque' ? 'bg-secondary-container/30 text-on-secondary-container' : 
                      product.status === 'Estoque Baixo' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 
                      product.status === 'Estoque Alto' ? 'bg-primary-container/30 text-primary' :
                      'bg-error-container text-on-error-container'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        product.status === 'Em Estoque' ? 'bg-secondary' : 
                        product.status === 'Estoque Baixo' ? 'bg-tertiary' : 
                        product.status === 'Estoque Alto' ? 'bg-primary' :
                        'bg-error'
                      }`} />
                      {getStatusLabel(product.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-white active:scale-90"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product.id)}
                        className="p-2 text-on-surface-variant hover:text-error transition-all rounded-lg hover:bg-white active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">{t.inventory.showing} {filteredProducts.length} {t.inventory.of} {products.length} {t.inventory.product.toLowerCase()}s</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50">{t.inventory.previous}</button>
            <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">{t.inventory.next}</button>
          </div>
        </div>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAdd={onAddProduct} 
        onUpdate={onUpdateProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
}
