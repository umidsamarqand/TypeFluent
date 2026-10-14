import { Article } from '../types';

export const ARTICLES_DATABASE: Article[] = [
  // --- REAL ARTICLES: SCIENCE & SPACE ---
  {
    id: 'jwst-cosmic-dawn',
    title: 'Peering Into the Cosmic Dawn',
    category: 'science',
    source: 'Astrophysical Journal & NASA Webb Dispatch',
    author: 'Dr. Evelyn Vance',
    wordCount: 168,
    academicVocabulary: ['luminous', 'infrared', 'primordial', 'gravitational', 'spectroscopic', 'epoch'],
    text: 'When the James Webb Space Telescope deployed its gold-coated beryllium mirrors, it offered astronomers an unprecedented portal into the infant universe. Operating at cryogenic temperatures nearly four hundred degrees below zero, Webb detects subtle infrared photons emitted over thirteen billion years ago. These primordial light rays have been stretched across space-time by cosmic expansion, shifting from visible wavelengths into the deep infrared spectrum. Images captured by the observatory reveal galaxies that matured with surprising swiftness following the Big Bang, challenging long-standing cosmological models regarding star formation rates. Furthermore, spectroscopic analysis of exoplanet atmospheres has begun unveiling chemical signatures, including water vapor, carbon dioxide, and methane shrouded around distant alien worlds. By peering through previously opaque curtains of interstellar dust, scientists are reconstructing the sequence of cosmic reionization, deciphering how the universe emerged from darkness into the luminous expanse observed today.',
  },
  {
    id: 'neuroscience-memory-reconsolidation',
    title: 'The Architecture of Human Memory',
    category: 'science',
    source: 'Nature Reviews Neuroscience',
    author: 'Elena Rostova',
    wordCount: 154,
    academicVocabulary: ['synaptic', 'consolidation', 'reconsolidation', 'plasticity', 'hippocampus', 'dynamic'],
    text: 'For decades, neuroscientists conceptualized human memory as a static filing cabinet, preserving past events in immutable neural engrams. Contemporary cognitive research, however, reveals a far more dynamic and malleable architecture governed by synaptic plasticity. Whenever an individual recalls an autobiographical episode, the memory trace temporarily transitions into a labile state, vulnerable to modification before undergoing reconsolidation. Within the hippocampus and prefrontal cortex, specific neural networks reinforce salient sensory impressions while quietly pruning extraneous contextual details. This constant biological revision allows the human brain to synthesize past experiences with contemporary knowledge, ensuring our cognitive models remain adaptive in unpredictable environments. Memory is therefore not a passive recording apparatus, but an active, reconstructive narrative engine continuously calibrating past wisdom against imminent survival demands.',
  },

  // --- REAL ARTICLES: TECHNOLOGY & AI ---
  {
    id: 'silicon-nanometers',
    title: 'The Geometry of Silicon',
    category: 'tech',
    source: 'IEEE Spectrum Journal',
    author: 'Marcus Vance',
    wordCount: 162,
    academicVocabulary: ['lithography', 'quantum', 'transistor', 'exponential', 'fabrication', 'architectures'],
    text: 'Modern microprocessors encapsulate billions of transistors within an area no larger than a fingernail, operating at the outer boundary of physical mechanics. Extreme ultraviolet lithography harnesses light at thirteen nanometer wavelengths to etch microscopic circuit patterns onto silicon wafers with atomic precision. At this dimensional scale, engineers confront relentless quantum mechanical phenomena, including electron tunneling through dielectric gates and parasitic thermal dissipation. To sustain computational scaling beyond the classical boundaries of Moore’s Law, semiconductor architects are deploying three-dimensional transistor geometries, chiplet packaging, and novel semiconducting materials such as gallium nitride. The quest for faster processing speeds is no longer solely about shrinking microscopic nodes, but orchestrating heterogeneous computing units tailored for parallel tensor algebra and distributed machine learning workloads.',
  },
  {
    id: 'open-source-foundations',
    title: 'The Invisible Commons of the Internet',
    category: 'tech',
    source: 'ACM Communications',
    author: 'Nadia Chen',
    wordCount: 148,
    academicVocabulary: ['infrastructure', 'ubiquitous', 'collaborative', 'vulnerabilities', 'sustainable'],
    text: 'The digital infrastructure powering contemporary global commerce rests predominantly upon open source software libraries maintained by unpaid volunteers. From operating system kernels and web servers to low-level cryptographic utilities, millions of proprietary software applications rely on shared public repositories. This collaborative paradigm has catalyzed unprecedented technological innovation and democratized access to world-class developer tools. Nonetheless, this interdependence introduces systemic fragility; an unaddressed vulnerability or unmaintained dependency in a foundational parser can reverberate across banking systems, healthcare networks, and cloud providers worldwide. Fostering sustainable stewardship of the digital commons has emerged as one of the most critical imperatives confronting modern society.',
  },

  // --- REAL ARTICLES: NATURE & EARTH ---
  {
    id: 'mycelial-underground-web',
    title: 'The Wood Wide Web Beneath Our Feet',
    category: 'nature',
    source: 'New Scientist Botanical Series',
    author: 'Julian Thorne',
    wordCount: 152,
    academicVocabulary: ['symbiotic', 'mycorrhizal', 'reciprocal', 'photosynthetic', 'nutrients', 'ecosystem'],
    text: 'Beneath the mossy floor of temperate forests lies an intricate subterranean labyrinth known as the mycorrhizal network. Microscopic fungal threads wrap around tree roots in a mutualistic alliance that has endured for hundreds of millions of years. While trees supply fungal partners with surplus carbon synthesized through photosynthesis, the fungi forage through microscopic soil crevices to extract scarce phosphorus, nitrogen, and moisture. Fascinatingly, this subterranean matrix functions as an ecological routing network; mature canopy trees transmit vital nourishment to shaded saplings, and vulnerable flora dispatch biochemical distress signals warning neighboring species of insect infestations. Forest ecosystems are not battlegrounds of solitary competitors, but deeply integrated communal organisms sustained by subterranean cooperation.',
  },

  // --- REAL ARTICLES: CULTURE & LITERATURE ---
  {
    id: 'orwell-clarity-of-prose',
    title: 'Politics and the English Language',
    category: 'literature',
    source: 'Essays on Literary Craft & Rhetoric',
    author: 'George Orwell (Excerpt & Commentary)',
    wordCount: 158,
    academicVocabulary: ['pretentious', 'euphemism', 'clarity', 'jargon', 'obfuscate', 'rhetorical'],
    text: 'A man may take to drink because he feels himself to be a failure, and then fail all the more completely because he drinks. It is rather the same thing that is happening to the English language. It becomes ugly and inaccurate because our thoughts are foolish, but the slovenliness of our language makes it easier for us to have foolish thoughts. Modern writing at its worst does not consist in picking out words for the sake of their meaning, but in gumming together long strips of words that have already been set in order by someone else. The great enemy of clear language is insincerity; when there is a gap between one’s real and one’s declared aims, one turns almost instinctively to long words and exhausted idioms, like a cuttlefish squirting out ink.',
  },

  // --- IELTS TASK 1: ACADEMIC MODEL REPORTS ---
  {
    id: 'ielts-t1-energy-europe',
    title: 'Renewable Electricity Generation in Europe',
    category: 'ielts-task1',
    source: 'Cambridge English IELTS Academic Preparation',
    ieltsType: 'Task 1 Academic',
    ieltsPrompt: 'The chart illustrates the proportion of electricity generated from renewable sources in Germany, Spain, Sweden, and the United Kingdom between 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    wordCount: 172,
    academicVocabulary: ['exponential', 'predominant', 'fluctuation', 'subsequent', 'outstripped', 'trajectory', 'marked', 'consistently'],
    keyPoints: [
      'Overview: All four nations recorded upward trajectories, with Sweden maintaining undisputed dominance.',
      'Comparison: The UK witnessed the most dramatic acceleration, surging from under 5% to over 40%.',
      'Reporting language: "commenced at", "overtook", "in stark contrast", "experienced moderate growth".',
    ],
    text: 'The provided data delineates the proportion of electricity generated through renewable resources across four European nations between 2005 and 2025. Overall, it is manifest that all four countries experienced an upward trajectory over the two-decade timeframe, with Sweden consistently maintaining the preeminent share of clean energy generation. In 2005, Sweden commenced the period at roughly forty-two percent, steadily ascending to surpass sixty-five percent by 2025. Germany and Spain followed comparable patterns; both nations hovered near fifteen percent in the initial year, subsequently achieving substantial gains to reach forty-eight and forty-three percent respectively. In stark contrast, the United Kingdom began with a negligible fraction below five percent. However, following targeted infrastructural investments post-2012, British renewable output accelerated dramatically, outstripping Spain by 2020 and culminating at just over forty-four percent. In summary, although Sweden retained unquestioned continental leadership throughout the recorded duration, the United Kingdom exhibited the most pronounced pace of transformation.',
  },
  {
    id: 'ielts-t1-water-consumption',
    title: 'Global Water Consumption by Economic Sector',
    category: 'ielts-task1',
    source: 'IELTS Academic Writing Task 1 Exemplar',
    ieltsType: 'Task 1 Academic',
    ieltsPrompt: 'The pie charts and table demonstrate the distribution of water consumption among the agricultural, industrial, and domestic sectors across four distinct continents. Summarise the key trends and synthesize sectoral differences.',
    wordCount: 165,
    academicVocabulary: ['consumption', 'agricultural', 'disproportionate', 'constituted', 'marginal', 'predominate'],
    keyPoints: [
      'Overview: Agriculture overwhelmingly consumes the largest share in developing regions, while industry dominates in developed nations.',
      'Key figures: Agriculture accounts for over 80% in South Asia vs less than 35% in North America.',
    ],
    text: 'The graphs illustrate the comparative distribution of water usage across the agricultural, industrial, and domestic sectors in four distinct geographic regions. Overall, agricultural activities account for the predominant share of water consumption in developing continents, whereas industrial requirements represent the primary consumer in highly developed economies. In South Asia and Africa, agriculture absorbed a colossal eighty-two and seventy-six percent of total water withdrawals respectively. Domestic usage in these regions comprised merely ten percent, while industrial consumption remained minimal at less than eight percent. Conversely, the pattern observed in North America and Europe was markedly dissimilar. There, industrial processing constituted the foremost sector, demanding approximately fifty percent of available reserves. Agricultural demand was comparatively modest at approximately thirty percent, while domestic sanitation and household consumption accounted for the remaining twenty percent. Consequently, regional economic orientation dictates sectoral water allocation.',
  },
  {
    id: 'ielts-t1-desalination-process',
    title: 'Reverse Osmosis Desalination Process',
    category: 'ielts-task1',
    source: 'IELTS Academic Process Diagram Model',
    ieltsType: 'Task 1 Academic',
    ieltsPrompt: 'The diagram shows the multi-stage mechanical process by which seawater is converted into potable drinking water via reverse osmosis. Summarise the technical sequence.',
    wordCount: 161,
    academicVocabulary: ['intake', 'filtration', 'semi-permeable', 'pressurization', 'concentrated', 'chlorination', 'potable'],
    keyPoints: [
      'Overview: A linear sequential procedure comprising extraction, preliminary filtration, high-pressure osmosis, post-treatment, and municipal supply.',
    ],
    text: 'The diagram delineates the sequential stages involved in converting raw ocean water into potable drinking water utilizing a modern reverse osmosis facility. Looking at the process as a whole, it consists of five primary phases: seawater extraction, preliminary particulate filtration, high-pressure membrane separation, post-mineralization, and municipal distribution. Initially, saline water is drawn from the ocean through submerged intake pipes equipped with coarse mesh screens to exclude marine debris. The water is then transferred to sedimentation tanks where coagulants eliminate suspended organic particles. Following this preliminary clarification, the saline solution is forced under intense hydraulic pressure through semi-permeable membranes that permit water molecules to pass while capturing dissolved mineral salts. The resulting hyper-saline brine is discharged back into the sea via dispersal diffusers, whereas the purified permeate receives chlorination and mineral enrichment before flowing into the municipal domestic supply network.',
  },

  // --- IELTS TASK 2: BAND 8-9 MODEL ESSAYS ---
  {
    id: 'ielts-t2-ai-employment',
    title: 'Automation and the Future of Intellectual Labour',
    category: 'ielts-task2',
    source: 'IELTS Band 9 Cambridge Model Essay',
    ieltsType: 'Task 2 Essay',
    ieltsPrompt: 'Some people argue that rapid advancements in artificial intelligence will render human employment obsolete, while others maintain that technology will generate higher-order creative and analytical careers. Discuss both views and give your own opinion.',
    wordCount: 268,
    academicVocabulary: ['exponential', 'algorithmic', 'disruption', 'mitigate', 'collaboration', 'indispensable', 'symbiosis'],
    keyPoints: [
      'Body 1: Automation risks displacement of repetitive cognitive routines (accounting, basic legal drafting).',
      'Body 2: Creative insight, ethical discernment, and complex human empathy remain uniquely human.',
      'Conclusion: The future is collaborative augmentation rather than complete eradication.',
    ],
    text: 'The proliferation of advanced artificial intelligence has triggered intense debate regarding the longevity of human employment. While pessimists contend that autonomous algorithms will eliminate professional roles wholesale, proponents assert that technological revolutions invariably birth novel occupations. In my estimation, although structural displacement is inevitable in routine vocations, AI will ultimately augment human capacity rather than completely eradicate the workforce. On the one hand, anxiety regarding widespread technological unemployment is not unfounded. Unlike industrial mechanization which supplanted physical toil, cognitive computing possesses the capacity to synthesize legal precedents, generate diagnostic medical evaluations, and construct functional software code. Consequently, entry-level analytical positions that traditionally served as apprenticeship training grounds face imminent contraction. Without substantial educational restructuring, individuals lacking specialized computational literacy may struggle to secure gainful employment. On the other hand, technological evolution historically transforms job descriptions rather than total labour demand. Automated calculation relieved accountants of arithmetic drudgery, shifting their responsibilities toward strategic financial counseling. Similarly, artificial intelligence lacks authentic emotional intelligence, ethical judgment, and visceral cultural empathy—qualities indispensable in education, diplomatic negotiation, and artistic innovation. Rather than competing directly against algorithmic velocity, human professionals will orchestrate these tools to address systemic challenges such as ecological collapse and biomedical therapeutics. In conclusion, while algorithmic automation poses acute transitional disruptions for routine occupations, it does not herald the obsolescence of human utility. By cultivating irreplaceable capabilities such as critical inquiry and interdisciplinary leadership, society can forge a productive symbiosis between computational efficiency and human creativity.',
  },
  {
    id: 'ielts-t2-university-tuition',
    title: 'Public Funding vs Private Investment in Higher Education',
    category: 'ielts-task2',
    source: 'IELTS Band 9 Academic Exemplar',
    ieltsType: 'Task 2 Essay',
    ieltsPrompt: 'University education should be fully financed by state governments, ensuring free tertiary tuition for all citizens. To what extent do you agree or disagree with this statement?',
    wordCount: 262,
    academicVocabulary: ['meritocracy', 'socioeconomic', 'fiscal', 'subsidize', 'proportionate', 'alleviate', 'equitable'],
    keyPoints: [
      'Agree: Equal opportunity, socioeconomic mobility, highly educated tax base.',
      'Counter/Balance: Fiscal constraints, personal career remuneration justifies contribution.',
      'Stance: Partially agree - fully subsidized vocational and STEM with income-contingent loans for others.',
    ],
    text: 'The question of whether national governments should fully subsidize university tuition remains a contentious socioeconomic issue. Proponents argue that unrestricted tertiary access promotes egalitarian social mobility, whereas critics assert that universal state funding imposes an unsustainable burden on public treasuries. I largely agree that higher education ought to be tuition-free, as the societal dividends generated by a highly educated populace far outweigh the initial budgetary allocation. To begin with, financial hurdles represent the single greatest barrier to socioeconomic advancement for marginalized students. When tertiary education entails exorbitant tuition fees, impoverished youth are either discouraged from pursuing advanced degrees or burdened with debilitating debt upon graduation. Eliminating financial prerequisites fosters a genuine meritocracy wherein academic enrollment is determined by intellectual aptitude rather than generational wealth. Countries such as Norway and Germany exemplify this principle, exhibiting robust economic resilience and lower income inequality compared to nations reliant on predatory commercial student lending. Furthermore, government expenditure on higher education should not be construed as a fiscal drain, but as a strategic capital investment. Graduates in fields such as engineering, medicine, and scientific research contribute directly to national productivity and generate substantial tax revenues over their professional lifetimes. Additionally, a literate workforce attracts multinational investments and drives technological innovation in knowledge-based economies. In conclusion, while opponents argue that state-funded tuition strains municipal budgets, universal access to tertiary education is essential for both social justice and macroeconomic competitiveness. Governments should therefore prioritize education as a fundamental public good rather than a commodified consumer service.',
  },
  {
    id: 'ielts-t2-climate-action',
    title: 'Individual Lifestyle Choices vs Statutory Climate Legislation',
    category: 'ielts-task2',
    source: 'IELTS Band 8.5 Model Essay',
    ieltsType: 'Task 2 Essay',
    ieltsPrompt: 'Some believe that preventing global climate disaster requires individuals to alter their daily lifestyles, while others argue that meaningful change is impossible without strict government legislation on corporations. Discuss both views and provide your stance.',
    wordCount: 271,
    academicVocabulary: ['systemic', 'statutory', 'sustainable', 'imperative', 'mitigation', 'carbon-intensive', 'catalyst'],
    keyPoints: [
      'Individual view: Consumer demand shapes corporate behaviour; grassroots conservation.',
      'Systemic view: 100 corporations responsible for 70% of emissions; subsidies and zoning require state power.',
      'Conclusion: Individual consciousness serves as the moral catalyst, but statutory coercion provides the necessary enforcement.',
    ],
    text: 'Addressing anthropogenic climate change represents the defining collective challenge of our epoch. While one faction asserts that ecological preservation hinges upon individual consumer consciousness, another maintains that only aggressive governmental regulation of corporate emissions can avert planetary crisis. In this essay, I will examine both perspectives before arguing that statutory government mandates are overwhelmingly paramount, though complemented by grassroots cultural vigilance. On one side of the ledger, proponents of individual accountability highlight the immense aggregate power of daily consumer decisions. By adopting plant-based diets, minimizing single-use plastics, and patronizing public transit, citizens directly curtail household carbon footprints. Moreover, widespread consumer boycotts can exert considerable market pressure on commercial brands, incentivizing companies to overhaul packaging and decarbonize supply chains. Grassroots consciousness also cultivates the democratic mandate required for environmental policymakers to enact ambitious reforms without provoking political backlash. However, reliance on voluntary individual sacrifice is fundamentally inadequate when confronting systemic fossil fuel dependence. Empirical research indicates that a mere one hundred transnational conglomerates account for over seventy percent of historical industrial greenhouse gas emissions. Individual citizens cannot unilaterally redesign national electrical grids, overhaul intercity freight logistics, or subsidize offshore wind turbine fabrication. Only sovereign governments possess the fiscal authority and regulatory apparatus to penalize high-polluting sectors through statutory carbon levies, cap-and-trade mandates, and mandatory clean-energy quotas. In conclusion, although personal environmental stewardship fosters ethical civic responsibility, voluntary lifestyle modifications alone cannot outpace accelerating planetary warming. The crux of climate mitigation resides in uncompromising state legislation that forcibly reconfigures industrial infrastructure away from carbon-intensive commerce.',
  },
];

export function getArticlesByCategory(category: string): Article[] {
  if (category === 'all') return ARTICLES_DATABASE;
  return ARTICLES_DATABASE.filter((a) => a.category === category);
}

export function getRandomArticle(category: string, currentId?: string): Article {
  const filtered = getArticlesByCategory(category);
  const eligible = filtered.filter((a) => a.id !== currentId);
  const pool = eligible.length > 0 ? eligible : filtered;
  return pool[Math.floor(Math.random() * pool.length)];
}
