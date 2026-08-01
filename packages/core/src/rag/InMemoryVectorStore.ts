import { VectorStorePort, VectorDocument, VectorSearchResult } from './VectorStorePort.js';

/**
 * Concrete Adapter implementing VectorStorePort using pure Cosine Similarity math.
 * Provides zero-dependency, ultra-fast vector search for tests & prototyping.
 */
export class InMemoryVectorStore implements VectorStorePort {
  private readonly store: Map<string, VectorDocument> = new Map();

  public async insert(doc: VectorDocument): Promise<void> {
    if (!doc.vector || doc.vector.length === 0) {
      throw new Error('VectorDocument must contain a non-empty vector array.');
    }
    this.store.set(doc.id, doc);
  }

  public async search(queryVector: number[], topK = 3): Promise<VectorSearchResult[]> {
    const results: VectorSearchResult[] = [];

    for (const doc of this.store.values()) {
      const similarityScore = InMemoryVectorStore.cosineSimilarity(queryVector, doc.vector);
      results.push({ document: doc, similarityScore });
    }

    // Sort descending by similarity score
    results.sort((a, b) => b.similarityScore - a.similarityScore);
    return results.slice(0, topK);
  }

  public async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  public async clear(): Promise<void> {
    this.store.clear();
  }

  /**
   * Pure mathematical Cosine Similarity calculation between two numerical vectors.
   * Formula: (A · B) / (||A|| * ||B||)
   */
  public static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }
}
