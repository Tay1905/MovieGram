export interface Post {
    id: string;
    youtube_video_id: string;
    youtube_channel_id: string;
    youtube_thumbnail: string;
    title: string;
    thumbnail: string;
    language: string;
    categories: any[]; // Sie können den Typ genauer angeben, wenn die Struktur der Kategorien bekannt ist
    published: string; // Das Datum sollte als Zeichenkette oder als Date-Objekt angegeben werden
    views: number;
}


