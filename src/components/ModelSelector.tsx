'use client';

import { LLM_MODELS, LLMModelKey } from '@/lib/constants';
import { Cpu } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: LLMModelKey;
  setSelectedModel: (model: LLMModelKey) => void;
}

const modelDescriptions: Record<LLMModelKey, { name: string; description: string; speed: string }> = {
  haiku: {
    name: 'Claude Haiku',
    description: 'Veloce ed economico',
    speed: 'Velocissimo'
  },
  sonnet: {
    name: 'Claude Sonnet',
    description: 'Bilanciato',
    speed: 'Veloce'
  },
  opus: {
    name: 'Claude Opus',
    description: 'Massima precisione',
    speed: 'Standard'
  }
};

export default function ModelSelector({ selectedModel, setSelectedModel }: ModelSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-medium text-gray-700">Seleziona Modello LLM</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(LLM_MODELS) as LLMModelKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedModel(key)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedModel === key
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-semibold text-gray-800">
              {modelDescriptions[key].name}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {modelDescriptions[key].description}
            </div>
            <div className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
              key === 'haiku' ? 'bg-green-100 text-green-700' :
              key === 'sonnet' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {modelDescriptions[key].speed}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
