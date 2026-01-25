import * as XLSX from 'xlsx';
import { BollettaData } from '@/types/bolletta';

export function generateExcel(data: BollettaData[]): Blob {
  // Define headers matching the required columns
  const headers = [
    'TIPOLOGIA UTENZA',
    'DENOMINAZIONE IMMOBILE',
    'INDIRIZZO - VIA E NUMERO CIVICO',
    'CONTATORE',
    'CONSUMO',
    'PERIODO DI RIFERIMENTO - ANNO / MESE',
    'COSTO',
    'FILE ORIGINE'
  ];

  // Transform data to array format
  const rows = data.map((item) => [
    item.tipologia_utenza,
    item.denominazione_immobile,
    item.indirizzo,
    item.contatore,
    item.consumo,
    item.periodo_riferimento,
    item.costo,
    item.file_origine
  ]);

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 18 },  // TIPOLOGIA UTENZA
    { wch: 25 },  // DENOMINAZIONE IMMOBILE
    { wch: 35 },  // INDIRIZZO
    { wch: 20 },  // CONTATORE
    { wch: 15 },  // CONSUMO
    { wch: 30 },  // PERIODO DI RIFERIMENTO
    { wch: 12 },  // COSTO
    { wch: 30 },  // FILE ORIGINE
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bollette');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create Blob
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

export function downloadExcel(data: BollettaData[], filename: string = 'bollette_export.xlsx') {
  const blob = generateExcel(data);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
