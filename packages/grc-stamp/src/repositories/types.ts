export interface RepoListResults<T> {
  rows: T[];
  count: number;
}

export type allFilters = {[key: string]: string};

export type collection<T> = {[key: number]: T[]};
