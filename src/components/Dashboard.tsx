'use client';

import { useState } from 'react';
import Header from './Header';
import FileUpload from './FileUpload';
import ModelSelector from './ModelSelector';
import ResultsTable from './ResultsTable';
import { LLMModelKey } from '@/lib/constants';
import { AnalysisResult, BollettaData } from '@/types/bolletta';
import { downloadExcel } from '@/lib/excelExport';
import { Play, Download, Loader2, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<LLMModelKey>('haiku');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [currentFile, setCurrentFile] = useState<string>('');

  const analyzeFiles = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    setResults([]);
    const analysisResults: AnalysisResult[] = [];

    for (const file of files) {
      setCurrentFile(file.name);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', selectedModel);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        analysisResults.push(result);
      } catch (error) {
        analysisResults.push({
          success: false,
          error: error instanceof Error ? error.message : 'Errore sconosciuto',
          fileName: file.name,
        });
      }
    }

    setResults(analysisResults);
    setIsAnalyzing(false);
    setCurrentFile('');
  };

  const handleExport = () => {
    // Flatten all bollette from all successful results
    const allBollette: BollettaData[] = results
      .filter((r) => r.success && r.data && r.data.length > 0)
      .flatMap((r) => r.data as BollettaData[]);

    if (allBollette.length > 0) {
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadExcel(allBollette, `bollette_${timestamp}.xlsx`);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setCurrentFile('');
  };

  // Count total bollette extracted (not files)
  const totalBollette = results
    .filter((r) => r.success && r.data)
    .reduce((sum, r) => sum + (r.data?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Intro */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Analizza le tue Bollette
            </h2>
            <p className="text-gray-600 mt-2">
              Carica da 1 a 5 PDF ed esporta i dati in Excel (ogni PDF può contenere più bollette)
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <FileUpload files={files} setFiles={setFiles} maxFiles={5} />
          </div>

          {/* Model Selector */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <ModelSelector
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={analyzeFiles}
              disabled={files.length === 0 || isAnalyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                files.length === 0 || isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizzando {currentFile}...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Analizza Bollette
                </>
              )}
            </button>

            {totalBollette > 0 && (
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  Esporta Excel ({totalBollette})
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Nuova Analisi
                </button>
              </>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Risultati Analisi
              </h3>
              <ResultsTable results={results} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        Bollette Analyzer - Powered by Claude AI
      </footer>
    </div>
  );
}
