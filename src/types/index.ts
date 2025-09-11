export type Artist = {
  id: string;
  name: string;
  location?: string;
  portraitUrl?: string;
  bannerUrl?: string;
  bio?: string;
};

export type Artwork = {
  id: string;
  title: string;
  imageUrl: string;
  priceUsd: number;
  artistId: string;
  artistName: string;
  category?: string;
  region?: string;
  description?: string;
  thumbnails?: string[];
};

export type CartItem = {
  artwork: Artwork;
  quantity: number;
};


