

export type Song = {
    name: string;
    artist: string;
    img: string;
    cod: number;
};

export type Folder = {
    name: string;
    list: Song[];
    cod: number;
};

export interface ResultSearch {
    query: string;
    list: Song[];  
};