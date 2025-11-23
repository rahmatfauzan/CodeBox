import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Code<span className="text-indigo-600">Box</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Share and discover developer documentation, tutorials, and code
              snippets.
            </p>
            <div className="flex space-x-2">
              <Link
                href="https://github.com"
                target="_blank"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-foreground transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="hover:text-foreground transition-colors"
                >
                  Tags
                </Link>
              </li>
              <li>
                <Link
                  href="/authors"
                  className="hover:text-foreground transition-colors"
                >
                  Authors
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/licenses"
                  className="hover:text-foreground transition-colors"
                >
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CodeBox. Built for Developers by{" "}
            <Link
              href="/profile/rhmatfauzan"
              className="text-indigo-600 hover:underline"
            >
              @rhmatfauzan
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ using Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
