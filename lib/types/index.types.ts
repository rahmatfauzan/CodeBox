export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          created_at: string | null;
          id: string;
          ip_address: unknown;
          new_data: Json | null;
          old_data: Json | null;
          record_id: string;
          table_name: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id: string;
          table_name: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id?: string;
          table_name?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "author_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_activity";
            referencedColumns: ["user_id"];
          }
        ];
      };
      bookmarks: {
        Row: {
          bookmarkable_id: string;
          bookmarkable_type: string | null;
          created_at: string | null;
          id: string;
          notes: string | null;
          user_id: string;
        };
        Insert: {
          bookmarkable_id: string;
          bookmarkable_type?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          user_id: string;
        };
        Update: {
          bookmarkable_id?: string;
          bookmarkable_type?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "author_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_activity";
            referencedColumns: ["user_id"];
          }
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          docs_count: number | null;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          slug: string;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          docs_count?: number | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          slug: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          docs_count?: number | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          slug?: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      document_tags: {
        Row: {
          created_at: string | null;
          document_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string | null;
          document_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string | null;
          document_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents_with_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "latest_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "popular_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "published_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "trending_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tag_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          author_id: string;
          bookmark_count: number | null;
          category_id: string | null;
          comment_count: number | null;
          content: string;
          created_at: string | null;
          difficulty: string | null;
          excerpt: string | null;
          id: string;
          like_count: number | null;
          meta_description: string | null;
          meta_keywords: string[] | null;
          meta_title: string | null;
          published_at: string | null;
          reading_time: number | null;
          search_vector: unknown;
          slug: string;
          status: string | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string | null;
          view_count: number | null;
          visibility: string | null;
        };
        Insert: {
          author_id: string;
          bookmark_count?: number | null;
          category_id?: string | null;
          comment_count?: number | null;
          content: string;
          created_at?: string | null;
          difficulty?: string | null;
          excerpt?: string | null;
          id?: string;
          like_count?: number | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
          meta_title?: string | null;
          published_at?: string | null;
          reading_time?: number | null;
          search_vector?: unknown;
          slug: string;
          status?: string | null;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string | null;
          view_count?: number | null;
          visibility?: string | null;
        };
        Update: {
          author_id?: string;
          bookmark_count?: number | null;
          category_id?: string | null;
          comment_count?: number | null;
          content?: string;
          created_at?: string | null;
          difficulty?: string | null;
          excerpt?: string | null;
          id?: string;
          like_count?: number | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
          meta_title?: string | null;
          published_at?: string | null;
          reading_time?: number | null;
          search_vector?: unknown;
          slug?: string;
          status?: string | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string | null;
          view_count?: number | null;
          visibility?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "author_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_activity";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category_stats";
            referencedColumns: ["id"];
          }
        ];
      };
      likes: {
        Row: {
          created_at: string | null;
          id: string;
          likeable_id: string;
          likeable_type: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          likeable_id: string;
          likeable_type?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          likeable_id?: string;
          likeable_type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "author_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_activity";
            referencedColumns: ["user_id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          docs_count: number | null;
          full_name: string | null;
          github_url: string | null;
          id: string;
          is_verified: boolean | null;
          linkedin_url: string | null;
          role: string | null;
          snippets_count: number | null;
          twitter_url: string | null;
          updated_at: string | null;
          username: string;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          docs_count?: number | null;
          full_name?: string | null;
          github_url?: string | null;
          id?: string;
          is_verified?: boolean | null;
          linkedin_url?: string | null;
          role?: string | null;
          snippets_count?: number | null;
          twitter_url?: string | null;
          updated_at?: string | null;
          username: string;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          docs_count?: number | null;
          full_name?: string | null;
          github_url?: string | null;
          id?: string;
          is_verified?: boolean | null;
          linkedin_url?: string | null;
          role?: string | null;
          snippets_count?: number | null;
          twitter_url?: string | null;
          updated_at?: string | null;
          username?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          slug: string;
          usage_count: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          slug: string;
          usage_count?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          usage_count?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      author_stats: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          docs_count: number | null;
          full_name: string | null;
          id: string | null;
          is_verified: boolean | null;
          joined_at: string | null;
          last_published_at: string | null;
          published_docs_count: number | null;
          total_likes: number | null;
          total_views: number | null;
          username: string | null;
        };
        Relationships: [];
      };
      category_stats: {
        Row: {
          color: string | null;
          description: string | null;
          docs_count: number | null;
          icon: string | null;
          id: string | null;
          last_published_at: string | null;
          name: string | null;
          published_docs_count: number | null;
          slug: string | null;
          total_likes: number | null;
          total_views: number | null;
        };
        Relationships: [];
      };
      document_tags_aggregated: {
        Row: {
          document_id: string | null;
          tags: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents_with_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "latest_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "popular_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "published_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "trending_documents";
            referencedColumns: ["id"];
          }
        ];
      };
      documents_with_details: {
        Row: {
          author_avatar: string | null;
          author_full_name: string | null;
          author_id: string | null;
          author_username: string | null;
          author_verified: boolean | null;
          bookmark_count: number | null;
          category_color: string | null;
          category_icon: string | null;
          category_id: string | null;
          category_name: string | null;
          category_slug: string | null;
          comment_count: number | null;
          created_at: string | null;
          difficulty: string | null;
          excerpt: string | null;
          id: string | null;
          like_count: number | null;
          published_at: string | null;
          reading_time: number | null;
          slug: string | null;
          status: string | null;
          thumbnail_url: string | null;
          title: string | null;
          updated_at: string | null;
          view_count: number | null;
          visibility: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "author_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_activity";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category_stats";
            referencedColumns: ["id"];
          }
        ];
      };
      latest_documents: {
        Row: {
          author_avatar: string | null;
          author_username: string | null;
          category_color: string | null;
          category_icon: string | null;
          category_name: string | null;
          category_slug: string | null;
          difficulty: string | null;
          excerpt: string | null;
          id: string | null;
          like_count: number | null;
          published_at: string | null;
          reading_time: number | null;
          slug: string | null;
          thumbnail_url: string | null;
          title: string | null;
          view_count: number | null;
        };
        Relationships: [];
      };
      popular_documents: {
        Row: {
          author_avatar: string | null;
          author_username: string | null;
          bookmark_count: number | null;
          category_color: string | null;
          category_icon: string | null;
          category_name: string | null;
          category_slug: string | null;
          difficulty: string | null;
          excerpt: string | null;
          id: string | null;
          like_count: number | null;
          published_at: string | null;
          reading_time: number | null;
          slug: string | null;
          thumbnail_url: string | null;
          title: string | null;
          view_count: number | null;
        };
        Relationships: [];
      };
      published_documents: {
        Row: {
          author_avatar: string | null;
          author_id: string | null;
          author_username: string | null;
          author_verified: boolean | null;
          bookmark_count: number | null;
          category_color: string | null;
          category_icon: string | null;
          category_id: string | null;
          category_name: string | null;
          category_slug: string | null;
          comment_count: number | null;
          content: string | null;
          created_at: string | null;
          difficulty: string | null;
          excerpt: string | null;
          id: string | null;
          like_count: number | null;
          meta_description: string | null;
          meta_keywords: string[] | null;
          meta_title: string | null;
          published_at: string | null;
          reading_time: number | null;
          search_vector: unknown;
          slug: string | null;
          status: string | null;
          thumbnail_url: string | null;
          title: string | null;
          updated_at: string | null;
          view_count: number | null;
          visibility: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "author_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_activity";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category_stats";
            referencedColumns: ["id"];
          }
        ];
      };
      tag_stats: {
        Row: {
          created_at: string | null;
          id: string | null;
          name: string | null;
          published_docs_count: number | null;
          slug: string | null;
          usage_count: number | null;
        };
        Relationships: [];
      };
      trending_documents: {
        Row: {
          author_avatar: string | null;
          author_name: string | null;
          author_username: string | null;
          author_verified: boolean | null;
          category_icon: string | null;
          category_name: string | null;
          difficulty: string | null;
          excerpt: string | null;
          id: string | null;
          like_count: number | null;
          published_at: string | null;
          reading_time: number | null;
          slug: string | null;
          thumbnail_url: string | null;
          title: string | null;
          trending_score: number | null;
          view_count: number | null;
        };
        Relationships: [];
      };
      user_activity: {
        Row: {
          docs_count: number | null;
          total_bookmarks: number | null;
          total_likes_given: number | null;
          total_likes_received: number | null;
          total_views_received: number | null;
          user_id: string | null;
          username: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      delete_user: { Args: { target_user_id: string }; Returns: undefined };
      get_document_with_details: {
        Args: { doc_author_id: string; doc_slug: string };
        Returns: {
          author_avatar: string;
          author_username: string;
          bookmark_count: number;
          category_name: string;
          category_slug: string;
          content: string;
          difficulty: string;
          excerpt: string;
          id: string;
          like_count: number;
          published_at: string;
          reading_time: number;
          slug: string;
          tags: Json;
          thumbnail_url: string;
          title: string;
          view_count: number;
        }[];
      };
      get_related_documents: {
        Args: { p_document_id: string; p_limit?: number };
        Returns: {
          author_username: string;
          category_name: string;
          difficulty: string;
          excerpt: string;
          id: string;
          like_count: number;
          published_at: string;
          reading_time: number;
          relevance_score: number;
          slug: string;
          thumbnail_url: string;
          title: string;
          view_count: number;
        }[];
      };
      increment_document_view: { Args: { doc_id: string }; Returns: undefined };
      search_documents: {
        Args: {
          limit_count?: number;
          offset_count?: number;
          search_query: string;
        };
        Returns: {
          author_username: string;
          category_name: string;
          difficulty: string;
          excerpt: string;
          id: string;
          like_count: number;
          published_at: string;
          rank: number;
          reading_time: number;
          slug: string;
          thumbnail_url: string;
          title: string;
          view_count: number;
        }[];
      };
      toggle_bookmark: {
        Args: {
          p_bookmarkable_id: string;
          p_bookmarkable_type?: string;
          p_notes?: string;
        };
        Returns: boolean;
      };
      toggle_like: {
        Args: { p_likeable_id: string; p_likeable_type?: string };
        Returns: boolean;
      };
      user_has_bookmarked: {
        Args: {
          p_bookmarkable_id: string;
          p_bookmarkable_type?: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      user_has_liked: {
        Args: {
          p_likeable_id: string;
          p_likeable_type?: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// Helper agar tidak perlu ketik Database['public'] terus
type PublicSchema = Database["public"];

// --- 1. TABLES (Row Data / Data Mentah dari DB) ---
export type Profile = PublicSchema["Tables"]["profiles"]["Row"];
export type Document = PublicSchema["Tables"]["documents"]["Row"];
export type Category = PublicSchema["Tables"]["categories"]["Row"];
export type Tag = PublicSchema["Tables"]["tags"]["Row"];
export type Like = PublicSchema["Tables"]["likes"]["Row"];
export type Bookmark = PublicSchema["Tables"]["bookmarks"]["Row"];

// --- 2. INSERTS (Data untuk Input/Create) ---
// Supabase otomatis membuat field opsional (seperti created_at, id) jadi '?'
export type ProfileInsert = PublicSchema["Tables"]["profiles"]["Insert"];
export type DocumentInsert = PublicSchema["Tables"]["documents"]["Insert"];
export type BookmarkInsert = PublicSchema["Tables"]["bookmarks"]["Insert"];

// --- 3. UPDATES (Data untuk Edit) ---
export type ProfileUpdate = PublicSchema["Tables"]["profiles"]["Update"];
export type DocumentUpdate = PublicSchema["Tables"]["documents"]["Update"];

// --- 4. VIEWS (Jika ada view seperti documents_with_details) ---
export type DocumentDetail =
  PublicSchema["Views"]["documents_with_details"]["Row"];
export type RelatedDocument =
  Database["public"]["Functions"]["get_related_documents"]["Returns"][number];
