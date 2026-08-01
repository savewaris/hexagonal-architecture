import { VectorStorePort, VectorDocument } from './VectorStorePort.js';
import { AIGeneratorPort } from '../ports/AIGeneratorPort.js';

export interface RAGQueryOptions {
  topK?: number;
  minSimilarityScore?: number;
  systemPrompt?: string;
}

export interface RAGResponse {
  answer: string;
  retrievedContexts: string[];
  tokensUsed: number;
}

/**
 * Advanced First-Principles Core Engine: Retrieval-Augmented Generation (RAG) Engine.
 * Handles document chunking, vector indexing, similarity retrieval, context injection & AI completion.
 */
export class RAGEngine {
  constructor(
    private readonly vectorStore: VectorStorePort,
    private readonly aiService: AIGeneratorPort
  ) {}

  public async indexDocument(id: string, text: string, mockVector: number[], chunkSize = 300): Promise<void> {
    const chunks = RAGEngine.chunkText(text, chunkSize);

    for (let i = 0; i < chunks.length; i++) {
      const docId = `${id}_chunk_${i}`;
      const doc: VectorDocument = {
        id: docId,
        text: chunks[i],
        vector: mockVector,
        metadata: { parentId: id, chunkIndex: i },
      };
      await this.vectorStore.insert(doc);
    }
  }

  public async query(queryText: string, queryVector: number[], options: RAGQueryOptions = {}): Promise<RAGResponse> {
    const topK = options.topK || 3;
    const minScore = options.minSimilarityScore || 0.1;

    // Step 1: Vector Similarity Search
    const searchResults = await this.vectorStore.search(queryVector, topK);
    const relevantDocs = searchResults.filter(r => r.similarityScore >= minScore);

    const retrievedContexts = relevantDocs.map(r => r.document.text);
    const combinedContext = retrievedContexts.join('\n---\n');

    // Step 2: Context-Augmented Prompt Construction
    const augmentedPrompt = `Context Information:
${combinedContext}

User Question: ${queryText}
Please answer the question based strictly on the provided context above.`;

    // Step 3: AI Completion
    const aiResult = await this.aiService.complete(augmentedPrompt, {
      systemPrompt: options.systemPrompt || 'You are an accurate RAG assistant. Answer based only on context.',
    });

    return {
      answer: aiResult.text,
      retrievedContexts,
      tokensUsed: aiResult.tokensUsed,
    };
  }

  public static chunkText(text: string, chunkSize = 300): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      chunks.push(text.substring(start, start + chunkSize));
      start += chunkSize;
    }

    return chunks;
  }
}
