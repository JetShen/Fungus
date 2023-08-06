

export type Song = {
    name: string;
    artist: string;
    img: string;
    url: string;
    cod: number;
};

export type Folder = {
    name: string;
    list: Song[];
    cod: number;
    color: string;
};

export interface ResultSearch {
    query: string;
    list: Song[];  
};