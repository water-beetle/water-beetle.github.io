export type ArticleBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; label: string; code: string; source?: string }
  | { kind: 'note'; title: string; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; caption: string; columns: string[]; rows: string[][] }
  | { kind: 'flow'; label: string; steps: string[] };

export type OptimizationPost = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  date?: string;
  updatedDate?: string;
  topic: string;
  startingPoint: string;
  result: string;
  sections: { id: string; title: string; blocks: ArticleBlock[] }[];
  sources: { label: string; detail: string; href?: string }[];
};
