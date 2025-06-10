import { Logger } from '@nestjs/common';
import { env, pipeline, Tensor } from '@huggingface/transformers';
import { promises as fs } from 'fs';
import * as path from 'node:path';
import * as fg from 'fast-glob';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateEmbeddingsCommand } from '../impl/generate-embeddings.command';

@CommandHandler(GenerateEmbeddingsCommand)
export class GenerateEmbeddingsHandler
  implements ICommandHandler<GenerateEmbeddingsCommand>
{
  private readonly logger = new Logger(GenerateEmbeddingsHandler.name);
  private readonly jsonGlob = 'docs/**/*.json';
  private readonly outDir = 'embeddings';
  private readonly modelId = 'Xenova/e5-large-v2';

  constructor() {}

  async execute(): Promise<void> {
    env.cacheDir = './models';
    const extractor = await pipeline('feature-extraction', this.modelId);

    const files = await fg(this.jsonGlob);
    await fs.mkdir(this.outDir, { recursive: true });

    for (const file of files) {
      const raw = await fs.readFile(file, 'utf8');
      const json = JSON.parse(raw);
      const texts: string[] = Array.isArray(json)
        ? json.map((o: any) => o.text ?? '')
        : [json.text ?? ''];

      const tensor: Tensor = await extractor(texts);
      const vectors = tensor.tolist() as number[][];
      const outPath = path.join(
        this.outDir,
        path.basename(file).replace(/\.json$/i, '.emb.json'),
      );
      await fs.writeFile(outPath, JSON.stringify(vectors));
      this.logger.log(`✅ ${outPath}`);
    }
  }
}
