'use client';

import { BollettaData, AnalysisResult } from '@/types/bolletta';
import { CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

interface ResultsTableProps {
  results: AnalysisResult[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const successResults = results.filter((r) => r.success && r.data && r.data.length > 0);
  const errorResults = results.filter((r) => !r.success);

  // Flatten all bollette from successful results
  const allBollette: BollettaData[] = successResults.flatMap((r) => r.data || []);

  // Count files processed vs bollette found
  const filesProcessed = successResults.length;
  const totalBollette = allBollette.length;

  if (results.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl flex-wrap">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-700">
            <strong>{filesProcessed}</strong> file analizzati
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-700">
            <strong>{totalBollette}</strong> bollette estratte
          </span>
        </div>
        {errorResults.length > 0 && (
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-700">
              <strong>{errorResults.length}</strong> errori
            </span>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errorResults.length > 0 && (
        <div className="space-y-2">
          {errorResults.map((result, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{result.fileName}</p>
                <p className="text-sm text-red-600">{result.error}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Table */}
      {allBollette.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipologia
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Denominazione
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Indirizzo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contatore
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Consumo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Periodo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allBollette.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        data.tipologia_utenza === 'GAS'
                          ? 'bg-orange-100 text-orange-800'
                          : data.tipologia_utenza === 'LUCE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : data.tipologia_utenza === 'TELEFONIA'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {data.tipologia_utenza}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {data.denominazione_immobile}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {data.indirizzo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {data.contatore}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {data.consumo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {data.periodo_riferimento}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {data.costo}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[150px] truncate" title={data.file_origine}>
                    {data.file_origine}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
