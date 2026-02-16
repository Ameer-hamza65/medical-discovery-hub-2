import { useState, useCallback } from 'react';
import { 
  Sparkles, Send, FileText, AlertCircle, BookOpen, 
  ClipboardList, Loader2, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIPanelProps {
  chapterTitle: string;
  chapterContent: string;
  bookTitle: string;
  onAIQuery: () => void;
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'summary' | 'qa' | 'compliance' | 'general';
}

const quickActions = [
  { label: 'Summarize Chapter', icon: FileText, type: 'summary' as const },
  { label: 'Key Clinical Points', icon: AlertCircle, type: 'compliance' as const },
  { label: 'Drug Interactions', icon: ClipboardList, type: 'qa' as const },
  { label: 'Study Guide', icon: BookOpen, type: 'general' as const },
];

export function AIPanel({ chapterTitle, chapterContent, bookTitle, onAIQuery }: AIPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (query: string, type?: AIMessage['type']) => {
    if (!query.trim() && !type) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: type ? quickActions.find(a => a.type === type)?.label || query : query,
      type: type ?? 'general',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    onAIQuery();

    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: {
          prompt: query || undefined,
          chapterContent,
          chapterTitle,
          bookTitle,
          type: type || 'default',
        },
      });

      if (error) throw error;

      const aiMessage: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data?.content || 'No response received.',
        type: type ?? 'general',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI query failed:', err);
      toast({
        title: 'AI Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
      // Remove the user message on failure
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [chapterContent, chapterTitle, bookTitle, onAIQuery, toast]);

  const handleReset = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold">AI Assistant</p>
            <p className="text-[10px] text-muted-foreground">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center py-2">
              Ask questions about <span className="font-medium">{chapterTitle}</span> or use quick actions below
            </p>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map(action => (
                <Button
                  key={action.type}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-9 gap-2"
                  onClick={() => handleSubmit(action.label, action.type)}
                >
                  <action.icon className="h-3.5 w-3.5 text-accent" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`text-sm rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary/10 ml-6'
                    : 'bg-muted/50 mr-2'
                }`}
              >
                {msg.role === 'user' && (
                  <Badge variant="secondary" className="text-[10px] mb-1">You</Badge>
                )}
                {msg.role === 'assistant' && (
                  <Badge className="text-[10px] mb-1 bg-accent/10 text-accent border-accent/20">AI</Badge>
                )}
                <div className="whitespace-pre-wrap text-xs leading-relaxed mt-1">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyzing with Gemini AI...
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border/50">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask about this chapter..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="text-xs min-h-[36px] max-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(input);
              }
            }}
          />
          <Button 
            size="icon" 
            className="h-9 w-9 flex-shrink-0"
            disabled={!input.trim() || isLoading}
            onClick={() => handleSubmit(input)}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
