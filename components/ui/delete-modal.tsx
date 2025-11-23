"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteDocumentAction } from "@/lib/actions/document";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  documentId,
  documentTitle,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDocumentAction(documentId);

      toast.success("Snippet berhasil dihapus");
      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus snippet");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Hapus Snippet</DialogTitle>
              <DialogDescription className="mt-1">
                Tindakan ini tidak dapat dibatalkan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Anda yakin ingin menghapus snippet{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              "{documentTitle}"
            </span>
            ?
          </p>
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-400">
              ⚠️ Data yang dihapus tidak dapat dikembalikan
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="mr-2"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Snippet
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}