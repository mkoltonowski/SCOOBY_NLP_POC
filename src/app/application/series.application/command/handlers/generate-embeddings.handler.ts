import { Logger } from '@nestjs/common';
import { env, pipeline, Tensor } from '@huggingface/transformers';
import { promises as fs } from 'fs';
import * as path from 'node:path';
import * as fg from 'fast-glob';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateEmbeddingsCommand } from '../impl/generate-embeddings.command';
import { VectorStoreService } from '../../service/vector-store.service';
import { basePath } from '../../../../../common/util/path';

@CommandHandler(GenerateEmbeddingsCommand)
export class GenerateEmbeddingsHandler
  implements ICommandHandler<GenerateEmbeddingsCommand>
{
  private readonly logger = new Logger(GenerateEmbeddingsHandler.name);
  private readonly jsonGlob = 'docs/*.json';
  private readonly outDir = 'embeddings';
  private readonly modelId = 'Xenova/e5-large-v2';

  constructor(private readonly store: VectorStoreService) {}

  async execute(): Promise<void> {
    env.cacheDir = './models';
    const extractor = await pipeline('feature-extraction', this.modelId);

    const files = await fg(this.jsonGlob);
    await fs.mkdir(this.outDir, { recursive: true });

    for (const file of files) {
      const raw = await fs.readFile(file, 'utf8');
      const json = JSON.parse(raw);
      const texts: string[] = Array.isArray(json)
        ? json.map(
            (o: any) =>
              `title: ${o.name}` +
              ` summary: ${this.stripHtml(o.summary)}` +
              ` season: ${o.season}, episode: ${o.number}` +
              ` rating: ${o.rating}`,
          )
        : [
            ` title: ${json.name}` +
              ` summary: ${this.stripHtml(json.summary)}` +
              ` season: ${json.season}, episode: ${json.number}` +
              ` rating: ${json.rating}`,
          ];

      console.log(texts);
      await this.saveDocuments(JSON.stringify(texts));
      const tensor: Tensor = await extractor(
        texts.map((t) => 'passage: ' + t),
        {
          pooling: 'mean',
          normalize: true,
        },
      );
      const vectors = tensor.tolist() as number[][];
      const outPath = path.join(
        this.outDir,
        path.basename(file).replace(/\.json$/i, '.emb.json'),
      );
      await fs.writeFile(outPath, JSON.stringify(vectors));
      this.logger.log(`${outPath}`);

      await this.store.load();
    }
  }

  private saveDocuments = async (data: string) => {
    await fs.writeFile(
      path.join(basePath, '/docs/source', 'test.source.json'),
      data,
      {
        flag: 'w',
        encoding: 'utf8',
      },
    );
  };

  stripHtml(x = '') {
    return x.replace(/<[^>]*>/g, ' ').trim();
  }
}
