"use client";

import { Folder } from "@/app/knowledge/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronRight, Folder as FolderIcon, FolderPlus, Plus } from "lucide-react";
import { useState } from "react";

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId?: string;
  onSelectFolder: (folderId?: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
}: FolderTreeProps) {
  const [newFolderName, setNewFolderName] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>();

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName, selectedParentId);
      setNewFolderName("");
      setCreateDialogOpen(false);
    }
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const children = folders.filter((f) => f.parentId === folder.id);

    return (
      <div key={folder.id} className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            selectedFolderId === folder.id && "bg-accent"
          )}
          onClick={() => onSelectFolder(folder.id)}
        >
          <ChevronRight
            className={cn(
              "mr-2 size-4 transition-transform",
              children.length > 0 && "rotate-90"
            )}
          />
          <FolderIcon className="mr-2 size-4" />
          {folder.name}
        </Button>
        {children.length > 0 && (
          <div className="ml-6 space-y-1">
            {children.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Folders</h3>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="p-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              !selectedFolderId && "bg-accent"
            )}
            onClick={() => onSelectFolder(undefined)}
          >
            <FolderIcon className="mr-2 size-4" />
            All Documents
          </Button>
          {folders
            .filter((f) => !f.parentId)
            .map((folder) => renderFolder(folder))}
        </div>
      </ScrollArea>
    </div>
  );
}