import { NextResponse } from 'next/server';
import { parsePDF } from '../../../utils/parsePDF';
import { Configuration, OpenAIApi } from 'openai';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = await parsePDF(buffer);

    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);

    const gptPrompt = `Improve this resume:\n\n${rawText}\n\nProvide a revised version and list of suggestions.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: gptPrompt }],
    });

    const output = response.data.choices[0].message?.content || '';
    const [improved, ...suggestionList] = output.split('Suggestions:');

    return NextResponse.json({ original: rawText, improved, suggestions: suggestionList.join('Suggestions:') });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
