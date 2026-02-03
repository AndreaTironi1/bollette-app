import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LLM_MODELS, LLMModelKey } from '@/lib/constants';
import { BollettaData, TokenUsage } from '@/types/bolletta';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const EXTRACTION_PROMPT = `Analizza questo documento PDF e estrai TUTTE le bollette presenti.
Un PDF può contenere una o più bollette. Estrai i dati di OGNI bolletta trovata.

Rispondi SOLO con un array JSON valido, senza altri testi o spiegazioni.
Se c'è una sola bolletta, restituisci comunque un array con un elemento.

L'array deve contenere oggetti con questa struttura:
[
  {
    "tipologia_utenza": "GAS" | "LUCE" | "ACQUA" | "TELEFONIA" | "ALTRO",
    "denominazione_immobile": "nome dell'immobile o intestatario",
    "indirizzo": "via e numero civico completo",
    "contatore": "codice/numero contatore o POD/PDR",
    "consumo": "consumo con unità di misura (es: 150 kWh, 200 Smc)",
    "periodo_riferimento": "periodo in formato ANNO/MESE o range date",
    "costo": "importo totale in euro (es: 125,50)"
  }
]

Se un campo non è presente o non è chiaro, usa "N/D" (Non Disponibile).
Per tipologia_utenza:
- GAS: bollette gas metano, GPL
- LUCE: bollette elettricità, energia elettrica
- ACQUA: bollette acquedotto, servizio idrico
- TELEFONIA: bollette telefono fisso, mobile, internet
- ALTRO: rifiuti, altri servizi

IMPORTANTE: Se il documento contiene più bollette (es. riepilogo mensile, bollette multiple), estraile TUTTE come elementi separati dell'array.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const model = formData.get('model') as LLMModelKey;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nessun file fornito' },
        { status: 400 }
      );
    }

    if (!model || !LLM_MODELS[model]) {
      return NextResponse.json(
        { success: false, error: 'Modello non valido' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Call Anthropic API with PDF
    const response = await anthropic.messages.create({
      model: LLM_MODELS[model],
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            },
            {
              type: 'text',
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    // Extract token usage
    const tokenUsage: TokenUsage = {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    };

    // Extract text response
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'Risposta non valida dal modello', fileName: file.name, tokenUsage },
        { status: 500 }
      );
    }

    // Parse JSON response
    let extractedData: BollettaData[];
    try {
      // Try to extract JSON from the response (handle potential markdown code blocks)
      let jsonText = textContent.text;
      const jsonMatch = jsonText.match(/```json?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      const parsed = JSON.parse(jsonText.trim());

      // Ensure it's an array
      extractedData = Array.isArray(parsed) ? parsed : [parsed];

      // Add file origin to each bolletta
      extractedData = extractedData.map((bolletta) => ({
        ...bolletta,
        file_origine: file.name
      }));
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Impossibile interpretare la risposta del modello',
          fileName: file.name,
          tokenUsage,
          rawResponse: textContent.text
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      fileName: file.name,
      tokenUsage,
    });

  } catch (error) {
    console.error('Error analyzing PDF:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Errore durante l\'analisi',
        fileName: 'unknown'
      },
      { status: 500 }
    );
  }
}
