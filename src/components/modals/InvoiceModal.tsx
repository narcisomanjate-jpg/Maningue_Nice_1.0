import React from 'react';
import { X, Download, Send, Share2, Printer } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

interface InvoiceModalProps {
  client: any;
  archiveData: any;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ client, archiveData, onClose }) => {
  const { isDark, selectedClient } = useApp();

  const handleDownloadPDF = async () => {
    try {
      const { generateInvoicePDF } = await import('../../utils/pdfUtils');
      const res = await generateInvoicePDF(client, archiveData, {
        currency: 'MZN',
        uiConfig: { primaryColor: '#0066cc' },
        theme: isDark ? 'dark' : 'light'
      } as any);
      
      if (res.success) {
        alert('✅ PDF gerado e baixado com sucesso!');
        onClose();
      } else {
        alert('❌ Erro ao gerar PDF: ' + (res.error || 'Desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('❌ Erro ao gerar PDF');
    }
  };

  const handleSendViaSMS = async () => {
    if (!selectedClient?.phone) {
      alert('❌ Nenhum número de telefone disponível');
      return;
    }

    try {
      // Gerar texto do extrato
      const { generateStatementText } = await import('../../utils/pdfUtils');
      const statement = generateStatementText(client, {
        currency: 'MZN',
        uiConfig: { primaryColor: '#0066cc' },
        theme: isDark ? 'dark' : 'light'
      } as any);

      // Criar mensagem
      const message = encodeURIComponent(
        `📄 EXTRATO DE CONTA - Fatura Nº ${archiveData.invoiceNumber}\n\n${statement}`
      );
      const whatsappUrl = `https://wa.me/${selectedClient.phone.replace(/\D/g, '')}?text=${message}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
      alert('✅ Abrindo WhatsApp para enviar extrato...');
      onClose();
    } catch (error) {
      console.error('Erro ao preparar SMS:', error);
      alert('❌ Erro ao preparar mensagem');
    }
  };

  const handlePrint = async () => {
    try {
      const { generateInvoicePDF } = await import('../../utils/pdfUtils');
      const res = await generateInvoicePDF(client, archiveData, {
        currency: 'MZN',
        uiConfig: { primaryColor: '#0066cc' },
        theme: isDark ? 'dark' : 'light'
      } as any);
      
      if (res.success) {
        alert('✅ PDF gerado! Abra o ficheiro transferido para imprimir.');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao gerar PDF para impressão:', error);
      alert('❌ Erro ao gerar PDF');
    }
  };

  // Calcular totais
  let totalInflow = 0;
  let totalOutflow = 0;
  archiveData.transactions.forEach((tx: any) => {
    if (tx.type === 'Inflow') {
      totalInflow += tx.amount;
    } else {
      totalOutflow += tx.amount;
    }
  });
  const saldoFinal = totalOutflow - totalInflow;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'} w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-700/30">
          <div>
            <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-blue-900'}`}>
              Fatura {archiveData.invoiceNumber}
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {new Date(archiveData.dateClosed).toLocaleDateString('pt-MZ')}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Informações do Cliente */}
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Cliente</h4>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{client.name}</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{client.phone}</p>
          </div>

          {/* Tabela de Transações */}
          <div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Transações</h4>
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                <thead>
                  <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <th className="text-left p-2 font-bold">Data</th>
                    <th className="text-left p-2 font-bold">Descrição</th>
                    <th className="text-left p-2 font-bold">Método</th>
                    <th className="text-left p-2 font-bold">Tipo</th>
                    <th className="text-right p-2 font-bold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {archiveData.transactions.map((tx: any, idx: number) => (
                    <tr key={idx} className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                      <td className="p-2 text-xs">{new Date(tx.date).toLocaleDateString('pt-MZ')}</td>
                      <td className="p-2 text-xs">{tx.description || tx.type}</td>
                      <td className="p-2 text-xs">{tx.method}</td>
                      <td className="p-2 text-xs">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold ${tx.type === 'Inflow' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {tx.type === 'Inflow' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className={`p-2 text-xs text-right font-bold ${tx.type === 'Inflow' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'Inflow' ? '+' : '-'}{tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumo */}
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/40' : 'bg-slate-50'} space-y-3`}>
            <div className="flex justify-between items-center">
              <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total de Saídas:</span>
              <span className="font-bold text-red-500">{totalOutflow.toLocaleString()} MZN</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total de Entradas:</span>
              <span className="font-bold text-green-500">{totalInflow.toLocaleString()} MZN</span>
            </div>
            <div className={`flex justify-between items-center pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <span className="font-black text-lg">SALDO FINAL:</span>
              <span className="font-black text-lg text-blue-600">{saldoFinal.toLocaleString()} MZN</span>
            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className={`p-6 border-t ${isDark ? 'border-slate-700/30 bg-slate-800/20' : 'border-slate-100 bg-slate-50'} grid grid-cols-3 gap-3`}>
          <button
            onClick={handleDownloadPDF}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-colors active:scale-95"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={handleSendViaSMS}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-sm transition-colors active:scale-95"
          >
            <Send className="w-5 h-5" />
            Enviar SMS
          </button>
          <button
            onClick={handlePrint}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-sm transition-colors active:scale-95"
          >
            <Printer className="w-5 h-5" />
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
