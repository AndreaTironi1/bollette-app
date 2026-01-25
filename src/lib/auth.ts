// Credenziali di autenticazione
export const AUTH_CREDENTIALS = {
  username: 'UtenteBollette',
  password: 'Bollette2026!@'
};

export function validateCredentials(username: string, password: string): boolean {
  return username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password;
}
