# Bollette Analyzer

Applicazione web per analizzare bollette di gas, luce, telefonia e altro, estraendo automaticamente i dati e esportandoli in formato Excel.

## Funzionalita

- **Upload PDF**: Carica da 1 a 5 bollette in formato PDF
- **Analisi AI**: Utilizza Claude AI (Haiku, Sonnet, Opus) per estrarre i dati
- **Export Excel**: Esporta i dati estratti in un file .xlsx

## Dati Estratti

| Campo | Descrizione |
|-------|-------------|
| Tipologia Utenza | GAS / LUCE / TELEFONIA / ALTRO |
| Denominazione Immobile | Nome dell'immobile o intestatario |
| Indirizzo | Via e Numero Civico |
| Contatore | Codice contatore, POD o PDR |
| Consumo | Consumo con unita di misura |
| Periodo di Riferimento | Anno / Mese |
| Costo | Importo totale in euro |

## Tecnologie

- Next.js 16
- TypeScript
- Tailwind CSS
- Anthropic Claude API
- XLSX per export Excel
- Lucide React per le icone

## Installazione Locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Deploy su Vercel

1. Collegare il repository GitHub a Vercel
2. Deploy automatico ad ogni push

## Credenziali di Accesso

- **Username**: `UtenteBollette`
- **Password**: `Bollette2026!@`

## Versione

**v1.0.0**
