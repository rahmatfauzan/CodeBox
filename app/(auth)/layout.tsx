"use client";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import Link from "next/link";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <Link href="/" className="flex flex-col items-center group">
          <div className="flex items-center space-x-3 transition-transform group-hover:scale-105 duration-300">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Code<span className="text-indigo-600">Box</span>
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Developer Documentation Platform
          </p>
        </Link>
      </motion.div>
      {children}
    </div>
  );
}
