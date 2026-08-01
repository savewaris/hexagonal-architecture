export interface VectorDocument {
  id: string;
  text: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

export interface VectorSearchResult {
  document: VectorDocument;
  similarityScore: number;
}

/**
 * Output Port Interface for Vector Database Stores.
 * Decouples RAG search logic from Pinecone, Qdrant, Weaviate, or In-Memory vector stores.
 */
export interface VectorStorePort {
  insert(doc: VectorDocument): Promise<void>;
  search(queryVector: number[], topK?: number): Promise<VectorSearchResult[]>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
}
