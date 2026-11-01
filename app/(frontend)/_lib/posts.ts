import { Author, Category, Post, Tag } from "./types";

export const authors: Author[] = [
  {
    id: "1",
    name: "Prof. Bambang Utomo",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Bambang",
    bio: "Seorang sejarawan sosial, penulis, dan blogger veteran yang lahir di Bandung. Sangat menyukai diskusi sejarah kuno, buku sastra klasik, film fiksi ilmiah (sci-fi), serta alunan musik lofi untuk menemani menulis.",
    social: {
      twitter: "bambang_utomo",
      github: "bambangutomo",
      linkedin: "bambangutomo",
    },
  },
];

export const categories: Category[] = [
  {
    id: "1",
    name: "History",
    slug: "history",
    description: "Unraveling the tales, empires, revolutions, and historical chronicles that shaped the modern world.",
    color: "#0A0A0A",
    bgColor: "#FFE500", // Yellow
    icon: "BookOpen",
    count: 28,
  },
  {
    id: "2",
    name: "Politics",
    slug: "politics",
    description: "Deep political analysis, geopolitics, democratic institutions, statecraft, and power structures.",
    color: "#FFFBF0",
    bgColor: "#FF4040", // Coral Red
    icon: "Globe",
    count: 22,
  },
  {
    id: "3",
    name: "Literature",
    slug: "literature",
    description: "Exploring literary criticisms, classical novel analysis, poetry, magical realism, and prose.",
    color: "#0A0A0A",
    bgColor: "#00FF87", // Neon Green
    icon: "PenTool",
    count: 19,
  },
  {
    id: "4",
    name: "Philosophy",
    slug: "philosophy",
    description: "Ancient wisdom, ethics, political philosophy, existentialism, and rethinking core values.",
    color: "#FFFBF0",
    bgColor: "#0057FF", // Electric Blue
    icon: "Compass",
    count: 14,
  },
  {
    id: "5",
    name: "Culture",
    slug: "culture",
    description: "Traditional folklore, art histories, performance aesthetics, and cultural transformations.",
    color: "#0A0A0A",
    bgColor: "#FF8C42", // Orange
    icon: "Sparkles",
    count: 12,
  },
  {
    id: "6",
    name: "Social Science",
    slug: "social-science",
    description: "Sociology, human geography, anthropology, and unpacking societal changes in modern societies.",
    color: "#FFFBF0",
    bgColor: "#7B2FBE", // Purple
    icon: "Users",
    count: 17,
  },
];

export const tags: Tag[] = [
  { id: "1", name: "Geopolitics", slug: "geopolitics", color: "#3178C6" },
  { id: "2", name: "Revolution", slug: "revolution", color: "#FF4040" },
  { id: "3", name: "Classics", slug: "classics", color: "#FFE500" },
  { id: "4", name: "Sovereignty", slug: "sovereignty", color: "#0A0A0A" },
  { id: "5", name: "Modernism", slug: "modernism", color: "#7B2FBE" },
  { id: "6", name: "Aesthetics", slug: "aesthetics", color: "#00FF87" },
  { id: "7", name: "Stoicism", slug: "stoicism", color: "#0057FF" },
  { id: "8", name: "Democracy", slug: "democracy", color: "#FF8C42" },
  { id: "9", name: "Empire", slug: "empire", color: "#FF6B6B" },
  { id: "10", name: "Nationalism", slug: "nationalism", color: "#264DE4" },
];

