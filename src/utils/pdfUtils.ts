	// PDF Utilities com jsPDF
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Client, AppSettings, Transaction } from '../types';

/**
 * Gerar PDF da fatura de liquidação
 */
export const generateInvoicePDF = async (
  client: Client,
  archiveData: any,
  settings: AppSettings
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Criar elemento temporário para renderizar
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.height = '297mm';
    container.style.backgroundColor = 'white';
    container.style.zIndex = '-9999';
    container.style.padding = '20mm';
    
    // Formatar data
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-MZ', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
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

    // HTML profissional para o PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
            color: #1a1a1a;
            line-height: 1.6;
          }
          .invoice-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            border-bottom: 3px solid #0066cc;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: 900;
            color: #0066cc;
            margin-bottom: 5px;
          }
          .invoice-title {
            font-size: 16px;
            font-weight: 700;
            color: #333;
            margin-bottom: 3px;
          }
          .invoice-number {
            font-size: 13px;
            color: #0066cc;
            font-weight: 700;
          }
          .invoice-date {
            font-size: 12px;
            color: #666;
            margin-top: 3px;
          }
          .client-section {
            margin-bottom: 20px;
            background: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
          }
          .section-title {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 5px;
            letter-spacing: 1px;
          }
          .client-name {
            font-size: 14px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 3px;
          }
          .client-phone {
            font-size: 12px;
            color: #666;
          }
          .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 11px;
          }
          .transactions-table th {
            background-color: #0066cc;
            color: white;
            padding: 8px 5px;
            text-align: left;
            font-weight: 700;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .transactions-table td {
            padding: 8px 5px;
            border-bottom: 1px solid #ddd;
          }
          .transactions-table tr:last-child td {
            border-bottom: none;
          }
          .type-inflow {
            color: #008000;
            font-weight: 700;
            background-color: #f0f8f0;
            padding: 2px 4px;
            border-radius: 2px;
            text-transform: uppercase;
            font-size: 9px;
          }
          .type-outflow {
            color: #cc0000;
            font-weight: 700;
            background-color: #f8f0f0;
            padding: 2px 4px;
            border-radius: 2px;
            text-transform: uppercase;
            font-size: 9px;
          }
          .amount-inflow {
            color: #008000;
            font-weight: 700;
            text-align: right;
          }
          .amount-outflow {
            color: #cc0000;
            font-weight: 700;
            text-align: right;
          }
          .summary-section {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 15px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 12px;
          }
          .summary-row-label {
            font-weight: 600;
          }
          .summary-row-value {
            font-weight: 700;
            text-align: right;
            min-width: 80px;
          }
          .final-balance {
            display: flex;
            justify-content: space-between;
            padding-top: 8px;
            border-top: 2px solid #0066cc;
            font-size: 14px;
            font-weight: 900;
            color: #0066cc;
            margin-top: 8px;
          }
          .footer {
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
            font-size: 10px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div>
            <div class="header">
              <div class="company-name">SUPER AGENTE</div>
              <div class="invoice-title">EXTRATO DE CONTA - FATURA DE LIQUIDAÇÃO</div>
              <div class="invoice-number">Fatura Nº: ${archiveData.invoiceNumber}</div>
              <div class="invoice-date">Data: ${formatDate(archiveData.dateClosed)}</div>
            </div>

            <div class="client-section">
              <div class="section-title">Cliente</div>
              <div class="client-name">${client.name}</div>
              <div class="client-phone">${client.phone || 'N/A'}</div>
            </div>

            <div style="margin-bottom: 15px;">
              <div class="section-title">Transações</div>
              <table class="transactions-table">
                <thead>
                  <tr>
                    <th style="width: 12%;">Data</th>
                    <th style="width: 12%;">Hora</th>
                    <th style="width: 25%;">Descrição</th>
                    <th style="width: 15%;">Método</th>
                    <th style="width: 12%;">Tipo</th>
                    <th style="width: 14%; text-align: right;">Valor (${settings.currency})</th>
                  </tr>
                </thead>
                <tbody>
                  ${archiveData.transactions.map((tx: Transaction) => {
                    const date = new Date(tx.date);
                    return `
                      <tr>
                        <td>${date.toLocaleDateString('pt-MZ')}</td>
                        <td>${date.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>${tx.description || (tx.type === 'Inflow' ? 'Entrada' : 'Saída')}</td>
                        <td>${tx.method}</td>
                        <td><span class="type-${tx.type.toLowerCase()}">${tx.type === 'Inflow' ? 'Entrada' : 'Saída'}</span></td>
                        <td class="amount-${tx.type.toLowerCase()}">
                          ${tx.type === 'Inflow' ? '+' : '-'}${tx.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <div class="summary-section">
              <div class="summary-row">
                <span class="summary-row-label">Total de Saídas:</span>
                <span class="summary-row-value" style="color: #cc0000;">
                  ${totalOutflow.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${settings.currency}
                </span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label">Total de Entradas:</span>
                <span class="summary-row-value" style="color: #008000;">
                  ${totalInflow.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${settings.currency}
                </span>
              </div>
              <div class="final-balance">
                <span>SALDO FINAL:</span>
                <span>${saldoFinal.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${settings.currency}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Extrato gerado automaticamente pelo Super Agente</p>
            <p>Data: ${new Date().toLocaleDateString('pt-MZ')} às ${new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Adicionar ao DOM temporariamente
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // Converter para canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Remover do DOM
    document.body.removeChild(container);

    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Download do PDF
    const fileName = `Extrato_${client.name}_${archiveData.invoiceNumber}.pdf`;
    pdf.save(fileName);

    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao gerar PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Gerar relatório em PDF com múltiplas páginas
 */
export const generateStatementPDF = async (
  client: Client,
  settings: AppSettings
): Promise<{ success: boolean; error?: string }> => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let yPosition = 20;

    // Header
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('EXTRATO DE CONTA', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Cliente: ${client.name}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Telefone: ${client.phone || 'N/A'}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Data: ${new Date().toLocaleDateString('pt-MZ')}`, 20, yPosition);
    yPosition += 10;

    // Transações
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    
    client.activeAccount.forEach((tx, index) => {
      const date = new Date(tx.date).toLocaleDateString('pt-MZ');
      const time = new Date(tx.date).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' });
      const type = tx.type === 'Inflow' ? 'Entrada' : 'Saída';
      
      const line = `${index + 1}. ${date} ${time} - ${tx.description || type} - ${tx.type === 'Inflow' ? '+' : '-'}${tx.amount.toLocaleString()} ${settings.currency}`;
      
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(line, 20, yPosition, { maxWidth: 170 });
      yPosition += 6;
    });

    // Saldo final
    const totalBalance = client.activeAccount.reduce((acc, curr) => 
      curr.type === 'Inflow' ? acc - curr.amount : acc + curr.amount, 
      0
    );

    yPosition += 5;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 102, 204);
    pdf.text(`SALDO ATUAL: ${totalBalance.toLocaleString()} ${settings.currency}`, 20, yPosition);

    pdf.save(`Extrato_${client.name}.pdf`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao gerar extrato:', error);
    return { success: false, error: error.message };
  }
};


/**
 * Gerar extrato em texto (para SMS ou compartilhamento)
 */
export const generateStatementText = (
  client: Client,
  settings: AppSettings
): string => {
  let statement = `=== EXTRATO DE ${client.name} ===\n`;
  
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
  
  statement += `\n━━━━━━━━━━━━━━━━━━━━━━━\n`;
  statement += `SALDO ATUAL: ${totalBalance.toLocaleString()} ${settings.currency}`;
  
  return statement;
};

/**
 * Gerar relatório de transações
 */
export const generateTransactionReport = (
  transactions: Transaction[],
  title: string = 'Relatório de Transações'
): string => {
  let report = `${title}\n`;
  report += `${'='.repeat(title.length)}\n\n`;
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
  report += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
  report += `Total de Entradas: ${totalInflow.toLocaleString()}\n`;
  report += `Total de Saídas: ${totalOutflow.toLocaleString()}\n`;
  report += `Saldo Final: ${(totalOutflow - totalInflow).toLocaleString()}\n`;
  
  return report;
};