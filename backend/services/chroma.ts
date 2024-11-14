import { ChromaClient, Collection } from 'chromadb';

let client: ChromaClient;
let collection: Collection;

export async function setupChroma() {
  try {
    client = new ChromaClient();
    
    // Create or get collection
    collection = await client.createCollection({
      name: 'documents',
      metadata: { description: 'Document embeddings for AI assistant' },
    });

    console.log('ChromaDB setup completed');
  } catch (error) {
    console.error('ChromaDB setup failed:', error);
    throw error;
  }
}

export async function addDocument(
  id: string,
  content: string,
  metadata: Record<string, any>
) {
  await collection.add({
    ids: [id],
    documents: [content],
    metadatas: [metadata],
  });
}

export async function searchSimilar(query: string, limit: number = 5) {
  const results = await collection.query({
    queryTexts: [query],
    nResults: limit,
  });

  return results;
}

export async function deleteDocument(id: string) {
  await collection.delete({ ids: [id] });
}

export async function getCollection() {
  return collection;
}