const sampleContent1 = `
## Introduction

The fall of Constantinople in 1453 represents one of the most critical turning points in human history. For over a millennium, the Byzantine Empire stood as a bulwark of Classical civilization, bridging East and West. Its collapse did not merely signal the end of the Roman Empire in the East; it radically reorganized global trade, fueled the European Renaissance, and catalyzed the Age of Discovery.

## The Siege: A Clash of Military Doctrines

The siege of Constantinople was not just a battle of armies, but a collision of two distinct military philosophies and eras:

- **The Medieval Walls**: The Theodosian Walls, which had withstood assaults for nearly 1,000 years, represented the pinnacle of medieval defensive architecture.
- **The Gunpowder Age**: Sultan Mehmed II introduced revolutionary siege artillery, notably the super-cannons engineered by the Hungarian founder Urban, which shattered the ancient stone defenses.

\`\`\`
[1453 Siege Statistics]
=======================================
Ottoman Forces: ~80,000 - 100,000 men
Byzantine Defenders: ~7,000 - 8,000 men
Duration: 53 Days (April 6 - May 29)
Artillery: 68 massive cannons
=======================================
\`\`\`

## Geopolitical Rebirth and Trade Realignments

The immediate consequence of the Ottoman victory was the closure of the traditional Silk Road trade routes to European merchants. This created an urgent geopolitical necessity:

1. **Oceanic Exploration**: Spain and Portugal were forced to look westward and southward, leading directly to the voyages of Vasco da Gama and Christopher Columbus.
2. **Economic Migration**: Byzantine scholars fled to Italy, bringing priceless classical Greek and Roman manuscripts, which sparked the intellectual flames of the Renaissance.

## Conclusion

The year 1453 acts as a clean boundary between the Middle Ages and Modernity. It proved that Stone Walls could no longer withstand Gunpowder, and that closed land routes inevitably force humanity to explore the vast, open oceans.
`;

const sampleContent2 = `
## Introduction

Rethinking Niccolò Machiavelli in the 21st century requires looking past the cliché of "ends justifying the means." Machiavelli was a realist analyst of power, writing during a time of extreme Italian political fragmentation. Today, as power shifts from physical territories to digital networks, his concepts of *Virtù* (ability) and *Fortuna* (fate) take on entirely new meanings in the realm of digital sovereignty and algorithmic statecraft.

## Virtù and Fortuna in the Age of Algorithms

For Machiavelli, a leader's success depended on balancing *Virtù* and *Fortuna*. In the modern digital landscape:

- **Modern Fortuna**: The unpredictable chaos of global networks, data leaks, information warfare, and algorithmic shifts.
- **Modern Virtù**: A state's capacity to master digital infrastructure, protect network boundaries, and direct public sentiment.

\`\`\`
[The Architecture of Digital Virtù]
===================================================
1. Infrastructure Independence (Cloud & Chips)
2. Cyber-Defense Sovereignty (Cryptographic Resilience)
3. Algorithmic Mastery (Information Flow Control)
===================================================
\`\`\`

## The Modern Prince: The Platform as Sovereign

Today, the "Prince" is not always a single statesman; it is often a technological platform or state-backed intelligence agency. These modern entities wield sovereignty by directing:

1. **Information Scarcity**: Deciding which topics are amplified or suppressed in the digital public square.
2. **Cognitive Security**: Protecting citizens from coordinated misinformation while projecting soft power abroad.

## Conclusion

Machiavelli's core message remains true: power is never static. To maintain sovereignty, modern states must understand that the battles of the 21st century are fought not on open fields, but across submarine cables, server farms, and cognitive spaces.
`;

