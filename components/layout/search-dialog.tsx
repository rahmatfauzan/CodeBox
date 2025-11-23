'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, FileText, Hash, User, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  // Mock recent searches and trending
  const recentSearches = ['Next.js 15', 'React Hooks', 'TypeScript']
  const trendingTopics = ['AI & ML', 'Web Development', 'Database']

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      onOpenChange(false)
      setQuery('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search documents, tags, or authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(query)
              }
            }}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Recent Searches
              </p>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          {!query && trendingTopics.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Trending Topics
              </p>
              <div className="space-y-1">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSearch(topic)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span>{topic}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results (when typing) */}
          {query && (
            <div className="space-y-4">
              {/* Documents */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Documents
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleSearch(query)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div className="flex-1 text-left">
                      <p className="font-medium">Getting Started with {query}</p>
                      <p className="text-xs text-muted-foreground">
                        A comprehensive guide...
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Tags
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleSearch(`#${query}`)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Hash className="h-4 w-4 text-green-500" />
                    <span>{query}</span>
                  </button>
                </div>
              </div>

              {/* Authors */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Authors
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleSearch(`@${query}`)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="h-4 w-4 text-purple-500" />
                    <span>@{query}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span>↵</span>
                </kbd>
                <span>to search</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span>ESC</span>
                </kbd>
                <span>to close</span>
              </div>
            </div>
            <span className="hidden sm:inline">Press ⌘K to search anytime</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}