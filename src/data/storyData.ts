export interface TextBlockData {
  type: 'text';
  content: string;
  alignment: 'left' | 'center' | 'right';
}

export interface FullBleedImageData {
  type: 'full-bleed-image';
  imageUrl: string;
  alt: string;
}

export interface StickyImageSectionData {
  type: 'sticky-image-section';
  backgroundUrl: string;
  alt: string;
  textBlocks: TextBlockData[];
}

export type StorySection = StickyImageSectionData | FullBleedImageData;

export interface ArtistStory {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  sections: StorySection[];
}

export const artistStory: ArtistStory = {
  hero: {
    title: "The Exquisite Art of Pichvai Painting",
    subtitle: "A Sacred Tradition from Nathdwara",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center",
  },
  sections: [
    {
      type: 'sticky-image-section',
      backgroundUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center',
      alt: 'An artist meticulously painting a Pichvai canvas.',
      textBlocks: [
        { 
          type: 'text', 
          alignment: 'left', 
          content: 'Pichvai are intricate paintings, traditionally made on cloth, that depict tales from Lord Krishna\'s life. The word Pichvai translates to "that which hangs from the back".' 
        },
        { 
          type: 'text', 
          alignment: 'right', 
          content: 'Originating over 400 years ago in the town of Nathdwara, Rajasthan, these paintings were created to be hung behind the idol of Shrinathji, a form of Krishna.' 
        },
      ]
    } as StickyImageSectionData,
    {
      type: 'full-bleed-image',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center',
      alt: 'A close-up detail of a Pichvai painting showing the fine brushwork.'
    } as FullBleedImageData,
    {
      type: 'sticky-image-section',
      backgroundUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center',
      alt: 'Natural pigments and dyes used for Pichvai art.',
      textBlocks: [
        { 
          type: 'text', 
          alignment: 'center', 
          content: 'The colors are all-natural, derived from minerals and plants. Gold and silver are often used, creating a divine glow that catches the light.' 
        },
        { 
          type: 'text', 
          alignment: 'left', 
          content: 'Creating a single Pichvai can take several months, involving a team of artists, each specializing in a different aspect – from sketching to coloring and fine detailing.' 
        },
        { 
          type: 'text', 
          alignment: 'right', 
          content: 'Each painting tells a story, capturing moments of divine play, festivals, and the eternal love between Radha and Krishna in vibrant, living colors.' 
        },
      ]
    } as StickyImageSectionData,
    {
      type: 'full-bleed-image',
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center',
      alt: 'Traditional Pichvai painting tools and materials.'
    } as FullBleedImageData,
    {
      type: 'sticky-image-section',
      backgroundUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center',
      alt: 'A completed Pichvai painting in a temple setting.',
      textBlocks: [
        { 
          type: 'text', 
          alignment: 'center', 
          content: 'Today, Pichvai artists continue this sacred tradition, preserving not just the techniques but the spiritual essence that makes each painting a window into divine love.' 
        },
        { 
          type: 'text', 
          alignment: 'left', 
          content: 'Through ShilpSetu, these master artisans share their stories, their craft, and their devotion with the world, ensuring that this beautiful tradition lives on for generations to come.' 
        },
      ]
    } as StickyImageSectionData,
  ],
};
