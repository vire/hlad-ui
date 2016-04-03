export interface RecipeStructure {
  main?: any;
  side?: any;
}

export interface RecipeModel {
  structure?: RecipeStructure;
  URL: string;
  name: string;
  type: string;
  ID: string;
}
