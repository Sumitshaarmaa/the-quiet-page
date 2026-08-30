export type Post = {
  slug: string;
  title: string;
  type: string;
  genre: string;
  date: string;
  excerpt: string;
  content: string[];
  featured: boolean;
};

export const posts: Post[] = [
  {
    slug: "why-do-some-conversations-stay-with-us",
    title: "Why do some conversations stay with us?",
    type: "THOUGHT",
    genre: "Thoughts",
    date: "27 Aug 2026",
    excerpt:
      "Some conversations last only a few minutes, yet somehow remain with us for years.",
    featured: true,
    content: [
      "There are conversations we forget almost immediately. Then there are those strange conversations that stay.",
      "Sometimes they weren't particularly important. There was no dramatic revelation, no life-changing sentence. Perhaps it was simply the way someone looked at us, the timing of a particular sentence, or the feeling we had while listening.",
      "I think we remember certain conversations because, somewhere inside them, we recognised a part of ourselves.",
      "Maybe that's why some words continue to echo long after the person who said them has left.",
    ],
  },
  {
    slug: "the-last-train",
    title: "The Last Train",
    type: "STORY",
    genre: "Stories",
    date: "24 Aug 2026",
    excerpt:
      "A quiet story about a journey, a missed moment, and everything left unsaid.",
    featured: true,
    content: [
      "The station was almost empty when he arrived.",
      "There was one train left. The last one of the night.",
      "He stood beneath the old station clock and wondered whether arriving late was sometimes another way of choosing not to arrive at all.",
      "The train came quietly. He stepped inside.",
      "And for the first time that evening, he stopped wondering what might have happened.",
    ],
  },
  {
    slug: "what-does-success-really-mean",
    title: "What does success really mean?",
    type: "ESSAY",
    genre: "Essays",
    date: "20 Aug 2026",
    excerpt:
      "Perhaps success isn't always about reaching somewhere. Sometimes it is about understanding where you are.",
    featured: true,
    content: [
      "We are taught to think of success as a destination.",
      "A better job. More money. A bigger house. A title that sounds impressive when someone asks what we do.",
      "But there is something strange about constantly chasing a future version of ourselves.",
      "Perhaps success can also mean having enough time to notice your own life.",
      "Perhaps it means becoming someone you actually like being around.",
    ],
  },
  {
    slug: "things-i-never-say-aloud",
    title: "Things I never say aloud",
    type: "NOTE",
    genre: "Notes",
    date: "18 Aug 2026",
    excerpt:
      "There are thoughts that become clearer only when we finally give them a place to exist.",
    featured: true,
    content: [
      "Some things are easier to write than to say.",
      "Not because they are secrets, necessarily, but because spoken words disappear so quickly.",
      "Writing gives them somewhere to stay.",
      "So this page is for the things that usually remain somewhere between thought and speech.",
    ],
  },
];

export const genres = [
  {
    name: "Thoughts",
    description: "Small things worth thinking about.",
  },
  {
    name: "Stories",
    description: "Things that happened. Or perhaps didn't.",
  },
  {
    name: "Essays",
    description: "Longer thoughts, carefully unfolded.",
  },
  {
    name: "Ideas",
    description: "Things I want to explore.",
  },
  {
    name: "Notes",
    description: "Little pieces of something.",
  },
];