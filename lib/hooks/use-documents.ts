"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ✅ Import types yang sudah diperbaiki
import {
  type DocumentFormValues,
  type UpdateDocumentFormValues,
} from "@/lib/validations/documents";

import {
  createDocumentAction,
  updateDocumentAction,
  deleteDocumentAction,
} from "@/lib/actions/document";

export function useDocumentActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const createDocument = async (data: DocumentFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createDocumentAction(data);
      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success("Snippet berhasil dibuat!");
      router.push("/dashboard");
      router.refresh();
      return true;
    } catch (err) {
      console.error("Create document error:", err);
      toast.error("Terjadi kesalahan sistem");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDocument = async (data: UpdateDocumentFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateDocumentAction(data);
      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success("Perubahan disimpan!");
      router.refresh();
      return true;
    } catch (err) {
      console.error("Update document error:", err);
      toast.error("Gagal mengupdate");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDocument = async (id: string) => {
    setIsSubmitting(true);
    try {
      const result = await deleteDocumentAction(id);
      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success("Snippet dihapus");
      router.push("/dashboard");
      router.refresh();
      return true;
    } catch (err) {
      console.error("Delete document error:", err);
      toast.error("Gagal menghapus");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createDocument,
    updateDocument,
    deleteDocument,
  };
}
