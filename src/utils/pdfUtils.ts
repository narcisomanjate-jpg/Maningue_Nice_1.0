	//	Funções para gerar PDFs

import { Client, AppSettings, Transaction } from '../types';

// Gerar PDF da fatura
export const generateInvoicePDF = async (
  client: Client, 
  archiveData: any, 
  settings: AppSettings
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Criar um elemento temporário para o preview
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return { 
        success: false, 
        error: 'Por favor, permita pop-ups para gerar a fatura.' 
      };
    }

    // Formatar data
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-MZ');
    };

    // Calcular totais
    let totalInflow = 0;
    let totalOutflow = 0;
    archiveData.transactions.forEach((tx: Transaction) => {
      if (tx.type === 'Inflow') {
        totalInflow += tx.amount;
      } else {
        totalOutflow += tx.amount;
      }
    });

    const saldoFinal = totalOutflow - totalInflow;

    // HTML para o preview
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fatura ${archiveData.invoiceNumber}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background: #f8fafc;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 30px;
            position: relative;
            overflow: hidden;
          }
          .header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100px;
            height: 4px;
            background: ${settings.uiConfig.primaryColor};
            border-radius: 2px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 5px;
          }
          .invoice-number {
            font-size: 18px;
            color: ${settings.uiConfig.primaryColor};
            font-weight: 700;
          }
          .client-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
          }
          .client-name {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 5px;
          }
          .client-phone {
            color: #64748b;
            font-size: 14px;
          }
          .transaction-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .transaction-table th {
            background: #f1f5f9;
            padding: 12px 15px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .transaction-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
          }
          .transaction-table tr:last-child td {
            border-bottom: none;
          }
          .transaction-type {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 6px;
            display: inline-block;
          }
          .inflow { background: #dcfce7; color: #166534; }
          .outflow { background: #fee2e2; color: #991b1b; }
          .amount {
            font-weight: 700;
            font-size: 14px;
          }
          .total-section {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            padding: 25px;
            border-radius: 12px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .final-total {
            font-size: 22px;
            font-weight: 800;
            color: ${settings.uiConfig.primaryColor};
            border-top: 2px dashed #cbd5e1;
            padding-top: 15px;
            margin-top: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            color: #94a3b8;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          @media print {
            body { background: white; }
            .invoice-container { box-shadow: none; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="invoice-title">FATURA DE LIQUIDAÇÃO</div>
            <div class="invoice-number">${archiveData.invoiceNumber}</div>
            <div style="color: #64748b; margin-top: 10px;">
              Data: ${formatDate(archiveData.dateClosed)}
            </div>
          </div>

          <div class="client-info">
            <div class="client-name">${client.name}</div>
            <div class="client-phone">${client.phone}</div>
          </div>

          <table class="transaction-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Descrição</th>
                <th>Método</th>
                <th>Tipo</th>
                <th style="text-align: right;">Valor (${settings.currency})</th>
              </tr>
            </thead>
            <tbody>
              ${archiveData.transactions.map((tx: Transaction) => `
                <tr>
                  <td>
                    <div>${formatDate(tx.date)}</div>
                    <small style="color: #94a3b8;">${new Date(tx.date).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}</small>
                  </td>
                  <td>${tx.description || tx.type}</td>
                  <td>${tx.method}</td>
                  <td>
                    <span class="transaction-type ${tx.type.toLowerCase()}">${tx.type === 'Inflow' ? 'Entrada' : 'Saída'}</span>
                  </td>
                  <td style="text-align: right;">
                    <span class="amount ${tx.type === 'Inflow' ? 'inflow' : 'outflow'}" style="color: ${tx.type === 'Inflow' ? '#166534' : '#991b1b'};">
                      ${tx.type === 'Inflow' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Total de Saídas:</span>
              <span style="font-weight: 700; color: #991b1b;">${totalOutflow.toLocaleString()} ${settings.currency}</span>
            </div>
            <div class="total-row">
              <span>Total de Entradas:</span>
              <span style="font-weight: 700; color: #166534;">${totalInflow.toLocaleString()} ${settings.currency}</span>
            </div>
            <div class="total-row final-total">
              <span>SALDO FINAL:</span>
              <span>${saldoFinal.toLocaleString()} ${settings.currency}</span>
            </div>
          </div>

          <div class="footer">
            <p>Super Agente • Fatura gerada automaticamente</p>
            <p>Data de impressão: ${new Date().toLocaleDateString('pt-MZ')}</p>
            <button class="no-print" onclick="window.print()" style="
              background: ${settings.uiConfig.primaryColor};
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 700;
              cursor: pointer;
              margin-top: 15px;
            ">Imprimir/Guardar como PDF</button>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao gerar fatura:', error);
    return { success: false, error: error.message };
  }
};

// Gerar extrato em texto
export const generateStatementText = (
  client: Client,
  settings: AppSettings
): string => {
  let statement = `Extrato de ${client.name}:\n\n`;
  
  client.activeAccount.forEach((tx, index) => {
    const date = new Date(tx.date).toLocaleDateString('pt-MZ');
    const time = new Date(tx.date).toLocaleTimeString('pt-MZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const type = tx.type === 'Inflow' ? 'Entrada' : 'Saída';
    const sign = tx.type === 'Inflow' ? '+' : '-';
    
    statement += `${index + 1}. ${date} ${time} - ${tx.description || type}\n`;
    statement += `   ${sign}${tx.amount.toLocaleString()} ${settings.currency} (${tx.method})\n\n`;
  });
  
  // Calcular saldo
  const totalBalance = client.activeAccount.reduce((acc, curr) => 
    curr.type === 'Inflow' ? acc - curr.amount : acc + curr.amount, 
    0
  );
  
  statement += `\nSALDO ATUAL: ${totalBalance.toLocaleString()} ${settings.currency}`;
  
  return statement;
};

// Gerar relatório de transações
export const generateTransactionReport = (
  transactions: Transaction[],
  title: string = 'Relatório de Transações'
): string => {
  let report = `${title}\n\n`;
  let totalInflow = 0;
  let totalOutflow = 0;
  
  transactions.forEach((tx, index) => {
    const date = new Date(tx.date).toLocaleDateString('pt-MZ');
    const time = new Date(tx.date).toLocaleTimeString('pt-MZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    report += `${index + 1}. ${date} ${time}\n`;
    report += `   ${tx.description || tx.type}\n`;
    report += `   ${tx.type === 'Inflow' ? '+' : '-'}${tx.amount.toLocaleString()} (${tx.method})\n\n`;
    
    if (tx.type === 'Inflow') {
      totalInflow += tx.amount;
    } else {
      totalOutflow += tx.amount;
    }
  });
  
  report += `\nRESUMO:\n`;
  report += `Total de Entradas: ${totalInflow.toLocaleString()}\n`;
  report += `Total de Saídas: ${totalOutflow.toLocaleString()}\n`;
  report += `Saldo Final: ${(totalOutflow - totalInflow).toLocaleString()}\n`;
  
  return report;
};