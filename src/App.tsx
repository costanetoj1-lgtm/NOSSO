/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import { firebaseService } from './services/firebaseService';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import CustomersView from './components/CustomersView';
import POSView from './components/POSView';
import TransactionsView from './components/TransactionsView';
import { PRODUCTS as INITIAL_PRODUCTS, INITIAL_CUSTOMERS, RECENT_TRANSACTIONS } from './constants';
import { Product, Customer, Transaction } from './types';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    const fetchedProducts = await firebaseService.getProducts();
    const fetchedCustomers = await firebaseService.getCustomers();
    const fetchedTransactions = await firebaseService.getTransactions();

    // Seed if empty (for first time use)
    if (fetchedProducts.length === 0) {
      for (const p of INITIAL_PRODUCTS) {
        const { id, ...pWithoutId } = p;
        await firebaseService.addProduct(pWithoutId);
      }
      setProducts(await firebaseService.getProducts());
    } else {
      setProducts(fetchedProducts);
    }

    if (fetchedCustomers.length === 0) {
      for (const c of INITIAL_CUSTOMERS) {
        const { id, ...cWithoutId } = c;
        await firebaseService.addCustomer(cWithoutId);
      }
      setCustomers(await firebaseService.getCustomers());
    } else {
      setCustomers(fetchedCustomers);
    }

    if (fetchedTransactions.length === 0) {
      for (const t of RECENT_TRANSACTIONS) {
        const { id, ...tWithoutId } = t;
        await firebaseService.addTransaction(tWithoutId);
      }
      setTransactions(await firebaseService.getTransactions());
    } else {
      setTransactions(fetchedTransactions);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleAddProduct = async (p: Omit<Product, 'id'>) => {
    const newProduct = await firebaseService.addProduct(p);
    setProducts([newProduct, ...products]);
  };

  const handleUpdateProductStock = async (id: string, stock: number) => {
    const status = (stock <= 0 ? 'Esgotado' : stock <= 3 ? 'Estoque Baixo' : stock > 50 ? 'Estoque Alto' : 'Em Estoque') as Product['status'];
    await firebaseService.updateProduct(id, { stock, status });
    setProducts(products.map(p => p.id === id ? { ...p, stock, status } : p));
  };

  const handleUpdateProduct = async (id: string, p: Partial<Product>) => {
    await firebaseService.updateProduct(id, p);
    setProducts(products.map(item => item.id === id ? { ...item, ...p } : item));
  };

  const handleDeleteProduct = async (id: string) => {
    await firebaseService.deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddCustomer = async (c: Omit<Customer, 'id'>) => {
    const newCustomer = await firebaseService.addCustomer(c);
    setCustomers([newCustomer, ...customers]);
  };

  const handleUpdateCustomer = async (id: string, c: Partial<Customer>) => {
    await firebaseService.updateCustomer(id, c);
    setCustomers(customers.map(item => item.id === id ? { ...item, ...c } : item));
  };

  const handleDeleteCustomer = async (id: string) => {
    await firebaseService.deleteCustomer(id);
    setCustomers(customers.filter(c => c.id !== id));
  };

  const handleDeleteTransaction = async (id: string) => {
    await firebaseService.deleteTransaction(id);
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  const handleFinishSale = async (t: Omit<Transaction, 'id'>) => {
    const newTransaction = await firebaseService.addTransaction(t);
    setTransactions([newTransaction, ...transactions]);
    
    // Also update customer last purchase and total spent
    const customer = customers.find(c => c.name === t.client);
    if (customer) {
      const updates = { 
        totalSpent: customer.totalSpent + t.value,
        lastPurchase: t.date
      };
      await firebaseService.updateCustomer(customer.id, updates);
      setCustomers(customers.map(c => c.id === customer.id ? { ...c, ...updates } : c));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary text-4xl"
        >
          ⌛
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Samuel Store</h1>
          <p className="text-on-surface-variant max-w-sm">Acesse sua plataforma de gestão integrada.</p>
        </div>
        <button 
          onClick={handleLogin}
          className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-primary/20 selection:text-primary">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <TopBar />
      
      <main className="ml-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && (
                <DashboardView 
                  transactions={transactions} 
                  products={products} 
                  onViewChange={setCurrentView} 
                />
              )}
              {currentView === 'inventory' && (
                <InventoryView 
                  products={products} 
                  onAddProduct={handleAddProduct} 
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}
              {currentView === 'customers' && (
                <CustomersView 
                  customers={customers} 
                  onAddCustomer={handleAddCustomer} 
                  onUpdateCustomer={handleUpdateCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                />
              )}
              {currentView === 'pos' && (
                <POSView 
                  products={products} 
                  customers={customers} 
                  onFinishSale={handleFinishSale}
                  onUpdateProductStock={handleUpdateProductStock}
                />
              )}
              {currentView === 'transactions' && (
                <TransactionsView 
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              )}
              {currentView === 'settings' && (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
                  <div className="p-6 bg-surface-container rounded-full text-primary">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      ⚙️
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Em Desenvolvimento</h2>
                    <p className="text-on-surface-variant max-w-sm">Estamos preparando o módulo de Configurações.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
