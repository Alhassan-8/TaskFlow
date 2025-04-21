import React from "react";
import { Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TagManagerProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onAddTag: (tag: Omit<Tag, "id">) => void;
  onRemoveTag: (tagId: string) => void;
}

export default function TagManager({
  tags,
  selectedTags,
  onTagToggle,
  onAddTag,
  onRemoveTag,
}: TagManagerProps) {
  const [newTagName, setNewTagName] = React.useState("");
  const [newTagColor, setNewTagColor] = React.useState("#6366f1");

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      setNewTagName("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Tags Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <TagIcon className="h-4 w-4" />
          Selected Tags
        </Label>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {selectedTags.length > 0 ? (
            selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;
              return (
                <Button
                  key={tagId}
                  variant="default"
                  size="sm"
                  onClick={() => onTagToggle(tagId)}
                  className={cn(
                    "group relative transition-all duration-200",
                    "hover:scale-105 hover:shadow-md",
                    "ring-2 ring-offset-2"
                  )}
                  style={{
                    backgroundColor: `${tag.color}20`,
                    borderColor: tag.color,
                    color: tag.color,
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full mr-2 transition-transform duration-200 group-hover:scale-125"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </Button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No tags selected</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Available Tags Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <TagIcon className="h-4 w-4" />
          Available Tags
        </Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant="outline"
              size="sm"
              onClick={() => onTagToggle(tag.id)}
              className={cn(
                "group relative transition-all duration-200",
                "hover:scale-105 hover:shadow-md",
                !selectedTags.includes(tag.id) && "opacity-70"
              )}
              style={{
                borderColor: tag.color,
                color: tag.color,
              }}
            >
              <div
                className="h-2 w-2 rounded-full mr-2 transition-transform duration-200 group-hover:scale-125"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTag(tag.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Add New Tag Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Plus className="h-4 w-4" />
          Add New Tag
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="max-w-[200px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="h-8 w-8 rounded-md cursor-pointer border border-input"
              title="Choose tag color"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
              title="Add tag"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
