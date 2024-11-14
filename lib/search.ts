import { SearchEngine, SearchResult, SearchSource } from "@/app/page";

export class SearchService {
  private apiKeys: Record<SearchEngine, string> = {
    serpapi: process.env.SERPAPI_KEY || "",
    serper: process.env.SERPER_KEY || "",
    searchapi: process.env.SEARCHAPI_KEY || "",
  };

  async search(
    query: string,
    source: SearchSource,
    engine: SearchEngine
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    if (source === "web" || source === "both") {
      const webResults = await this.webSearch(query, engine);
      results.push(...webResults);
    }

    if (source === "knowledge" || source === "both") {
      const knowledgeResults = await this.knowledgeSearch(query);
      results.push(...knowledgeResults);
    }

    return results;
  }

  private async webSearch(
    query: string,
    engine: SearchEngine
  ): Promise<SearchResult[]> {
    switch (engine) {
      case "serpapi":
        return this.serpApiSearch(query);
      case "serper":
        return this.serperSearch(query);
      case "searchapi":
        return this.searchApiSearch(query);
      default:
        throw new Error("Unsupported search engine");
    }
  }

  private async serpApiSearch(query: string): Promise<SearchResult[]> {
    const response = await fetch(
      `https://serpapi.com/search?q=${encodeURIComponent(
        query
      )}&api_key=${this.apiKeys.serpapi}`
    );
    const data = await response.json();
    
    return data.organic_results.map((result: any) => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet,
      source: "serpapi",
    }));
  }

  private async serperSearch(query: string): Promise<SearchResult[]> {
    const response = await fetch("https://api.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": this.apiKeys.serper,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });
    const data = await response.json();

    return data.organic.map((result: any) => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet,
      source: "serper",
    }));
  }

  private async searchApiSearch(query: string): Promise<SearchResult[]> {
    const response = await fetch(
      `https://www.searchapi.io/api/v1/search?q=${encodeURIComponent(
        query
      )}&api_key=${this.apiKeys.searchapi}`
    );
    const data = await response.json();

    return data.organic_results.map((result: any) => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet,
      source: "searchapi",
    }));
  }

  private async knowledgeSearch(query: string): Promise<SearchResult[]> {
    // Implement vector search using ChromaDB
    // This is a placeholder implementation
    return [];
  }
}