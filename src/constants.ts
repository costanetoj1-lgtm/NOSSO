import { Transaction, Product, Customer } from './types';

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    client: 'João Duarte',
    clientInitial: 'JD',
    date: 'Hoje, 14:30',
    product: 'Plano Enterprise Anual',
    value: 12400.00,
    status: 'Finalizada',
  },
  {
    id: '2',
    client: 'Maria Rocha',
    clientInitial: 'MR',
    date: 'Hoje, 12:15',
    product: 'Consultoria Premium',
    value: 5200.00,
    status: 'Pendente',
  },
  {
    id: '3',
    client: 'André Lima',
    clientInitial: 'AL',
    date: 'Ontem, 18:45',
    product: 'Upgrade de Armazenamento',
    value: 890.00,
    status: 'Finalizada',
  },
  {
    id: '4',
    client: 'Soraia Costa',
    clientInitial: 'SC',
    date: 'Ontem, 09:20',
    product: 'Licença Individual Pro',
    value: 2150.00,
    status: 'Finalizada',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy S24 Ultra',
    sku: 'PH-992384',
    category: 'Eletrônicos',
    price: 8499.00,
    stock: 45,
    status: 'Em Estoque',
    image: 'https://picsum.photos/seed/s24/100/100',
  },
  {
    id: '2',
    name: 'Teclado Mecânico PRO V2',
    sku: 'AC-223101',
    category: 'Acessórios',
    price: 1250.00,
    stock: 5,
    status: 'Estoque Baixo',
    image: 'https://picsum.photos/seed/keyboard/100/100',
  },
  {
    id: '3',
    name: 'Fone Noise Cancelling Z-1',
    sku: 'AU-110029',
    category: 'Acessórios',
    price: 2400.00,
    stock: 0,
    status: 'Esgotado',
    image: 'https://picsum.photos/seed/headphone/100/100',
  },
  {
    id: '4',
    name: 'Smart Hub Home Assistant',
    sku: 'SM-887411',
    category: 'Eletrônicos',
    price: 799.00,
    stock: 120,
    status: 'Em Estoque',
    image: 'https://picsum.photos/seed/smarthub/100/100',
  },
];

export const WEEKLY_SALES = [
  { name: 'SEG', thisWeek: 40, lastWeek: 24 },
  { name: 'TER', thisWeek: 30, lastWeek: 13 },
  { name: 'QUA', thisWeek: 20, lastWeek: 98 },
  { name: 'QUI', thisWeek: 27, lastWeek: 39 },
  { name: 'SEX', thisWeek: 18, lastWeek: 48 },
  { name: 'SAB', thisWeek: 23, lastWeek: 38 },
  { name: 'DOM', thisWeek: 34, lastWeek: 43 },
];

export const FUNNEL_DATA = [
  { label: 'Prospects', value: 450, color: 'bg-primary' },
  { label: 'Qualificados', value: 280, color: 'bg-primary/80' },
  { label: 'Proposta', value: 120, color: 'bg-primary/60' },
  { label: 'Negociação', value: 45, color: 'bg-primary/40' },
  { label: 'Fechado', value: 32, color: 'bg-primary/20' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'João Duarte',
    email: 'joao.duarte@email.com',
    phone: '(11) 98765-4321',
    status: 'Ativo',
    totalSpent: 15400.00,
    lastPurchase: 'Hoje, 14:30',
  },
  {
    id: '2',
    name: 'Maria Rocha',
    email: 'maria.rocha@email.com',
    phone: '(21) 99887-7665',
    status: 'Ativo',
    totalSpent: 5200.00,
    lastPurchase: 'Hoje, 12:15',
  },
  {
    id: '3',
    name: 'André Lima',
    email: 'andre.lima@email.com',
    phone: '(31) 97766-5544',
    status: 'Ativo',
    totalSpent: 890.00,
    lastPurchase: 'Ontem, 18:45',
  },
  {
    id: '4',
    name: 'Soraia Costa',
    email: 'soraia.costa@email.com',
    phone: '(41) 96655-4433',
    status: 'Inativo',
    totalSpent: 2150.00,
    lastPurchase: 'Ontem, 09:20',
  },
];
