-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  total_spent DECIMAL(12, 2) DEFAULT 0.00,
  last_purchase TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_initial TEXT,
  product_name TEXT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for demo purposes, but in production these should be restricted)
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON transactions FOR SELECT USING (true);

-- Create authenticated policies (Assuming manager access)
CREATE POLICY "Allow manager full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Allow manager full access to customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow manager full access to transactions" ON transactions FOR ALL USING (true);
