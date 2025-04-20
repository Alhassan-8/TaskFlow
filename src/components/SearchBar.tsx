
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "@/context/TaskContext";
import { useToast } from "@/hooks/use-toast";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks, setSearchResults } = useTaskContext();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Esc to clear search
      if (e.key === "Escape") {
        setSearchQuery("");
        setSearchResults(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setSearchResults]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const results = tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);

    if (results.length === 0) {
      toast({
        title: "No results found",
        description: "Try a different search term",
      });
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="search-input"
        type="search"
        placeholder="Search tasks... (Ctrl+K)"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
