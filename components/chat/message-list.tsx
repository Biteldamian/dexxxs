"use client";

import { Message, SearchResult } from "@/app/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, ChevronDown, ChevronRight, ExternalLink, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from 'react-markdown';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleSourceExpansion = (messageId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const renderSearchResults = (results: SearchResult[]) => (
    <div className="mt-4 space-y-2">
      {results.map((result, index) => (
        <Card key={index} className="bg-muted/50">
          <CardHeader className="p-4">
            <CardTitle className="text-sm">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                {result.title}
                <ExternalLink className="size-3" />
              </a>
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {result.url}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-sm">
            {result.snippet}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-4 rounded-lg p-4",
              message.role === "user"
                ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                : "mr-auto max-w-[80%] bg-muted"
            )}
          >
            <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
              {message.role === "user" ? (
                <User className="size-4" />
              ) : (
                <Bot className="size-4" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <Markdown className="prose dark:prose-invert max-w-none">
                {message.content}
              </Markdown>

              {message.searchResults && (
                <Collapsible
                  open={expandedSources[message.id]}
                  onOpenChange={() => toggleSourceExpansion(message.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 gap-2 text-xs"
                    >
                      {expandedSources[message.id] ? (
                        <ChevronDown className="size-3" />
                      ) : (
                        <ChevronRight className="size-3" />
                      )}
                      <Search className="size-3" />
                      {message.searchResults.length} sources
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {renderSearchResults(message.searchResults)}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}