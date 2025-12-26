
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  History, 
  Trash2, 
  Copy, 
  Check, 
  ArrowRight, 
  RotateCcw,
  Layout as LayoutIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import { AdParams, AdResult } from './types';
import { PLATFORMS, TONES, CTA_STYLES } from './constants';
import { generateAdCopy } from './services/geminiService';

const App: React.FC = () => {
  const [params, setParams] = useState<AdParams>({
    productName: '',
    description: '',
    targetAudience: '',
    platform: 'Facebook',
    tone: 'Professional',
    ctaStyle: 'Direct',
    creativity: 0.7
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<AdResult | null>(null);
  const [history, setHistory] = useState<AdResult[]>([]);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ad_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('ad_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!params.productName || !params.description) {
      setError("Please fill in the product name and description.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const copy = await generateAdCopy(params);
      const newResult: AdResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        params: { ...params },
        copy
      };
      setCurrentResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 20)); // Keep last 20
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ad_history');
  };

  const loadFromHistory = (item: AdResult) => {
    setParams(item.params);
    setCurrentResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-900">
      {/* Sidebar - Form */}
      <aside className="w-full md:w-96 bg-white border-r border-slate-200 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-indigo-950">AdCraft AI</h1>
        </div>

        <div className="space-y-6">
          <section>
            <label className="block text-sm font-semibold mb-2">Product Name</label>
            <input 
              type="text" 
              placeholder="e.g. ZenFlow Meditation App"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              value={params.productName}
              onChange={e => setParams({ ...params, productName: e.target.value })}
            />
          </section>

          <section>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea 
              rows={3}
              placeholder="What makes it unique? Benefits?"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              value={params.description}
              onChange={e => setParams({ ...params, description: e.target.value })}
            />
          </section>

          <section>
            <label className="block text-sm font-semibold mb-2">Target Audience</label>
            <input 
              type="text" 
              placeholder="e.g. Busy professionals, 25-40"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              value={params.targetAudience}
              onChange={e => setParams({ ...params, targetAudience: e.target.value })}
            />
          </section>

          <section>
            <label className="block text-sm font-semibold mb-2">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setParams({ ...params, platform: p.value })}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
                    params.platform === p.value 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {p.icon}
                  {p.value}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold mb-2">Tone of Voice</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setParams({ ...params, tone: t.value })}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
                    params.tone === t.value 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {t.icon}
                  {t.value}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold mb-2">CTA Style</label>
            <div className="flex gap-2">
              {CTA_STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setParams({ ...params, ctaStyle: s })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                    params.ctaStyle === s 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold">Creativity Slider</label>
              <span className="text-xs font-mono bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                {(params.creativity * 100).toFixed(0)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={params.creativity}
              onChange={e => setParams({ ...params, creativity: parseFloat(e.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Safe</span>
              <span>Creative</span>
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting Copy...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Ad Copy
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-pulse">
              {error}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          {currentResult ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900">Campaign Draft</h2>
                  <p className="text-slate-500 mt-1">Generated for {currentResult.params.platform} • {currentResult.params.tone} Tone</p>
                </div>
                <button 
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Regenerate
                </button>
              </header>

              <div className="grid grid-cols-1 gap-6">
                {/* Headlines */}
                <Card title="Headlines / Subject Lines" icon={<LayoutIcon className="w-5 h-5" />}>
                  <div className="space-y-4">
                    {currentResult.copy.headlines.map((text, i) => (
                      <CopyItem 
                        key={`h-${i}`} 
                        text={text} 
                        onCopy={() => handleCopy(text, `h-${i}`)}
                        isCopied={copyStatus[`h-${i}`]}
                      />
                    ))}
                  </div>
                </Card>

                {/* Descriptions */}
                <Card title="Ad Descriptions / Body" icon={<ChevronRight className="w-5 h-5" />}>
                  <div className="space-y-4">
                    {currentResult.copy.descriptions.map((text, i) => (
                      <CopyItem 
                        key={`d-${i}`} 
                        text={text} 
                        onCopy={() => handleCopy(text, `d-${i}`)}
                        isCopied={copyStatus[`d-${i}`]}
                      />
                    ))}
                  </div>
                </Card>

                {/* CTAs */}
                <Card title="Call to Actions" icon={<ArrowRight className="w-5 h-5" />}>
                  <div className="flex flex-wrap gap-4">
                    {currentResult.copy.ctas.map((text, i) => (
                      <div key={`c-${i}`} className="flex-1 min-w-[200px] flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg group hover:border-indigo-300 transition-colors">
                        <span className="font-semibold text-indigo-600">{text}</span>
                        <button 
                          onClick={() => handleCopy(text, `c-${i}`)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-400 group-hover:text-indigo-500"
                        >
                          {copyStatus[`c-${i}`] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Best Practice Tip */}
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
                <div className="bg-indigo-600/10 p-2 rounded-xl h-fit">
                  <Info className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900">Pro Tip for {currentResult.params.platform}</h4>
                  <p className="text-indigo-700/80 text-sm mt-1 leading-relaxed">
                    Always focus on the *benefit* to the user rather than just listing features. 
                    AI suggests these based on your description, but feel free to add a personal touch that matches your brand story.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-40">
              <div className="bg-slate-100 p-8 rounded-full mb-6">
                <Sparkles className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold">Your Ad Copy will appear here</h3>
              <p className="mt-2 max-w-xs">Fill out the form on the left to start generating platform-optimized copy.</p>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-500" />
                  <h3 className="text-lg font-bold">Recent Generations</h3>
                </div>
                <button 
                  onClick={clearHistory}
                  className="text-sm text-slate-400 hover:text-red-500 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span className="bg-indigo-50 text-indigo-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                        {item.params.platform}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {item.params.productName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.params.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Internal Helper Components
const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
      <div className="text-indigo-600">{icon}</div>
      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{title}</h3>
    </div>
    {children}
  </section>
);

const CopyItem: React.FC<{ text: string; onCopy: () => void; isCopied: boolean }> = ({ text, onCopy, isCopied }) => (
  <div className="group relative">
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 leading-relaxed pr-12 group-hover:border-slate-200 transition-colors">
      {text}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
          {text.length} chars
        </span>
        <button 
          onClick={onCopy}
          className="p-2 bg-white shadow-sm border border-slate-200 rounded-lg hover:text-indigo-600 hover:border-indigo-200 transition-all"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
        </button>
      </div>
    </div>
  </div>
);

export default App;
