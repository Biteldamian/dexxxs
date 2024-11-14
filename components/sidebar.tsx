"use client";

import { cn } from "@/lib/utils";
import { Bot, BookOpen, ListTodo, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Chat",
    icon: MessageSquare,
    href: "/",
  },
  {
    label: "Knowledge Base",
    icon: BookOpen,
    href: "/knowledge",
  },
  {
    label: "Tasks",
    icon: ListTodo,
    href: "/tasks",
  },
  {
    label: "Training",
    icon: Bot,
    href: "/training",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[300px] flex-col border-r bg-muted/10">
      <div className="flex h-14 items-center border-b px-6">
        <h2 className="font-semibold">Navigation</h2>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-accent" : "transparent"
              )}
            >
              <route.icon className="size-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}