const sampleContent3 = `
## Introduction

Gabriel García Márquez's *One Hundred Years of Solitude* is the definitive masterpiece of Magical Realism. Through the rise and fall of the mythical town of Macondo and the Buendía family, García Márquez created a literary mirror of Latin American history. By blending the supernatural with the mundane, he expressed deep truths about colonial trauma, political violence, and the cyclical nature of human isolation.

## The Mechanics of Magical Realism

Magical realism is not fantasy; it is an aesthetic strategy where the supernatural is treated as an ordinary aspect of daily life, while real historical atrocities are depicted with surreal horror:

- **Ordinary Magic**: Remedios the Beauty ascending to heaven while hanging laundry, or a yellow butterfly trail following a lover.
- **Surreal Reality**: The banana massacre where thousands of workers are killed, but their bodies disappear and the memory of their death is systematically erased from public consciousness.

\`\`\`
[Macondo's Metaphorical Stages]
=========================================
1. Isolation & Innocence (Founding)
2. Scientific Awakening (Melquíades' Ice)
3. Civil War & Politics (Colonel Aureliano)
4. Imperialist Capitalism (Banana Company)
5. Apocalyptic Rain & Deluge (The Wind)
=========================================
\`\`\`

## Solitude as a Political Metaphor

Solitude in the novel is not merely a psychological condition; it is a political condition. The Buendía family is condemned to solitude because they lack the capacity for solidarity:

1. **The Trap of Memory**: Repeating historical civil wars without actual ideological conviction.
2. **Post-Colonial Isolation**: The struggle of Latin American societies to write their own histories in the shadow of external imperial powers.

## Conclusion

*One Hundred Years of Solitude* teaches us that without historical solidarity and memory, societies are condemned to repeat their tragedies, spinning forever in a cycle of solitude.
`;

