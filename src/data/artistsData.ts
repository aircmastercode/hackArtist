import { ArtistStory } from './storyData';

export interface Artist {
  id: string;
  name: string;
  craft: string;
  location: string;
  bio: string;
  image: string;
  story: ArtistStory;
}

export const artists: Artist[] = [
  {
    id: 'ramesh-kumar',
    name: 'Ramesh Kumar',
    craft: 'Terracotta Potter',
    location: 'West Bengal',
    bio: 'My hands have shaped clay for over 40 years, telling the stories of my village with every pot I create.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    story: {
      hero: {
        title: "The Art of Terracotta Pottery",
        subtitle: "A 40-Year Journey with Clay",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
      },
      sections: [
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for Ramesh Kumar story.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'left', 
              content: 'For four decades, I have been shaping clay into vessels that carry the essence of my village. Each pot tells a story of tradition, patience, and the timeless connection between earth and human hands.' 
            },
            { 
              type: 'text', 
              alignment: 'right', 
              content: 'The art of terracotta pottery in West Bengal dates back centuries. My ancestors passed down techniques that I now share with the world through ShilpSetu.' 
            },
          ]
        },
        {
          type: 'full-bleed-image',
          imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background section.'
        },
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for story conclusion.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'center', 
              content: 'Every piece I create is unique, shaped by the rhythm of my hands and the stories in my heart. Through ShilpSetu, these stories now reach homes across the world.' 
            },
          ]
        },
      ],
    }
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    craft: 'Blue Pottery Artist',
    location: 'Rajasthan',
    bio: 'Each piece I create carries the essence of Jaipur\'s royal heritage, painted with love and tradition.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    story: {
      hero: {
        title: "The Royal Art of Blue Pottery",
        subtitle: "Preserving Jaipur's Heritage",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
      },
      sections: [
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for Priya Sharma story.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'left', 
              content: 'Blue pottery is not just an art form—it\'s a legacy of Rajasthan\'s royal courts. Each piece I paint carries the elegance and grandeur of Jaipur\'s heritage.' 
            },
            { 
              type: 'text', 
              alignment: 'right', 
              content: 'The distinctive blue color comes from cobalt oxide, while the white base is made from a special blend of quartz, glass, and clay. This technique has been perfected over generations.' 
            },
          ]
        },
        {
          type: 'full-bleed-image',
          imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background section.'
        },
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for story conclusion.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'center', 
              content: 'Through ShilpSetu, I share this royal art with the world, ensuring that the beauty of Rajasthan\'s blue pottery continues to enchant generations to come.' 
            },
          ]
        },
      ],
    }
  },
  {
    id: 'arjun-patel',
    name: 'Arjun Patel',
    craft: 'Kutch Embroidery Master',
    location: 'Gujarat',
    bio: 'Through needle and thread, I weave the vibrant culture of Kutch into every intricate design.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    story: {
      hero: {
        title: "The Threads of Kutch",
        subtitle: "Weaving Stories Through Embroidery",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
      },
      sections: [
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for Arjun Patel story.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'left', 
              content: 'Kutch embroidery is more than decoration—it\'s a language of colors and patterns that tells the story of our desert land, its people, and their dreams.' 
            },
            { 
              type: 'text', 
              alignment: 'right', 
              content: 'Each stitch is placed with intention, creating geometric patterns that have been passed down through generations of women in our community.' 
            },
          ]
        },
        {
          type: 'full-bleed-image',
          imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background section.'
        },
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for story conclusion.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'center', 
              content: 'Through ShilpSetu, I bring the vibrant culture of Kutch to homes worldwide, sharing not just beautiful embroidery, but the stories woven into every thread.' 
            },
          ]
        },
      ],
    }
  },
  {
    id: 'lakshmi-devi',
    name: 'Lakshmi Devi',
    craft: 'Kantha Embroidery',
    location: 'West Bengal',
    bio: 'My grandmother taught me this art, and I continue to preserve our family\'s legacy through every stitch.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    story: {
      hero: {
        title: "The Stitches of Love",
        subtitle: "Preserving Family Legacy Through Kantha",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
      },
      sections: [
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for Lakshmi Devi story.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'left', 
              content: 'Kantha embroidery is the art of storytelling through stitches. My grandmother taught me that every pattern holds a memory, every color carries an emotion.' 
            },
            { 
              type: 'text', 
              alignment: 'right', 
              content: 'This traditional craft transforms old saris into beautiful quilts and textiles, giving new life to precious memories and creating new stories for future generations.' 
            },
          ]
        },
        {
          type: 'full-bleed-image',
          imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background section.'
        },
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for story conclusion.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'center', 
              content: 'Through ShilpSetu, I share the warmth and love embedded in every Kantha piece, connecting hearts across the world through the universal language of craft.' 
            },
          ]
        },
      ],
    }
  },
  {
    id: 'suresh-iyer',
    name: 'Suresh Iyer',
    craft: 'Tanjore Painting',
    location: 'Tamil Nadu',
    bio: 'With gold leaf and vibrant colors, I bring ancient stories to life on canvas, one painting at a time.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    story: {
      hero: {
        title: "The Divine Art of Tanjore",
        subtitle: "Painting Gods with Gold and Devotion",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
      },
      sections: [
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for Suresh Iyer story.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'left', 
              content: 'Tanjore painting is not just art—it\'s a form of worship. Each painting I create is a prayer, bringing divine energy into the homes of those who cherish them.' 
            },
            { 
              type: 'text', 
              alignment: 'right', 
              content: 'The use of gold leaf and precious stones makes each painting a treasure, while the intricate details tell stories from our rich mythology and spiritual traditions.' 
            },
          ]
        },
        {
          type: 'full-bleed-image',
          imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background section.'
        },
        {
          type: 'sticky-image-section',
          backgroundUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E",
          alt: 'Black background for story conclusion.',
          textBlocks: [
            { 
              type: 'text', 
              alignment: 'center', 
              content: 'Through ShilpSetu, I share the divine beauty of Tanjore painting with the world, spreading the spiritual essence of our ancient art form.' 
            },
          ]
        },
      ],
    }
  }
];
