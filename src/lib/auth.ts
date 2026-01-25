// Funzione per validare le credenziali tramite API
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
}
