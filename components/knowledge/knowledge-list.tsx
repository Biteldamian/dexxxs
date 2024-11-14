"use client";

import { KnowledgeItem } from "@/app/knowledge/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileText, Trash2 } from "lucide-react";

interface KnowledgeListProps {
  items: KnowledgeItem[];
  selectedItems: string[];
  onSelectItems: (itemIds: string[]) => void;
}

export function KnowledgeList({ items, selectedItems, onSelectItems }: KnowledgeListProps) {
  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleItemClick = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectItems(newSelection);
  };

  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card 
            key={item.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent",
              selectedItems.includes(item.id) && "bg-accent"
            )}
            onClick={() => handleItemClick(item.id)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="size-8 text-muted-foreground" />
              <div className="grid gap-1">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(item.size)}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      item.status === "ready"
                        ? "text-green-500"
                        : item.status === "error"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Uploaded: {item.uploadedAt.toLocaleDateString()}
                </div>
                {item.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.summary}
                  </p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-secondary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" size="sm" className="w-full">
                <Trash2 className="size-4 mr-2" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}