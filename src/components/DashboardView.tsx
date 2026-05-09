import { useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, ShoppingBag, Calendar, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MetricCard from './MetricCard';
import { WEEKLY_SALES, FUNNEL_DATA } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Transaction, Product } from '../types';

interface DashboardViewProps {
  transactions: Transaction[];
  products: Product[];
  onViewChange: (view: string) => void;
}

export default function DashboardView({ transactions, products, onViewChange }: DashboardViewProps) {
  const { language, t } = useLanguage();

  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    });
  };

  const metrics = useMemo(() => {
    const totalRevenue = transactions.reduce((acc, tx) => acc + tx.value, 0);
    const avgTicket = transactions.length > 0 ? totalRevenue / transactions.length : 0;
    return {
      totalRevenue,
      avgTicket,
      totalSales: transactions.length,
    };
  }, [transactions]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    transactions.forEach(tx => {
      const product = products.find(p => p.name === tx.product);
      const cat = product?.category || 'Outros';
      stats[cat] = (stats[cat] || 0) + tx.value;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [transactions, products]);

  const COLORS = ['#00288e', '#006c49', '#611e00', '#ba1a1a', '#757684'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.title}</h2>
          <p className="text-on-surface-variant text-sm">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface font-bold text-xs rounded-lg hover:bg-surface-container transition-colors">
            <Calendar size={16} />
            {t.dashboard.last30Days}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface font-bold text-xs rounded-lg hover:bg-surface-container transition-colors">
            <Download size={16} />
            {t.dashboard.export}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label={t.dashboard.totalRevenue}
          value={formatCurrency(metrics.totalRevenue)}
          change={12.5}
          changeType="up"
          icon={DollarSign}
          colorClass="bg-secondary-container/20 text-secondary"
          progress={75}
        />
        <MetricCard
          label={t.dashboard.avgTicket}
          value={formatCurrency(metrics.avgTicket)}
          change={2.3}
          changeType="up"
          icon={TrendingUp}
          colorClass="bg-primary-container/20 text-primary"
          progress={50}
        />
        <MetricCard
          label={t.dashboard.totalSales}
          value={metrics.totalSales.toString()}
          change={1.4}
          changeType="down"
          icon={ShoppingBag}
          colorClass="bg-error-container/20 text-error"
          progress={65}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">{t.dashboard.weeklySales}</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full bg-primary" /> {t.dashboard.thisWeek}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full bg-outline-variant" /> {t.dashboard.lastWeek}
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_SALES}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#6B7280' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 40, 142, 0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="thisWeek" fill="#00288e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lastWeek" fill="#c4c5d5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
          <h3 className="font-bold text-lg mb-8">{t.dashboard.salesFunnel}</h3>
          <div className="space-y-4">
            {FUNNEL_DATA.map((item, idx) => (
              <div key={item.label} className="relative">
                <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider opacity-70">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className={`h-10 w-full origin-left ${item.color} rounded-lg shadow-sm`}
                  style={{ width: `${100 - idx * 10}%`, marginLeft: `${idx * 5}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-bold text-lg">{t.dashboard.recentTransactions}</h3>
            <button 
              onClick={() => onViewChange('transactions')}
              className="text-primary font-bold text-xs uppercase tracking-wider hover:underline"
            >
              {t.dashboard.viewAll}
            </button>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.dashboard.customer}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.dashboard.date}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.product}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.price}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.inventory.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-primary-container/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-primary text-xs">
                          {tx.clientInitial}
                        </div>
                        <span className="text-sm font-medium">{tx.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{tx.date}</td>
                    <td className="px-6 py-4 text-sm font-medium">{tx.product}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">{formatCurrency(tx.value)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'Finalizada' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {tx.status === 'Finalizada' ? t.status.completed : t.status.pending}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center">
            <h3 className="font-bold text-lg mb-8 self-start">{t.reports.salesByCategory}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-center">
              {categoryStats.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{entry.name}</span>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
