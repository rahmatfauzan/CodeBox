import Link from "next/link";
import { Code2, Github, Twitter, Instagram } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Grid Menu Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Kolom 1: Brand (Lebar 2 kolom di desktop) */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl mb-4 group"
            >
              <div className="p-1.5 bg-indigo-600 rounded-lg group-hover:rotate-3 transition-transform">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-900 dark:text-white">
                Code<span className="text-indigo-600">Box</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Platform dokumentasi developer untuk menyimpan, mengelola, dan
              membagikan snippet kode dengan bantuan AI.
            </p>
          </div>

          {/* Kolom 2: Product */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/explore"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Resources */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (Copyright & Socials) */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CodeBox. Built by Developer for
            Developers.
          </p>

          <div className="flex gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-slate-400 hover:text-pink-500 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
