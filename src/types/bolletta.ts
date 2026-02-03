export interface BollettaData {
  tipologia_utenza: 'GAS' | 'LUCE' | 'ACQUA' | 'TELEFONIA' | 'ALTRO';
  denominazione_immobile: string;
  indirizzo: string;
  contatore: string;
  consumo: string;
  periodo_riferimento: string;
  costo: string;
  file_origine: string;
}

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface AnalysisResult {
  success: boolean;
  data?: BollettaData[];
  error?: string;
  fileName: string;
  tokenUsage?: TokenUsage;
}
