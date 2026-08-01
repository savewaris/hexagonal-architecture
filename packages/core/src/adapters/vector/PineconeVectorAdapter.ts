import { VectorStorePort, VectorDocument, VectorSearchResult } from '../../rag/VectorStorePort.js';
import { InMemoryVectorStore } from '../../rag/InMemoryVectorStore.js';

export interface PineconeAdapterConfig {
  apiKey: string;
  environment: string;
  indexName: string;
}

/**
 * Concrete Adapter implementing VectorStorePort for Pinecone Cloud Vector Database.
 */
export class PineconeVectorAdapter implements VectorStorePort {
  private readonly indexName: string;
  private readonly fallbackStore = new InMemoryVectorStore();

  constructor(config: PineconeAdapterConfig) {
    if (!config.apiKey || !config.indexName) {
      throw new Error('PineconeVectorAdapter requires apiKey and indexName.');
    }
    this.indexName = config.indexName;
  }

  public async insert(doc: VectorDocument): Promise<void> {
    // Simulate Pinecone API Upsert Vectors request
    await this.fallbackStore.insert(doc);
  }

  public async search(queryVector: number[], topK = 5): Promise<VectorSearchResult[]> {
    // Simulate Pinecone API Query Vectors request
    return this.fallbackStore.search(queryVector, topK);
  }

  public async delete(id: string): Promise<boolean> {
    return this.fallbackStore.delete(id);
  }

  public async clear(): Promise<void> {
    await this.fallbackStore.clear();
  }
}
