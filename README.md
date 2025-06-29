# 🪨 Sisyphus Progress Bar

[![NPM Version](https://img.shields.io/npm/v/sisyphus-progressbar)](https://www.npmjs.com/package/sisyphus-progressbar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A animated React progress bar inspired by the myth of Sisyphus. Watch as our eternal hero pushes his boulder up the mountain with realistic physics-based animations, complete with philosophical quotes and engaging visual storytelling.

![Sisyphus Progress Bar Demo](https://raw.githubusercontent.com/theculliganman/sisyphus-progressbar/main/demo.gif)

## ✨ Features

- 🎬 **Physics-Based Animation** - Realistic boulder rolling and character movement
- 🎭 **Interactive Storytelling** - Sisyphus chases runaway boulders and struggles uphill
- 📚 **Philosophical Quotes** - Rotating quotes from Camus' "The Myth of Sisyphus"
- ⚡ **Dual Modes** - Use as controlled or uncontrolled component
- 🎨 **Beautiful Visuals** - Ancient Greek-inspired design with detailed animations
- 📱 **Responsive** - Works perfectly on all screen sizes
- 🔧 **TypeScript Ready** - Full type definitions included
- 🪶 **Lightweight** - Minimal dependencies, pure React

## 🚀 Quick Start

### Installation

```bash
npm install sisyphus-progressbar
```

### Basic Usage

```jsx
import React, { useState } from 'react';
import { SisyphusProgressBar } from 'sisyphus-progressbar';

function App() {
  const [progress, setProgress] = useState(50);

  return (
    <div>
      {/* Controlled Mode */}
      <SisyphusProgressBar 
        progress={progress} 
        showPercentage={true} 
      />
      
      {/* Uncontrolled Mode (Interactive) */}
      <SisyphusProgressBar showPercentage={true} />
    </div>
  );
}
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` (0-100) | `undefined` | External progress value. When provided, component becomes controlled |
| `showPercentage` | `boolean` | `true` | Whether to display the percentage indicator |

### Component Modes

#### Controlled Mode
When you provide a `progress` prop, the component becomes controlled:
- Progress is determined by your `progress` value
- No internal interactions or random events
- Perfect for actual loading states

```jsx
<SisyphusProgressBar progress={loadingPercent} />
```

#### Uncontrolled Mode (Interactive)
When no `progress` prop is provided, the component becomes interactive:
- Internal slider for manual control
- Random boulder drops every ~30 seconds
- Rotating philosophical quotes every minute
- Perfect for demos and entertainment

```jsx
<SisyphusProgressBar />
```

## 🎨 Styling

The component uses a warm, earth-toned color palette inspired by ancient Greek pottery and Mediterranean landscapes. It's designed to be visually appealing out of the box, but you can customize the container with CSS if needed.

```css
/* Example: Custom container styling */
.my-progress-container {
  background: linear-gradient(135deg, #f3e7b6 0%, #e8d5a3 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
```

## 🏗️ Development

### Running the Example

```bash
# Clone the repository
git clone https://github.com/theculliganman/sisyphus-progressbar.git
cd sisyphus-progressbar

# Install dependencies
npm install

# Build the package
npm run build

# Run the example
cd example
npm install
npm start
```

The example will open at `http://localhost:3000` and showcase all component features.

### Building from Source

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Build the package
npm run build

# Watch mode for development
npm run dev
```

## 🎭 The Story Behind

This component brings Albert Camus' philosophical meditation on absurdity to life through interactive animation. As you watch Sisyphus push his boulder, you're witnessing a metaphor for human perseverance in the face of seemingly meaningless tasks.

The component includes authentic quotes from "The Myth of Sisyphus" and demonstrates key moments from the myth:
- **The Push** - Sisyphus straining to move the boulder uphill
- **The Drop** - The boulder rolling back down (random events in uncontrolled mode)
- **The Chase** - Sisyphus pursuing his escaped burden
- **The Acceptance** - The moment of zen when progress is achieved

> "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy." - Albert Camus

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Albert Camus' "The Myth of Sisyphus"
- Greek key patterns and Mediterranean color palette
- Physics simulation inspired by real-world boulder dynamics

---

Made with ❤️ and existential philosophy. [View Demo](https://theculliganman.github.io/sisyphus-progressbar) | [Report Issues](https://github.com/theculliganman/sisyphus-progressbar/issues)
