import { Injectable, Scope } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as fs from 'node:fs';

@Injectable({ scope: Scope.DEFAULT })
export class VectorStoreService {
  private vecs: number[][] = [];
  private texts: string[] = [];

  async load(
    txtPath = 'docs/source/test.source.json',
    vecPath = 'embeddings/test.emb.json',
  ) {
    if (!fs.existsSync(txtPath) || !fs.existsSync(txtPath)) {
      return;
    }

    this.vecs = JSON.parse(await readFile(vecPath, 'utf8'));
    this.texts = JSON.parse(await readFile(txtPath, 'utf8'));
    if (this.vecs.length !== this.texts.length)
      throw new Error('vec/text length mismatch');
  }

  search(queryVec: number[], k = 4) {
    const norm = (v: number[]) => Math.hypot(...v);
    const dot = (a: number[], b: number[]) =>
      a.reduce((s, x, i) => s + x * b[i], 0);
    const qn = norm(queryVec);

    return this.vecs
      .map((v, i) => ({
        idx: i,
        score: dot(queryVec, v) / (qn * norm(v)),
        text: this.texts[i],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}
