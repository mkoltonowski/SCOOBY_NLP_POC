// chat.service.ts
import { Injectable } from '@nestjs/common';
import { env, pipeline } from '@huggingface/transformers';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class ChatService {
  private extractorPromise: any;
  constructor(private readonly store: VectorStoreService) {}

  async onModuleInit() {
    env.cacheDir = './models';
    this.extractorPromise = pipeline(
      'feature-extraction',
      'Xenova/e5-large-v2',
    );

    await this.store.load();
  }

  async ask(question: string) {
    const extractor = await this.extractorPromise;
    const qVec = (
      await extractor(question, { pooling: 'mean', normalize: true })
    ).tolist()[0] as number[];

    const hits = this.store.search(qVec, 4);
    const context = hits
      .map((h, i) => `### Fragment ${i + 1}\n${JSON.stringify(h.text)}`)
      .join('\n\n');

    console.log(context);
    const messages = [
      {
        role: 'system',
        content:
          'Respond only to questions regarding the context, only in polish. Before responding always mention the series title',
      },
      { role: 'system', content: context },
      { role: 'user', content: question },
    ];

    const rsp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemma-3-1b-it:free',
        messages,
        temperature: 0.7,
      }),
    }).then((r) => r.json());

    return rsp.choices[0].message.content as string;
  }
}
