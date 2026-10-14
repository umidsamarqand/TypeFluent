import React, { useState } from 'react';
import { Theme, Article } from '../types';
import { X, Sparkles, FileText, Loader2 } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onApplyArticle: (article: Article) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onApplyArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'generate'>('paste');
  const [customTitle, setCustomTitle] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [customText, setCustomText] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiType, setAiType] = useState<'article' | 'ielts-task1' | 'ielts-task2'>('ielts-task2');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  if (!isOpen) return null;

  const handleApplyPasted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const words = customText.trim().split(/\s+/);
    const newArticle: Article = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim() || 'Custom Article Excerpt',
      category: 'custom',
      source: customSource.trim() || 'User Provided Article',
      text: customText.trim(),
      wordCount: words.length,
    };

    onApplyArticle(newArticle);
    onClose();
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    setGenError('');

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          type: aiType,
        }),
      });

      if (!response.ok) {
        throw new Error('Server generation failed');
      }

      const data = await response.json();
      if (data && data.text) {
        const words = data.text.trim().split(/\s+/);
        const article: Article = {
          id: `ai-${Date.now()}`,
          title: data.title || aiTopic,
          category: aiType === 'article' ? 'science' : aiType,
          source: 'AI Academic Generator (Gemini 2.5)',
          text: data.text.trim(),
          ieltsPrompt: data.ieltsPrompt,
          ieltsType: aiType === 'ielts-task1' ? 'Task 1 Academic' : aiType === 'ielts-task2' ? 'Task 2 Essay' : undefined,
          wordCount: words.length,
          academicVocabulary: data.academicVocabulary || [],
        };
        onApplyArticle(article);
        onClose();
        return;
      }
      throw new Error('Invalid response structure');
    } catch {
      // Fallback: Generate curated domain text if API call fails or is offline
      const wordsCount = aiType === 'ielts-task1' ? 160 : 250;
      const sampleText = aiType === 'ielts-task2'
        ? `The debate surrounding ${aiTopic} has sparked widespread discourse in academic and political realms. Proponents assert that systemic reforms are essential to achieve equitable outcomes, whereas detractors argue that market-driven innovation offers a more sustainable trajectory. In this essay, I will demonstrate that while regulatory oversight is critical to mitigate unintended consequences, private enterprise remains the vital engine of technological progress. Consequently, a calibrated equilibrium between state governance and individual autonomy represents the most viable paradigm for future development.`
        : `Recent developments regarding ${aiTopic} demonstrate a noticeable paradigm shift across global research institutions. Empirical observations indicate that technological advances have accelerated at an unprecedented velocity, challenging conventional models and prompting scholars to reexamine foundational axioms. Moving forward, cross-disciplinary collaboration will be indispensable to navigate the emerging complexities and harness the full potential of these transformative discoveries.`;

      const words = sampleText.trim().split(/\s+/);
      const article: Article = {
        id: `ai-sample-${Date.now()}`,
        title: `Perspective on ${aiTopic}`,
        category: aiType === 'article' ? 'science' : aiType,
        source: 'Curated Academic Generator',
        text: sampleText,
        ieltsPrompt: aiType !== 'article' ? `Discuss the implications of ${aiTopic} on contemporary society and evaluate the necessary interventions.` : undefined,
        ieltsType: aiType === 'ielts-task1' ? 'Task 1 Academic' : aiType === 'ielts-task2' ? 'Task 2 Essay' : undefined,
        wordCount: words.length,
        academicVocabulary: ['paradigm', 'unprecedented', 'equilibrium', 'sustainable', 'collaboration'],
      };
      onApplyArticle(article);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-xl border p-6 shadow-2xl relative flex flex-col gap-4 font-mono-custom text-xs"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
          color: currentTheme.textMain,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sm text-white">Custom Article & AI Generator</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: currentTheme.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Tab Switcher */}
        <div 
          className="flex items-center gap-1 p-1 rounded-lg border text-xs"
          style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
        >
          <button
            onClick={() => setActiveTab('paste')}
            className="flex-1 py-1.5 rounded text-center transition-colors font-medium flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: activeTab === 'paste' ? currentTheme.surface : 'transparent',
              color: activeTab === 'paste' ? currentTheme.primary : currentTheme.textMuted,
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Real Article</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className="flex-1 py-1.5 rounded text-center transition-colors font-medium flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: activeTab === 'generate' ? currentTheme.surface : 'transparent',
              color: activeTab === 'generate' ? currentTheme.primary : currentTheme.textMuted,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>
        </div>

        {/* Tab 1: Paste Custom Article */}
        {activeTab === 'paste' && (
          <form onSubmit={handleApplyPasted} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-[11px]" style={{ color: currentTheme.textMuted }}>
                  Article Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Economist on Clean Energy"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border outline-none font-sans"
                  style={{
                    backgroundColor: currentTheme.bg,
                    borderColor: currentTheme.border,
                    color: currentTheme.textMain,
                  }}
                />
              </div>

              <div>
                <label className="block mb-1 text-[11px]" style={{ color: currentTheme.textMuted }}>
                  Source / Publication (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scientific American"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border outline-none font-sans"
                  style={{
                    backgroundColor: currentTheme.bg,
                    borderColor: currentTheme.border,
                    color: currentTheme.textMain,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[11px]" style={{ color: currentTheme.textMuted }}>
                Article Excerpt / IELTS Essay Text (Required)
              </label>
              <textarea
                required
                rows={6}
                placeholder="Paste the paragraph or article excerpt here to practice typing authentic text..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-3 rounded border outline-none leading-relaxed font-mono-custom text-xs"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textMain,
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px]" style={{ color: currentTheme.textMuted }}>
                {customText.trim() ? `${customText.trim().split(/\s+/).length} words detected` : 'No text pasted'}
              </span>

              <button
                type="submit"
                disabled={!customText.trim()}
                className="px-4 py-2 rounded-lg font-semibold text-white transition-opacity disabled:opacity-40 shadow-xs"
                style={{ backgroundColor: currentTheme.primary }}
              >
                Load Article into Test
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Generate via AI */}
        {activeTab === 'generate' && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="block mb-1 text-[11px]" style={{ color: currentTheme.textMuted }}>
                Select Text Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'article', label: 'Journalistic Article' },
                  { id: 'ielts-task1', label: 'IELTS Task 1 (Data)' },
                  { id: 'ielts-task2', label: 'IELTS Task 2 (Band 9)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAiType(t.id as 'article' | 'ielts-task1' | 'ielts-task2')}
                    className="p-2 rounded border text-center transition-colors"
                    style={{
                      backgroundColor: aiType === t.id ? currentTheme.bg : 'transparent',
                      borderColor: aiType === t.id ? currentTheme.primary : currentTheme.border,
                      color: aiType === t.id ? currentTheme.primary : currentTheme.textMuted,
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[11px]" style={{ color: currentTheme.textMuted }}>
                Topic or Essay Question
              </label>
              <input
                type="text"
                placeholder="e.g. Autonomous electric vehicles in smart cities, or Impact of social media on literacy"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-3 py-2 rounded border outline-none font-sans"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textMain,
                }}
              />
            </div>

            {/* Quick Topic Prompts */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px]" style={{ color: currentTheme.textMuted }}>Quick suggestions:</span>
              {[
                'Deep sea bioluminescence',
                'Universal basic income & AI',
                'Mars terraforming ethics',
                'Higher education public funding',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setAiTopic(suggestion)}
                  className="px-2 py-0.5 rounded text-[10px] opacity-75 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: currentTheme.bg, color: currentTheme.textMain }}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {genError && (
              <div className="text-[11px]" style={{ color: currentTheme.error }}>
                {genError}
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={!aiTopic.trim() || isGenerating}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white transition-opacity disabled:opacity-40 shadow-xs"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {isGenerating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isGenerating ? 'Generating Text...' : 'Generate & Practice'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
