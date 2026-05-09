import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  setDoc,
  getDocFromServer
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { Product, Customer, Transaction } from '../types';

export const firebaseService = {
  // Products
  async getProducts(): Promise<Product[]> {
    const path = 'products';
    try {
      const q = query(collection(db, path), orderBy('name'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const path = 'products';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...product,
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...product } as Product;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const path = `products/${id}`;
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteProduct(id: string): Promise<void> {
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const path = 'customers';
    try {
      const q = query(collection(db, path), orderBy('name'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const path = 'customers';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...customer,
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...customer } as Customer;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    const path = `customers/${id}`;
    try {
      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    const path = `customers/${id}`;
    try {
      await deleteDoc(doc(db, 'customers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const path = 'transactions';
    try {
      const q = query(collection(db, path), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const path = 'transactions';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...transaction,
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...transaction } as Transaction;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    const path = `transactions/${id}`;
    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    const path = `transactions/${id}`;
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Test connection as required by constraints
  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
};
