import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, User, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Product, Customer, Transaction } from '../types';

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  onFinishSale: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
}

export default function POSView({ products, customers, onFinishSale, onUpdateProductStock }: POSViewProps) {
  const { t } = useLanguage();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchProduct, setSearchProduct] = useState('');

  const filteredCustomers = useMemo(() => 
    customers.filter(c => c.name.toLowerCase().includes(searchCustomer.toLowerCase()) || c.email.toLowerCase().includes(searchCustomer.toLowerCase())),
    [customers, searchCustomer]
  );

  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.sku.toLowerCase().includes(searchProduct.toLowerCase())),
    [products, searchProduct]
  );

  const total = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
    [cart]
  );

  const addToCart = (product: Product) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      if (newCart[existingIndex].quantity < product.stock) {
        newCart[existingIndex].quantity += 1;
        setCart(newCart);
      } else {
        alert('Estoque insuficiente');
      }
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, Math.min(item.product.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleFinish = () => {
    if (!selectedCustomer || cart.length === 0) return;

    // Check stock for all items
    for (const item of cart) {
      if (item.product.stock < item.quantity) {
        alert(`Estoque insuficiente para ${item.product.name}`);
        return;
      }
    }

    const productNames = cart.map(item => `${item.product.name} (x${item.quantity})`).join(', ');

    const transaction: Omit<Transaction, 'id'> = {
      client: selectedCustomer.name,
      clientInitial: selectedCustomer.name.charAt(0),
      date: new Date().toLocaleString(),
      product: productNames,
      value: total,
      status: 'Finalizada',
    };

    onFinishSale(transaction);
    
    // Update stock for each product
    cart.forEach(item => {
      onUpdateProductStock(item.product.id, item.product.stock - item.quantity);
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedCustomer(null);
      setCart([]);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.pos.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Selection */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-6">
          <div className="flex items-center gap-3 text-primary mb-2">
            <User size={24} />
            <h3 className="font-bold">{t.pos.selectCustomer}</h3>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
            <input
              type="text"
              placeholder={t.pos.searchCustomer}
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
            {filteredCustomers.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedCustomer?.id === c.id ? 'bg-primary/5 border-primary' : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                }`}
              >
                <p className="font-bold text-sm">{c.name}</p>
                <p className="text-xs text-on-surface-variant">{c.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-6">
          <div className="flex items-center gap-3 text-secondary mb-2">
            <Package size={24} />
            <h3 className="font-bold">{t.pos.selectProduct}</h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
            <input
              type="text"
              placeholder={t.pos.searchProduct}
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={p.stock <= 0}
                className={`w-full text-left p-4 rounded-xl border transition-all disabled:opacity-50 ${
                  cart.some(item => item.product.id === p.id) ? 'bg-secondary/5 border-secondary' : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex justify-between">
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="font-bold text-sm text-secondary">R$ {p.price.toLocaleString('pt-BR')}</p>
                </div>
                <p className="text-xs text-on-surface-variant font-mono">SKU: {p.sku} | Estoque: {p.stock}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary & Checkout */}
        <div className="lg:col-span-2 bg-primary text-on-primary p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShoppingCart size={120} />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Cliente</p>
                <p className="text-lg font-bold">{selectedCustomer?.name || '---'}</p>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Carrinho ({cart.length})</p>
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {cart.length === 0 ? (
                    <p className="text-sm opacity-50 italic">Nenhum produto selecionado</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/10">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{item.product.name}</p>
                          <p className="text-xs opacity-70">R$ {item.product.price.toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white/20 rounded-lg p-1 px-2">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="hover:scale-125 transition-all text-xs font-bold">-</button>
                            <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="hover:scale-125 transition-all text-xs font-bold ">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-xs bg-white/20 hover:bg-white/40 p-1.5 rounded-lg"> remover </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{t.pos.total}</p>
                <p className="text-4xl font-bold">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={handleFinish}
                disabled={!selectedCustomer || cart.length === 0}
                className="bg-white text-primary px-12 py-8 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50 disabled:scale-100 uppercase tracking-widest"
              >
                {t.pos.finishSale}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-secondary flex flex-col items-center justify-center gap-2 z-10"
              >
                <CheckCircle2 size={64} className="text-white" />
                <p className="text-xl font-bold text-white">{t.pos.saleSuccess}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
