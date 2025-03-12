export interface Paragraph {
  paragraph: number;
  text: string;
}

export interface Subsection {
  identifier: string;
  content: string[];
}

export interface Section {
  identifier: string;
  content: string[];
  subsections: Subsection[];
}

export interface AmendmentHistory {
  date: string;
  description: string;
  legalReference: string;
}

export interface CrossReference {
  articleNumber: number;
  chapterNumber: number;
  description: string;
}

export interface Article {
  number: number;
  title: string;
  chapterNumber: number;
  chapterTitle: string;
  content?: Paragraph[] | string[];
  sections?: Section[];
  amendmentHistory: AmendmentHistory | null;
  crossReferences?: CrossReference[];
  notes?: string;
  tags?: string[];
}

export interface Chapter {
  number: number;
  title: string;
  articles: Article[];
}

export interface Constitution {
  title: string;
  chapters: Chapter[];
} 