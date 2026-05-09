export interface Transaction {
  id: string;
  client: string;
  clientInitial: string;
  date: string;
  product: string;
  value: number;
  status: 'Finalizada' | 'Pendente' | 'Cancelada';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
  totalSpent: number;
  lastPurchase: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Em Estoque' | 'Estoque Baixo' | 'Esgotado' | 'Estoque Alto';
  image: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  type: 'up' | 'down' | 'neutral';
  icon: string;
  colorClass: string;
}
