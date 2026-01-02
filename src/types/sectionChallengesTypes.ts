export type SectionType =
  | "popular"
  | "near"
  | "followers"
  | "moreCreators"
  | "category";

export type SectionRouteParams = {
  type?: string;
  categoryId?: string;
};

export type MetaTitle = { title: string };
export type CategoryMetaMap = Record<string, MetaTitle>;
export type SectionMetaMap = Record<SectionType, MetaTitle>;
