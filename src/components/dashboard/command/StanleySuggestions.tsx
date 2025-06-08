
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface StanleySuggestion {
  text: string;
  reason: string;
  timestamp: string;
}

interface StanleySuggestionsProps {
  suggestions: StanleySuggestion[];
  showSuggestions: boolean;
  onToggleShow: () => void;
  onClearAll: () => void;
  onUseSuggestion: (suggestion: string) => void;
}

export const StanleySuggestions: React.FC<StanleySuggestionsProps> = ({
  suggestions,
  showSuggestions,
  onToggleShow,
  onClearAll,
  onUseSuggestion
}) => {
  if (suggestions.length === 0 || !showSuggestions) return null;

  return (
    <Card className="bg-orange-900/20 border-orange-500/30 text-orange-300 backdrop-blur-md">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-orange-400 flex items-center">
            🧠 STANLEY SUGGESTS:
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleShow}
              className="ml-2 h-4 w-4 p-0 text-orange-400 hover:text-orange-300"
            >
              {showSuggestions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearAll}
            className="h-4 w-4 p-0 text-orange-400 hover:text-orange-300"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        {suggestions.slice(-1).map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-mono">
                Type: <span className="text-orange-200 font-bold">{suggestion.text}</span>
              </div>
              <div className="text-xs text-orange-400/70">{suggestion.reason}</div>
            </div>
            <Button
              size="sm"
              onClick={() => onUseSuggestion(suggestion.text)}
              className="bg-orange-600 hover:bg-orange-500 text-black text-xs ml-2 flex-shrink-0"
            >
              Use
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
