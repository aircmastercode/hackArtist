# hackArtist

An interactive React homepage featuring a spotlight cursor effect and user-choice modal.

## Features

- **Full-screen immersive experience** with background image
- **Interactive spotlight effect** that follows the user's cursor
- **Frosted glass design** with modern UI elements
- **User choice modal** with smooth animations
- **Responsive design** for all screen sizes

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How It Works

1. **Spotlight Effect**: The page tracks your cursor position and creates a radial gradient spotlight that follows your mouse movement
2. **Main Button**: Click "Begin Your Journey" to open the modal
3. **User Choice**: Select either "Explore the Arts" or "I am an Artist" to proceed
4. **Smooth Animations**: All interactions include smooth CSS animations for a polished experience

## Project Structure

```
src/
├── components/
│   ├── Homepage.js      # Main homepage component
│   └── Homepage.css     # Styling for homepage
├── App.js              # Root app component
├── App.css             # App-level styles
├── index.js            # React entry point
└── index.css           # Global styles
```

## Customization

- **Background Image**: Replace `Google_AI_Studio_2025-09-10T14_19_21.102Z.png` in the root directory
- **Colors**: Modify CSS custom properties in `Homepage.css`
- **Text Content**: Update button text and modal content in `Homepage.js`
- **Spotlight Size**: Adjust the radial gradient radius in the `.spotlight-overlay` class

## Future Enhancements

- Add routing logic for the modal options
- Implement additional interactive elements
- Add sound effects for interactions
- Create more sophisticated animations