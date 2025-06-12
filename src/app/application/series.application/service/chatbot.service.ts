// chat.service.ts
import { Injectable } from '@nestjs/common';
import { env, pipeline } from '@huggingface/transformers';
import { VectorStoreService } from './vector-store.service';
import { MessageDto } from '../../dtos/message.dto';

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

  getCurrentQuestionContent(questions: MessageDto[]) {
    return questions.at(-1).content;
  }

  async ask(questions: MessageDto[]) {
    const extractor = await this.extractorPromise;

    const currentMessage = this.getCurrentQuestionContent(questions);

    const qVec = (
      await extractor(currentMessage, { pooling: 'mean', normalize: true })
    ).tolist()[0] as number[];

    const hits = this.store.search(qVec, 4);
    const context = hits
      .map((h, i) => `### CONTEXT ${i} \n${JSON.stringify(h.text)}`)
      .join('\n\n');

    const messages = [
      {
        role: 'system',
        content:
          'Jesteś specjalistycznym modelem do analizy kreskówek z kontekstu.',
      },
      {
        role: 'system',
        content:
          'Twoją rolą jest odpowiadać użytkownikowi tylko na pytania związane z serią scooby-doo, czerp wiedzę z kontekstu',
      },
      {
        role: 'system',
        content: 'Domyślnie zakładaj że chodzi o scooby doo.',
      },
      { role: 'system', content: `### CONTEXT ${context}` },
      {
        role: 'system',
        content:
          'Odpowiadaj jakbyś był recenzentem filmowym i stosuj formę wypowiedzi otwartej.',
      },
      {
        role: 'system',
        content:
          'Jeżeli użytkownik nie zapyta o serial scooby doo, odmów udzielenia odpowiedzi i odrzuć kontekst. ' +
          'Jeżeli nie możesz znaleźć odpowiedzi pośród kontekstu odpowiedz że brak ci wiedzy.',
      },
      {
        role: 'system',
        content: 'Odpowiadaj wyłącznie na ostatnie pytanie użytkownika!',
      },
      ...questions,
    ];

    const rsp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages,
        store: true,
        temperature: 0.3,
      }),
    }).then((r) => r.json());

    const [answer] = (await rsp?.choices) ?? [];

    return (
      answer?.message?.content ??
      'Przepraszamy, nie jesteśmy w stanie udzielić odpowiedzi.'
    );
  }
}
