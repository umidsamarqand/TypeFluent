import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// Endpoint: Generate authentic articles or IELTS writing tasks
app.post('/api/generate-article', async (req: Request, res: Response) => {
  try {
    const { topic, type } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (aiClient) {
      let prompt = '';
      if (type === 'ielts-task1') {
        prompt = `You are a Senior Cambridge IELTS Academic Examiner.
Write an authentic IELTS Writing Task 1 Academic Report model on the topic: "${topic}".
Include:
1. Title
2. Official exam prompt describing a visual data graphic (chart/graph/table/process)
3. Band 9 Model Report of approximately 160-190 words. Use sophisticated reporting verbs, comparative structures, and a clear overview paragraph.
4. List of 6-8 advanced academic vocabulary words used.

Return your response strictly in JSON format matching this schema:
{
  "title": "Short descriptive title",
  "ieltsPrompt": "The official exam prompt instruction",
  "text": "The full model report text with no markdown formatting",
  "academicVocabulary": ["word1", "word2"]
}`;
      } else if (type === 'ielts-task2') {
        prompt = `You are a Senior Cambridge IELTS Academic Examiner.
Write an authentic IELTS Writing Task 2 Academic Essay (Band 9 standard) on the topic: "${topic}".
Include:
1. Title
2. Official exam essay prompt question (Discuss both views / Agree or disagree / Problem-solution)
3. Complete Band 9 Model Essay of approximately 260-290 words. Use sophisticated cohesive devices, nuanced argumentation, formal academic tone, and advanced collocations.
4. List of 6-8 advanced academic vocabulary words used.

Return your response strictly in JSON format matching this schema:
{
  "title": "Short essay title",
  "ieltsPrompt": "The official essay question",
  "text": "The full essay text with no markdown formatting",
  "academicVocabulary": ["word1", "word2"]
}`;
      } else {
        prompt = `You are an elite science and journalistic essayist for publications like The Atlantic and Nature.
Write an engaging, authentic article excerpt on the topic: "${topic}".
Length: approximately 150-200 words.
Ensure the prose is elegant, intellectually stimulating, and rich with vocabulary suitable for typing practice.
Return your response strictly in JSON format matching this schema:
{
  "title": "Engaging Article Title",
  "text": "The full article text with no markdown formatting",
  "academicVocabulary": ["word1", "word2"]
}`;
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } else {
      // Fallback pre-crafted responses if API key is not configured
      const isTask1 = type === 'ielts-task1';
      const isTask2 = type === 'ielts-task2';

      if (isTask1) {
        return res.json({
          title: `Trends in ${topic}`,
          ieltsPrompt: `The chart illustrates changes and key shifts in ${topic} over a recent decade. Summarise the main trends and highlight notable comparisons.`,
          text: `The provided diagram illustrates key developments in ${topic} across major international markets over a ten-year duration. Overall, it is readily apparent that substantial growth was registered in virtually all categories, with technological integration exhibiting the steepest upward trajectory. Initially commencing at a relatively modest level, figures ascended steadily before experiencing an abrupt acceleration in the latter half of the timeframe. In marked comparison, conventional approaches contracted marginally, giving way to modern methodologies. In conclusion, the data demonstrates an unequivocal transition toward more sustainable and technologically advanced operations.`,
          academicVocabulary: ['substantial', 'trajectory', 'contracted', 'unequivocal', 'transition', 'acceleration'],
        });
      }

      if (isTask2) {
        return res.json({
          title: `Perspectives on ${topic}`,
          ieltsPrompt: `Rapid developments in ${topic} continue to reshape contemporary society. Some argue that this evolution is profoundly beneficial, whereas others express grave concern regarding unintended consequences. Discuss both views and give your own opinion.`,
          text: `The accelerating transformation of ${topic} has emerged as a central point of contention among scholars and policymakers alike. While proponents argue that ongoing advancements enhance efficiency and foster international collaboration, detractors caution that unchecked progress risks exacerbating existing socioeconomic disparities. In my view, although stringent regulatory frameworks are essential to curb potential hazards, the profound dividends yielded by these innovations justify their continued cultivation. To begin with, opponents raise valid objections regarding ethical dilemmas and systemic fragility. Without proactive governance, vulnerable demographics may bear the brunt of disruptive shifts. Nonetheless, technological and intellectual history consistently affirms that resistance to progress is counterproductive; rather, societies flourish when they channel novel discoveries toward collective well-being through equitable access and rigorous institutional standards. In conclusion, while the hazards associated with ${topic} must not be trivialized, strategic oversight ensures that humanity harnesses its transformative potential responsibly.`,
          academicVocabulary: ['contention', 'exacerbating', 'stringent', 'counterproductive', 'governance', 'profound'],
        });
      }

      return res.json({
        title: `The Dynamics of ${topic}`,
        text: `Investigations into ${topic} illuminate the profound intricacies underpinning modern scientific and cultural development. Over the past century, empirical methodologies have progressively superseded speculative assumptions, equipping researchers with rigorous diagnostic frameworks. As interdisciplinary boundaries dissolve, investigators from diverse fields are synthesizing novel insights that challenge long-standing paradigms. The continued pursuit of clarity in this domain underscores humanity’s enduring impulse to decipher the fundamental mechanics of the natural and intellectual cosmos.`,
        academicVocabulary: ['intricacies', 'superseded', 'interdisciplinary', 'paradigms', 'empirical'],
      });
    }
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: 'Failed to generate article' });
  }
});

// Mount Vite middleware in dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
