"use client";

import { KnowledgeItem } from "@/app/knowledge/page";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

interface Node {
  id: string;
  name: string;
  val: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface KnowledgeGraphProps {
  items: KnowledgeItem[];
  onSelectItems: (itemIds: string[]) => void;
}

export function KnowledgeGraph({ items, onSelectItems }: KnowledgeGraphProps) {
  const graphRef = useRef<ForceGraphMethods>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const { theme } = useTheme();

  const generateGraphData = useCallback(() => {
    // Convert items to nodes
    const newNodes: Node[] = items.map((item) => ({
      id: item.id,
      name: item.name,
      val: 1,
    }));

    // Generate links based on document similarity (placeholder)
    const newLinks: Link[] = [];
    items.forEach((item, i) => {
      items.slice(i + 1).forEach((otherItem) => {
        if (Math.random() > 0.7) {
          // Simulate similarity threshold
          newLinks.push({
            source: item.id,
            target: otherItem.id,
            value: Math.random(),
          });
        }
      });
    });

    setNodes(newNodes);
    setLinks(newLinks);
  }, [items]);

  useEffect(() => {
    generateGraphData();
  }, [generateGraphData]);

  const handleNodeClick = useCallback(
    (node: Node) => {
      onSelectItems([node.id]);
    },
    [onSelectItems]
  );

  return (
    <div className="h-[calc(100vh-20rem)] border rounded-lg">
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links }}
        nodeLabel="name"
        nodeColor={() => theme === "dark" ? "#fff" : "#000"}
        linkColor={() => theme === "dark" ? "#666" : "#999"}
        backgroundColor="transparent"
        onNodeClick={handleNodeClick}
        linkWidth={(link) => (link as Link).value}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = (node as Node).name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = theme === "dark" ? "#fff" : "#000";
          ctx.textAlign = "center";
          ctx.fillText(label, node.x!, node.y!);
        }}
      />
    </div>
  );
}