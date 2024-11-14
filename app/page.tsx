"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import { SearchSourceToggle } from "@/components/chat/search-source-toggle";
import { SearchStatus } from "@/components/chat/search-status";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export type SearchSource = "web" | "knowledge" | "both";
export type SearchEngine = "serpapi" | "serper" | "searchapi";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  searchResults?: SearchResult[];
  sources?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant with web search capabilities. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [searchSource, setSearchSource] = useState<SearchSource>("both");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>("serpapi");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsSearching(true);

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          searchSource,
          searchEngine,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
        searchResults: data.searchResults,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      toast({
        title: "File uploaded",
        description: "The file has been uploaded and will be processed.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex h-screen flex-col">
      <ChatHeader />
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <SearchSourceToggle
          source={searchSource}
          onChange={setSearchSource}
          engine={searchEngine}
          onEngineChange={setSearchEngine}
        />
        <SearchStatus isSearching={isSearching} />
      </div>
      <MessageList messages={messages} />
      <ChatInput 
        onSubmit={handleSubmit} 
        onFileUpload={handleFileUpload}
        disabled={isSearching} 
      />
    </main>
  );
}