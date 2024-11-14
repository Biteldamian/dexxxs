"use client";

import { StorageInfo } from "@/app/knowledge/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database } from "lucide-react";

interface StorageStatsProps {
  info: StorageInfo;
}

export function StorageStats({ info }: StorageStatsProps) {
  const formatSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const usagePercentage = (info.usedSize / info.totalSize) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Database className="size-5 text-muted-foreground" />
        <div>
          <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          <CardDescription>
            {formatSize(info.usedSize)} of {formatSize(info.totalSize)} used
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={usagePercentage} />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Documents</p>
              <p className="font-medium">{info.documentCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Embeddings</p>
              <p className="font-medium">{formatSize(info.embeddingSize)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}