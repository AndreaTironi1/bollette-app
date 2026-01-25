export const APP_VERSION = '1.0.0';

export const LLM_MODELS = {
  haiku: 'claude-3-5-haiku-latest',
  sonnet: 'claude-sonnet-4-20250514',
  opus: 'claude-opus-4-20250514'
} as const;

export type LLMModelKey = keyof typeof LLM_MODELS;