export const posts: Post[] = [
  {
    id: "1",
    title: "The Fall of Constantinople 1453: Geopolitical Rebirth and Trade Realignment",
    slug: "fall-of-constantinople-1453-geopolitical-turning-point",
    excerpt:
      "Explore how the fall of Byzantium shattered medieval trade, forced European explorers into the oceans, and laid the foundations of the Modern Age.",
    content: sampleContent1,
    coverImage:
      "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[0],
    tags: [tags[8], tags[0], tags[1]],
    publishedAt: "2026-05-20T08:00:00Z",
    updatedAt: "2026-05-20T08:00:00Z",
    readingTime: 8,
    featured: true,
    views: 4821,
    likes: 312,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "the-siege-a-clash-of-military-doctriness", title: "The Siege: A Clash of Military Doctrines", level: 2 },
      { id: "geopolitical-rebirth-and-trade-realignments", title: "Geopolitical Rebirth and Trade Realignments", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: "2",
    title: "Machiavelli in the 21st Century: Power, Realism, and Digital Sovereignty",
    slug: "machiavelli-21st-century-digital-sovereignty",
    excerpt:
      "A realist rethinking of 'The Prince' in the age of algorithmic statecraft, platform monopolies, and information warfare.",
    content: sampleContent2,
    coverImage:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[1],
    tags: [tags[0], tags[3], tags[7]],
    publishedAt: "2026-05-18T09:00:00Z",
    updatedAt: "2026-05-19T10:00:00Z",
    readingTime: 12,
    featured: true,
    views: 7203,
    likes: 589,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "virtu-and-fortuna-in-the-age-of-algorithms", title: "Virtù and Fortuna in the Age of Algorithms", level: 2 },
      { id: "the-modern-prince-the-platform-as-sovereign", title: "The Modern Prince: The Platform as Sovereign", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: "3",
    title: "Magical Realism in García Márquez's One Hundred Years of Solitude",
    slug: "magical-realism-garcia-marquez-solitude",
    excerpt:
      "Dissecting literary aesthetics, buendía family isolation, and Latin American historical memory reflected in the mystical Macondo.",
    content: sampleContent3,
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[2],
    tags: [tags[2], tags[5], tags[9]],
    publishedAt: "2026-05-15T07:00:00Z",
    updatedAt: "2026-05-15T07:00:00Z",
    readingTime: 15,
    featured: true,
    views: 9841,
    likes: 743,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "the-mechanics-of-magical-realism", title: "The Mechanics of Magical Realism", level: 2 },
      { id: "solitude-as-a-political-metaphor", title: "Solitude as a Political Metaphor", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: "4",
    title: "Rethinking the Silk Road: The Network that Bound Ancient Civilizations",
    slug: "rethinking-silk-road-ancient-networks",
    excerpt:
      "Beyond trade carts: how the legendary Silk Road hosted the migration of philosophies, spiritual practices, and linguistic traits.",
    content: sampleContent1,
    coverImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[0],
    tags: [tags[8], tags[2]],
    publishedAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-05-12T10:00:00Z",
    readingTime: 6,
    featured: false,
    views: 3201,
    likes: 218,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: "5",
    title: "Stoic Wisdom for Modern Political Turbulence",
    slug: "stoic-wisdom-modern-political-turbulence",
    excerpt:
      "How Seneca, Epictetus, and Marcus Aurelius can guide contemporary leaders and citizens amidst polarized global narratives.",
    content: sampleContent2,
    coverImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[3],
    tags: [tags[6], tags[3]],
    publishedAt: "2026-05-10T08:00:00Z",
    updatedAt: "2026-05-10T08:00:00Z",
    readingTime: 10,
    featured: false,
    views: 5432,
    likes: 401,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: "6",
    title: "The Evolution of Indonesian Modern Literature: From Balai Pustaka to Today",
    slug: "evolution-indonesian-modern-literature",
    excerpt:
      "A historical trace of Pujangga Baru, Angkatan 45, and how contemporary authors express post-colonial identity and dissent.",
    content: sampleContent3,
    coverImage:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[2],
    tags: [tags[9], tags[5]],
    publishedAt: "2026-05-08T11:00:00Z",
    updatedAt: "2026-05-08T11:00:00Z",
    readingTime: 7,
    featured: false,
    views: 2891,
    likes: 187,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: "7",
    title: "The Aesthetics of Javanese Puppetry: Philosophy in Shadow and Sound",
    slug: "aesthetics-javanese-puppetry-philosophy-shadow",
    excerpt:
      "An anthropological exploration of Wayang Kulit. Dissecting the cosmic struggles, spiritual values, and moral codes in shadows.",
    content: sampleContent1,
    coverImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[4],
    tags: [tags[5], tags[2]],
    publishedAt: "2026-05-05T09:00:00Z",
    updatedAt: "2026-05-05T09:00:00Z",
    readingTime: 9,
    featured: false,
    views: 4102,
    likes: 267,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: "8",
    title: "Imagined Communities: How Printing Press Created Modern Nationalism",
    slug: "imagined-communities-printing-press-nationalism",
    excerpt:
      "Analyzing Benedict Anderson's framework: how print-capitalism paved the way for national sovereignty and imagined linkages.",
    content: sampleContent2,
    coverImage:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&h=450&fit=crop",
    author: authors[0],
    category: categories[5],
    tags: [tags[9], tags[3]],
    publishedAt: "2026-05-02T08:00:00Z",
    updatedAt: "2026-05-02T08:00:00Z",
    readingTime: 13,
    featured: false,
    views: 6723,
    likes: 521,
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
];

export const getFeaturedPosts = (): Post[] =>
  posts.filter((p) => p.featured).slice(0, 3);

export const getLatestPosts = (limit?: number): Post[] => {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
};

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const getPostsByCategory = (categorySlug: string): Post[] =>
  posts.filter((p) => p.category.slug === categorySlug);

export const getRelatedPosts = (post: Post, limit = 3): Post[] =>
  posts
    .filter((p) => p.id !== post.id && p.category.id === post.category.id)
    .slice(0, limit);

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const quotes = [
  {
    text: "Those who cannot remember the past are condemned to repeat it.",
    author: "George Santayana",
  },
  {
    text: "Man is born free, and everywhere he is in chains.",
    author: "Jean-Jacques Rousseau",
  },
  {
    text: "There is no greater agony than bearing an untold story inside you.",
    author: "Maya Angelou",
  },
  {
    text: "The library is an archive of the desires of the human soul.",
    author: "Jorge Luis Borges",
  },
  {
    text: "Politics is the art of the possible, the attainable.",
    author: "Otto von Bismarck",
  },
];
