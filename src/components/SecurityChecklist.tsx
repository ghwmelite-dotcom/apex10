import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "./ui";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  priority: "critical" | "high" | "medium";
}

interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
}

interface SecurityChecklistProps {
  categories: ChecklistCategory[];
}

export function SecurityChecklist({ categories }: SecurityChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.name))
  );

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const toggleCategory = (name: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedCategories(newExpanded);
  };

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedItems = checkedItems.size;
  const completionPercent = Math.round((completedItems / totalItems) * 100);

  const priorityColors = {
    critical: "danger",
    high: "warning",
    medium: "info",
  } as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-primary/20">
              <Shield className="w-5 h-5 text-accent-primary" />
            </div>
            <CardTitle>Security Checklist</CardTitle>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-text-primary">
              {completionPercent}%
            </span>
            <p className="text-sm text-text-muted">
              {completedItems}/{totalItems} completed
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-success rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryCompleted = category.items.filter((item) =>
              checkedItems.has(item.id)
            ).length;
            const isExpanded = expandedCategories.has(category.name);

            return (
              <div
                key={category.name}
                className="border border-border-default rounded-xl overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-4 bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-text-primary">
                      {category.name}
                    </h3>
                    <span className="text-sm text-text-muted">
                      {categoryCompleted}/{category.items.length}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-text-muted transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Category Items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 space-y-2">
                        {category.items.map((item) => {
                          const isChecked = checkedItems.has(item.id);

                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleItem(item.id)}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                                "hover:bg-bg-tertiary/50",
                                isChecked && "bg-accent-success/10"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                  isChecked
                                    ? "border-accent-success bg-accent-success"
                                    : "border-border-default"
                                )}
                              >
                                {isChecked && (
                                  <Check className="w-3 h-3 text-bg-primary" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "flex-1 text-left text-sm transition-all",
                                  isChecked
                                    ? "text-text-muted line-through"
                                    : "text-text-primary"
                                )}
                              >
                                {item.label}
                              </span>
                              <Badge variant={priorityColors[item.priority]}>
                                {item.priority}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
