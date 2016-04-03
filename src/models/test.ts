import { RecipeStructure } from './recipe';

interface Lunch {
  text: string;
}

interface TestResult {
  main?: Lunch[];
  soups?: Lunch[];
}

export interface TestModel {
  name: string;
  URL: string;
  type: string;
  structure: RecipeStructure;
  result?: TestResult;
}
