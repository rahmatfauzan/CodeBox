"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FileText, Edit, Trash2, CheckCircle, Clock, Eye } from "lucide-react";

interface Activity {
  id: string;
  type: "created" | "updated" | "deleted" | "published" | "viewed";
  document: {
    title: string;
    slug: string;
  };
  timestamp: string | null; // ✅ Allow null
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "created":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "updated":
        return <Edit className="h-4 w-4 text-orange-600" />;
      case "deleted":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "viewed":
        return <Eye className="h-4 w-4 text-purple-600" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "created":
        return "Created";
      case "updated":
        return "Updated";
      case "deleted":
        return "Deleted";
      case "published":
        return "Published";
      case "viewed":
        return "Viewed";
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "created":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
      case "updated":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400";
      case "deleted":
        return "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400";
      case "published":
        return "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400";
      case "viewed":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
              >
                {/* Icon */}
                <div className="mt-1">{getActivityIcon(activity.type)}</div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={getActivityColor(activity.type)}
                    >
                      {getActivityText(activity)}
                    </Badge>
                    <span className="text-sm font-medium">
                      {activity.document.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp
                      ? formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: localeId,
                        })
                      : "Unknown time"}
                  </p>
                </div>

                {/* User Avatar (if available) */}
                {activity.user && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>
                      {activity.user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
