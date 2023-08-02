

export type Song = {
    name: string;
    artist: string;
    img: string;
    cod: number;
};

export type Folder = {
    expanded: boolean;
    name: string;
    list: Song[];
    cod: number;
    color: string;
};

export interface ResultSearch {
    query: string;
    list: Song[];  
};