	//	DashboardView.tsx

import React, { useMemo } from 'react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useApp } from '../../hooks/useApp';
import GlassCard from '../shared/GlassCard';
import { hexToRgba } from '../../utils/helpers';
import { 
  LayoutDashboard, 
  Wallet 
} from 'lucide-react';

const DashboardView: React.FC = () => {
  const { 
    isDark, 
    t, 
    user, 
    settings, 
    clients, 
    setView, 
    setSelectedClientId, 
    agentBalances, 
    setShowFloatModal 
  } = useApp();

  const chartData = useMemo(() => {
    const data = [];
    
    // Criar últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      let totalDoDia = 0;

      // Somar transações
      clients.forEach(client => {
        if (client.activeAccount && Array.isArray(client.activeAccount)) {
          client.activeAccount.forEach(tx => {
            const txDate = new Date(tx.date);
            txDate.setHours(0, 0, 0, 0);

            if (txDate.getTime() === d.getTime()) {
              const valor = Number(tx.amount) || 0;
              if (tx.type === 'Inflow') {
                totalDoDia += valor;
              } else {
                totalDoDia -= valor;
              }
            }
          });
        }
      });

      data.push({
        day: label,
        total: totalDoDia
      });
    }
    
    return data;
  }, [clients]);

  // Atividades recentes
  const getRecentActivities = useMemo(() => {
    const allActivities: Array<{
      client: any;
      transaction: any;
      clientId: string;
    }> = [];
    
    clients.forEach(client => {
      if (client.activeAccount && Array.isArray(client.activeAccount)) {
        client.activeAccount.forEach(transaction => {
          allActivities.push({
            client,
            transaction,
            clientId: client.id
          });
        });
      }
      
      if (client.archive && Array.isArray(client.archive)) {
        client.archive.forEach(archive => {
          archive.transactions.forEach(transaction => {
            allActivities.push({
              client,
              transaction,
              clientId: client.id
            });
          });
        });
      }
    });
    
    // Ordenar por data (mais recente primeiro)
    const sortedActivities = allActivities.sort((a, b) => {
      return new Date(b.transaction.date).getTime() - new Date(a.transaction.date).getTime();
    });
    
    return sortedActivities.slice(0, 10);
  }, [clients]);

  // Formatar data e hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  };

  const bgOpacity = settings.uiConfig.transparency;
  const primaryColor = settings.uiConfig.primaryColor;
  const gradientId = `gradient-${primaryColor.replace('#', '')}`;
  const PRESET_COLORS = ['#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#6366f1', '#a855f7', '#06b6d4', '#ec4899'];

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-start">
        <div className="max-w-[70%]">
          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.dash_greeting}, {user.name.split(' ')[0] || 'Agente'}
          </h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">
            {new Date().toLocaleDateString(settings.language === 'pt' ? 'pt-MZ' : 'en-US', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setShowFloatModal(true)}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-transparent shadow-sm`}
            style={{ 
              backgroundColor: hexToRgba(settings.uiConfig.primaryColor, 0.1), 
              color: settings.uiConfig.primaryColor 
            }}
          >
            <Wallet className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {settings.enabledAccounts.map((acc, idx) => {
          const balance = agentBalances[acc] || 0;
          const color = settings.accountColors[acc] || PRESET_COLORS[idx % PRESET_COLORS.length];
          return (
            <div 
              key={acc} 
              className={`p-4 md:p-5 rounded-[2rem] text-white shadow-xl relative overflow-hidden active:scale-95 transition-all min-h-[100px] flex flex-col justify-center`}
              style={{ backgroundColor: hexToRgba(color, bgOpacity) }}
            >
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold opacity-70 uppercase tracking-widest mb-1 truncate">
                {acc}
              </p>
              <p className="text-base md:text-lg font-black truncate">
                {balance.toLocaleString()} 
                <span className="text-[10px] font-medium opacity-50"> {settings.currency}</span>
              </p>
            </div>
          );
        })}
      </div>

      <GlassCard isDark={isDark} className="p-4 md:p-6">
        <h3 className={`font-extrabold text-[10px] md:text-sm uppercase tracking-widest mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.dash_chart_title}
        </h3>
        <div className="h-44 w-full relative" style={{ minHeight: '176px' }}>
          <ResponsiveContainer width="100%" height="100%" key={`chart-${isDark}-${settings.language}-${settings.uiConfig.primaryColor}`}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{
                  fill: isDark ? '#64748b' : '#94a3b8', 
                  fontSize: 10, 
                  fontWeight: 600
                }} 
                dy={10} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#fff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }} 
                itemStyle={{
                  color: settings.uiConfig.primaryColor, 
                  fontWeight: '800', 
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke={primaryColor} 
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                dot={{
                  r: 3, 
                  fill: primaryColor, 
                  strokeWidth: 2, 
                  stroke: isDark ? '#0f172a' : '#fff'
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <section className="space-y-4">
        <h3 className={`font-extrabold text-[10px] md:text-sm uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Atividades Recentes
        </h3>
        <div className="space-y-3">
          {getRecentActivities.length === 0 ? (
            <div className="py-10 text-center opacity-30 italic font-medium text-sm">
              Nenhuma atividade recente
            </div>
          ) : (
            getRecentActivities.map((activity, index) => (
              <div 
                key={`${activity.clientId}-${activity.transaction.id}-${index}`} 
                className={`p-4 rounded-3xl flex justify-between items-start cursor-pointer active:scale-[0.98] transition-all ${isDark ? 'bg-slate-800/40 hover:bg-slate-800/60' : 'bg-white hover:bg-slate-50'} shadow-sm border ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`} 
                onClick={() => { 
                  setSelectedClientId(activity.clientId); 
                  setView('client-detail'); 
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className={`font-extrabold text-sm md:text-base truncate mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activity.client.name}
                  </p>
                  
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                      {activity.transaction.description || activity.transaction.type}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className={`px-2 py-0.5 rounded-full ${activity.transaction.type === 'Inflow' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                        {activity.transaction.method}
                      </div>
                      <span>•</span>
                      <span>{formatDateTime(activity.transaction.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end ml-4 flex-shrink-0">
                  <p className={`font-black text-base md:text-lg ${activity.transaction.type === 'Inflow' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {activity.transaction.type === 'Inflow' ? '+' : '-'}{activity.transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {settings.currency}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;