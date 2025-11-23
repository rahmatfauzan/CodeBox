"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryStat {
  id: string;
  name: string;
  icon?: string | null; // ✅ Allow null
  color?: string | null; // ✅ Allow null
  count: number;
  percentage: number;
}

interface CategoryDistributionProps {
  categories: CategoryStat[];
}

export function CategoryDistribution({
  categories,
}: CategoryDistributionProps) {
  // Sort by count descending
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
  const maxCount = sortedCategories[0]?.count || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Popular Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No categories yet
            </p>
          ) : (
            sortedCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                {/* Category Name & Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.icon && <span>{category.icon}</span>}
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{category.count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(category.count / maxCount) * 100}%`,
                      backgroundColor: category.color || "#6366f1",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        {sortedCategories.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Total Documents</span>
              <span className="font-bold">
                {sortedCategories.reduce((sum, cat) => sum + cat.count, 0)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
