"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Eye,
  FolderOpen,
  Star,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    totalDocuments: number;
    totalViews: number;
    totalCategories: number;
    publishedDocuments: number;
    draftDocuments: number;
    recentViews: number; // Last 7 days
    trending?: number; // Percentage change
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Documents",
      value: stats.totalDocuments,
      icon: FileText,
      description: `${stats.publishedDocuments} published, ${stats.draftDocuments} drafts`,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      trend: stats.trending,
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      description: `${stats.recentViews} views this week`,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      description: "Active categories",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Published",
      value: stats.publishedDocuments,
      icon: CheckCircle2,
      description: `${stats.draftDocuments} drafts remaining`,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", card.bgColor)}>
                <Icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{card.value}</div>
                {card.trend && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      card.trend > 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <TrendingUp
                      className={cn("h-3 w-3", card.trend < 0 && "rotate-180")}
                    />
                    {Math.abs(card.trend)}%
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
