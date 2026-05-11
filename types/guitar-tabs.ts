export interface Genre {
  id: string
  name: string
  description: string | null
  artist_count: number
}

export interface Tuning {
  id: string
  name: string
  strings: string
}

export interface Artist {
  id: string
  name: string
  name_translated: string | null
  genre_id: string
  genre_name: string
  song_count: number
}

export interface Song {
  id: string
  title: string
  title_translated: string | null
  artist_id: string
  tab_count: number
  first_tab_id: string | null
  first_tab_source_type: "file" | "link" | null
  first_tab_source_value: string | null
  tuning_name: string | null
}

export interface RecentTab {
  accessed_at: string
  tab_id: string
  tab_description: string | null
  source_type: "file" | "link"
  source_value: string
  tuning_name: string | null
  song_id: string
  song_title: string
  song_title_translated: string | null
  artist_id: string
  artist_name: string
  artist_name_translated: string | null
  genre_id: string
}

export interface Tab {
  id: string
  description: string | null
  song_id: string
  tuning_id: string | null
  capo: number | null
  source_type: "file" | "link"
  source_value: string
  tuning: Tuning | null
}
