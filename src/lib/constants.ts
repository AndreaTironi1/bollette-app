export const APP_VERSION = '1.1.0';

export const LLM_MODELS = {
  haiku: 'claude-haiku-4-5',
  sonnet: 'claude-sonnet-4-5',
  opus: 'claude-opus-4-5'
} as const;

export type LLMModelKey = keyof typeof LLM_MODELS;
