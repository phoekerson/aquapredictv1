'use client';

import { useState } from 'react';
import { Bot, Send, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Recommendation {
  type: 'action' | 'report' | 'scenario';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export function AIGovAdvisor() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const generateResponse = async (userInput: string) => {
    if (!genAI) {
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: userInput },
        { role: 'assistant', content: 'Gemini API key manquante. Configure NEXT_PUBLIC_GEMINI_API_KEY.' }
      ]);
      return;
    }

    setLoading(true);

    try {
      const prompt = `Tu es un conseiller IA pour les gouvernements de l'Afrique et de l'Asie du Sud-Est, spécialisé dans la surveillance des eaux usées et la santé publique. Réponds en français avec un ton opérationnel, indique les priorités, mentionne la zone géographique si possible.

Question: ${userInput}`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: userInput },
        { role: 'assistant', content: response }
      ]);
    } catch (error: any) {
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: userInput },
        { role: 'assistant', content: `Erreur Gemini: ${error.message || 'Impossible de générer une réponse.'}` }
      ]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      generateResponse(input);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      default: return 'border-green-500/30 bg-green-500/10 text-green-400';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl h-[700px] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-cyan-400">AI Government Advisor</h3>
      </div>

      {/* Recommendations Panel */}
      {recommendations.length > 0 && (
        <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">Recent Recommendations</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                className={`p-2 rounded border text-xs ${getPriorityColor(rec.priority)}`}
              >
                <div className="font-semibold">{rec.title}</div>
                <div className="text-xs opacity-80 mt-1">{rec.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ask me anything about water quality surveillance, risk assessment, or public health recommendations.</p>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300'
                    : 'bg-gray-800/50 border border-gray-700/50 text-gray-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.role === 'assistant' && <Bot className="w-4 h-4 mt-0.5 text-cyan-400" />}
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 border border-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400">
                <Bot className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => generateResponse('Generate risk assessment report')}
          disabled={loading}
          className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 text-xs transition-all disabled:opacity-50"
        >
          <FileText className="w-3 h-3 inline mr-1" />
          Report
        </button>
        <button
          onClick={() => generateResponse('What are the current risk levels?')}
          disabled={loading}
          className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg text-orange-400 text-xs transition-all disabled:opacity-50"
        >
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Risks
        </button>
        <button
          onClick={() => generateResponse('Simulate outbreak scenario')}
          disabled={loading}
          className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 text-xs transition-all disabled:opacity-50"
        >
          <TrendingUp className="w-3 h-3 inline mr-1" />
          Simulate
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for recommendations, reports, or scenario simulations..."
          className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

