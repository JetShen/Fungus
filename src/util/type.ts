import { Video } from "scrape-youtube";

export type Folder = {
    name: string;
    list: Video[];
    cod: number;
    color: string;
};

export interface ResultSearch {
    query: string;
    list: Video[];  
};