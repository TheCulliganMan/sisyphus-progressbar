# 🪨 Sisyphus Progress Bar

[![NPM Version](https://img.shields.io/npm/v/sisyphus-progressbar)](https://www.npmjs.com/package/sisyphus-progressbar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

An animated React progress bar inspired by the myth of Sisyphus. Watch Sisyphus push his boulder up the mountain with physics-based animations and philosophical quotes.

## 🌟 [**View Live Demo →**](https://theculliganman.github.io/sisyphus-progressbar)

![Sisyphus Progress Bar Demo](https://raw.githubusercontent.com/theculliganman/sisyphus-progressbar/main/demo.gif)

## Features

- Physics-based boulder rolling and character movement
- Interactive storytelling - Sisyphus chases runaway boulders 
- Rotating quotes from Camus' "The Myth of Sisyphus"
- Works as controlled or uncontrolled component
- Ancient Greek-inspired design
- Responsive and TypeScript ready

## Quick Start

```bash
npm install sisyphus-progressbar
```

```jsx
import { SisyphusProgressBar } from 'sisyphus-progressbar';

function App() {
  const [progress, setProgress] = useState(50);

  return (
    <div>
      {/* Controlled mode */}
      <SisyphusProgressBar progress={progress} />
      
      {/* Interactive mode */}
      <SisyphusProgressBar />
    </div>
  );
}
```

## API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` (0-100) | `undefined` | Progress value. Makes component controlled when provided |
| `showPercentage` | `boolean` | `true` | Show percentage display |

**Controlled mode:** Provide a `progress` value to control it yourself.

**Interactive mode:** Leave `progress` undefined and it becomes interactive with a slider, random boulder drops, and rotating quotes.

## Development

```bash
git clone https://github.com/theculliganman/sisyphus-progressbar.git
cd sisyphus-progressbar
npm install
npm run build

# Run the example
cd example
npm install  
npm start
```

## About

This component is inspired by Albert Camus' "The Myth of Sisyphus". It shows the eternal struggle of pushing a boulder uphill, but with a twist - the boulder sometimes rolls back down on its own, and Sisyphus has to chase after it.

> "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy." - Albert Camus

## License

MIT
