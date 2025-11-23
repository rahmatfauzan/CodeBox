"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  Globe,
  Image,
  Hash,
  FileText,
  Tag,
  Folder,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import {
  documentFormSchema,
  type DocumentFormValues,
} from "@/lib/validations/documents";
import { CodeEditor } from "@/components/ui/code-editor";
import { AIMetaGenerator } from "./ai-meta-generator";
import { TagInput } from "@/components/ui/tag-input";
import { useDocumentActions } from "@/lib/hooks/use-documents";

interface DocumentFormProps {
  categories: any[];
  initialData?: any;
  existingTags?: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.25 } },
};

export function DocumentForm({
  categories,
  initialData,
  existingTags = [],
}: DocumentFormProps) {
  const router = useRouter();
  const { createDocument, updateDocument, isSubmitting } = useDocumentActions();
  const isEditing = !!initialData;

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      category_id: initialData?.category_id || undefined,
      difficulty: initialData?.difficulty || "beginner",
      status: initialData?.status || "draft",
      visibility: initialData?.visibility || "private",
      meta_title: initialData?.meta_title || "",
      meta_description: initialData?.meta_description || "",
      meta_keywords: initialData?.meta_keywords || [],
      thumbnail_url: initialData?.thumbnail_url || "",
      tags: initialData?.tags || [],
    },
  });

  const titleValue = form.watch("title");
  const metaTitleValue = form.watch("meta_title");

  async function onSubmit(data: DocumentFormValues) {
    if (isEditing) {
      await updateDocument({ id: initialData.id, ...data });
    } else {
      await createDocument(data);
    }
  }

  return (
    <FormProvider {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 max-w-6xl mx-auto py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER - Clean Solid */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md py-2 border-b shadow-sm -mx-4 px-4 md:mx-0 md:px-0"
        >
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-8 w-8 rounded-lg bg-blue-600 items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-0">
              <h3 className="text-sm font-bold flex items-center gap-2">
                {isEditing ? "Edit Snippet" : "Buat Snippet Baru"}
                {form.watch("status") === "published" && (
                  <Badge className="bg-green-500 text-white hover:bg-green-600 text-[10px] px-1.5 py-0 h-4">
                    Live
                  </Badge>
                )}
              </h3>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                {isEditing ? "Perbarui konten kode" : "Simpan snippet baru"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="h-8 px-3 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 px-4 min-w-[90px] bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-3 w-3" />
              )}
              {isEditing ? "Update" : "Simpan"}
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-3 lg:grid-cols-3">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-2 space-y-3">
            {/* Title + Category */}
            <motion.div
              variants={itemVariants}
              className="grid gap-3 md:grid-cols-3"
            >
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                        <FileText className="h-3 w-3 text-blue-600" />
                        Judul Snippet *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Middleware Auth Next.js"
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                      <Folder className="h-3 w-3 text-amber-500" />
                      Kategori *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="Pilih..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-xs text-muted-foreground">
                            Kategori kosong
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Editor - No Gradient */}
            <motion.div variants={itemVariants} className="group">
              <div className="relative bg-background rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-400"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    editor
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CodeEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="// Tulis kode di sini..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            {/* Excerpt */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Deskripsi Singkat
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jelaskan snippet ini secara singkat..."
                        className="resize-none h-16 text-sm"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* KOLOM KANAN - Sidebar */}
          <motion.div variants={itemVariants} className="space-y-3">
            {/* Card Settings - No Gradient */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-card shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[11px] text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  Pengaturan
                </h3>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 h-4"
                >
                  {form.watch("visibility") === "public" ? "🌍" : "🔒"}
                </Badge>
              </div>

              {/* Tags Input */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Tags</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="react, typescript..."
                        suggestions={existingTags}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      Maks. 10 tag
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-2" />

              {/* Settings Grid - 3 Columns */}
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-semibold">
                        Visibilitas
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "private"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="private">🔒 Private</SelectItem>
                          <SelectItem value="public">🌍 Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-semibold">
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "draft"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">📝 Draft</SelectItem>
                          <SelectItem value="published">✅ Publish</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-semibold">
                        Level
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "beginner"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">🟢 Basic</SelectItem>
                          <SelectItem value="intermediate">
                            🟡 Medium
                          </SelectItem>
                          <SelectItem value="advanced">🔴 Pro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SEO Accordion - No Gradient */}
            <Accordion
              type="single"
              collapsible
              className="w-full border border-slate-200 dark:border-slate-800 rounded-lg bg-card"
            >
              <AccordionItem value="seo" className="border-0 px-3">
                <AccordionTrigger className="hover:no-underline py-2 text-[11px]">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
                      <Hash className="h-3 w-3 text-white" />
                    </div>
                    <span className="uppercase tracking-wider font-bold">
                      SEO & Meta
                    </span>
                    <Badge className="ml-auto text-[9px] px-1.5 py-0 h-4 bg-blue-600 text-white border-0">
                      AI
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2.5 pt-1 pb-3">
                  {/* AI Generator */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-2.5 rounded-md border border-blue-200 dark:border-blue-800">
                    <AIMetaGenerator />
                  </div>

                  {/* Meta Fields */}
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">
                          Meta Title
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-8 text-xs" />
                        </FormControl>
                        <FormDescription className="text-[10px] truncate">
                          {metaTitleValue ||
                            titleValue?.substring(0, 60) ||
                            "Akan muncul di hasil pencarian"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="h-20 resize-none text-xs"
                            placeholder="Deskripsi untuk SEO..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </motion.form>
    </FormProvider>
  );
}
