"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, Save, Globe, Github, Linkedin, Twitter, Dice5 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileUpdateData, profileUpdateSchema } from "@/lib/validations";
import { updateProfileAction } from "@/lib/actions/profile";

interface SettingsProfileFormProps {
  user: any;
  profile: any;
}

export function SettingsProfileForm({ user, profile }: SettingsProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
      avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || "",
      github_url: profile?.github_url || "",
      twitter_url: profile?.twitter_url || "",
      linkedin_url: profile?.linkedin_url || "",
    },
  });

  // --- FUNGSI GENERATE AVATAR (DICEBEAR) ---
  const handleGenerateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${randomSeed}&backgroundColor=c0aede,b6e3f4,ffd5dc,ffdfbf`;
    form.setValue("avatar_url", newAvatarUrl, { shouldDirty: true });
    toast.info("Avatar baru dibuat! Klik 'Simpan' untuk menerapkan.");
  };

  // --- HANDLER SUBMIT ---
  async function onSubmit(data: ProfileUpdateData) {
    setIsSubmitting(true);
    try {
      const result = await updateProfileAction(data);
      
      if (result.success) {
        toast.success("Profil berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error("Gagal update profil", { description: result.error });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentAvatar = form.watch("avatar_url");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* --- AVATAR SECTION --- */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
           <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-md bg-white">
             <AvatarImage src={currentAvatar || ""} className="object-cover" />
             <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700 font-bold">
               {profile?.full_name?.charAt(0).toUpperCase() || "U"}
             </AvatarFallback>
           </Avatar>
           
           <div className="space-y-3 text-center sm:text-left">
             <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Foto Profil</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Gunakan avatar unik dari DiceBear.
                </p>
             </div>
             
             <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGenerateAvatar}
                  className="gap-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Dice5 className="h-4 w-4 text-indigo-600" />
                  Acak Avatar
                </Button>
                <input type="hidden" {...form.register("avatar_url")} />
             </div>
           </div>
        </div>

        {/* --- INFO DASAR --- */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Anda" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">@</span>
                    <Input placeholder="username" className="pl-8" {...field} value={field.value || ""} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio Singkat</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ceritakan sedikit tentang diri Anda..." 
                  className="resize-none h-24 bg-white dark:bg-slate-950" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Maksimal 160 karakter.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* --- SOCIAL MEDIA LINKS (GRID 2 KOLOM) --- */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-500" /> Tautan Sosial
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Website / Portfolio</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="https://domain-anda.com" className="pl-9" {...field} value={field.value || ""} />
                          </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Github className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="https://github.com/username" className="pl-9" {...field} value={field.value || ""} />
                          </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="twitter_url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Twitter / X</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="https://twitter.com/username" className="pl-9" {...field} value={field.value || ""} />
                          </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="https://linkedin.com/in/username" className="pl-9" {...field} value={field.value || ""} />
                          </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px] shadow-lg shadow-indigo-500/20">
             {isSubmitting ? (
               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
             ) : (
               <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>
             )}
          </Button>
        </div>

      </form>
    </Form>
  );
}