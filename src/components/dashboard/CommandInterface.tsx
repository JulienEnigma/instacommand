import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { StanleySuggestions } from './command/StanleySuggestions';
import { CommandInput } from './command/CommandInput';
import { CommandHistory } from './command/CommandHistory';
import api, { Command } from '@/lib/api';



interface StanleySuggestion {
  text: string;
  reason: string;
  timestamp: string;
}

export const CommandInterface = () => {
  const [commandInput, setCommandInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    {
      input: 'scan @filmmakers',
      output: 'Initiated scan on @filmmakers hashtag. Found 23 targets.',
      timestamp: '14:32:18',
      success: true
    },
    {
      input: 'status targets',
      output: 'Active: 3, Queued: 28, Completed: 15',
      timestamp: '14:30:45',
      success: true
    }
  ]);

  const [stanleySuggestions, setStanleySuggestions] = useState<StanleySuggestion[]>([
    {
      text: 'pause ops',
      reason: 'High activity detected - prevent burnout',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  ]);

  const allCommands = [
    'scan #photography', 'scan #streetphotography', 'scan #filmmaking',
    'follow @target', 'follow batch', 'follow priority',
    'status all', 'status targets', 'status campaigns',
    'pause ops', 'resume ops', 'pause campaign',
    'reflex update', 'reflex status', 'reflex revert',
    'initiate ghost_reach', 'initiate shadow_network',
    'stanley report', 'stanley analysis', 'stanley suggest',
    'export logs', 'export targets', 'clear logs'
  ];

  const quickCommands = [
    'scan #photography',
    'follow @target',
    'status all',
    'pause ops',
    'reflex update',
    'initiate ghost_reach'
  ];

  const getCommandSuggestions = (input: string) => {
    return allCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(input.toLowerCase()) && cmd !== input
    ).slice(0, 5);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const historyCommands = commandHistory.map(cmd => cmd.input);
      if (historyIndex < historyCommands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommandInput(historyCommands[historyCommands.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const historyCommands = commandHistory.map(cmd => cmd.input);
        setCommandInput(historyCommands[historyCommands.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = getCommandSuggestions(commandInput);
      if (suggestions.length > 0) {
        setCommandInput(suggestions[0]);
      }
    } else if (e.key === 'Enter' && !isExecuting) {
      executeCommand();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommandInput(value);
    setHistoryIndex(-1);
    setShowAutocomplete(value.length > 0 && getCommandSuggestions(value).length > 0);
  };

  const executeCommand = async () => {
    if (!commandInput.trim()) return;

    setIsExecuting(true);
    setShowAutocomplete(false);
    
    try {
      let response;
      let success = true;
      
      const cmd = commandInput.toLowerCase().trim();
      
      if (cmd.startsWith('scan #') || cmd.startsWith('scan @')) {
        const hashtag = cmd.replace('scan #', '').replace('scan @', '');
        response = await api.scanHashtag(hashtag);
      } else if (cmd.startsWith('follow @')) {
        const username = cmd.replace('follow @', '');
        response = await api.followUser(username);
      } else if (cmd === 'pause ops') {
        response = await api.pauseOperations();
      } else if (cmd === 'resume ops') {
        response = await api.resumeOperations();
      } else if (cmd === 'status all') {
        response = await api.getSystemStatus();
      } else if (cmd.startsWith('stanley')) {
        const context = { command: commandInput, timestamp: new Date().toISOString() };
        response = await api.stanleyInsight(context);
      } else {
        const llmResponse = await api.generateText(`Command: ${commandInput}. Provide a brief system response.`, 50);
        response = { message: llmResponse.response || 'Command processed' };
      }
      
      const newCommand: Command = {
        input: commandInput,
        output: response.message || response.success ? 'Command executed successfully' : 'Command failed',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        success: response.success !== false
      };

      setCommandHistory(prev => [...prev, newCommand].slice(-20));
      setCommandInput('');
      setIsExecuting(false);
      setHistoryIndex(-1);
      
      if (newCommand.success) {
        toast.success(`Command executed: ${commandInput}`);
      } else {
        toast.error(`Command failed: ${commandInput}`);
      }
      
    } catch (error) {
      console.error('Command execution error:', error);
      
      const newCommand: Command = {
        input: commandInput,
        output: `Error: ${error instanceof Error ? error.message : 'Backend connection failed'}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        success: false
      };

      setCommandHistory(prev => [...prev, newCommand].slice(-20));
      setCommandInput('');
      setIsExecuting(false);
      setHistoryIndex(-1);
      
      toast.error(`Command failed: ${commandInput}`);
    }
  };

  const executeSuggestion = (suggestion: string) => {
    setCommandInput(suggestion);
  };

  // Generate Stanley suggestions periodically
  useEffect(() => {
    const suggestions = [
      { text: 'pause ops', reason: 'High activity detected - prevent burnout' },
      { text: 'reflex update', reason: 'Performance decline - neural refresh needed' },
      { text: 'scan #filmfestival', reason: 'High engagement window detected' },
      { text: 'stanley analysis', reason: 'Pattern anomaly requires review' },
      { text: 'export logs', reason: 'Daily backup recommended' }
    ];

    const interval = setInterval(() => {
      const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setStanleySuggestions(prev => [...prev.slice(-2), {
        ...suggestion,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      }]);
    }, Math.random() * 15000 + 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col space-y-2">
      {stanleySuggestions.length > 0 && showSuggestions && (
        <div className="flex-shrink-0">
          <StanleySuggestions
            suggestions={stanleySuggestions}
            showSuggestions={showSuggestions}
            onToggleShow={() => setShowSuggestions(!showSuggestions)}
            onClearAll={() => setStanleySuggestions([])}
            onUseSuggestion={executeSuggestion}
          />
        </div>
      )}

      <div className="flex-shrink-0">
        <CommandInput
          commandInput={commandInput}
          isExecuting={isExecuting}
          historyIndex={historyIndex}
          showAutocomplete={showAutocomplete}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onExecute={executeCommand}
          getCommandSuggestions={getCommandSuggestions}
          setCommandInput={setCommandInput}
          quickCommands={quickCommands}
        />
      </div>

      <div className="flex-1 min-h-0">
        <CommandHistory commandHistory={commandHistory} />
      </div>
    </div>
  );
};
