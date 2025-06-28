# Sisyphus Progress Bar

An animated React progress bar component inspired by the myth of Sisyphus, featuring a dynamic character pushing a boulder up a mountain with realistic physics and philosophical quotes.

![Sisyphus ProgressBar Demo](https://via.placeholder.com/600x300/F59E0B/FFFFFF?text=Sisyphus+ProgressBar+Demo)

## Features

- 🎨 **Beautiful SVG Animation**: Hand-crafted SVG graphics with smooth animations
- ⚡ **Realistic Physics**: Boulder rolling, character chasing, and pushing mechanics
- 📖 **Philosophical Quotes**: Rotating quotes from Albert Camus' "The Myth of Sisyphus"
- 🎛️ **Flexible Control**: Use as controlled or uncontrolled component
- 🎭 **Multiple Animation States**: Normal, chasing, and pushing phases
- 💧 **Sweat Effects**: Visual feedback based on progress and effort
- 🌅 **Atmospheric Details**: Greek columns, sun, clouds, and marble textures
- 📱 **Responsive Design**: Works on all screen sizes
- 🎯 **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install sisyphus-progressbar
```

## Usage

### Basic Usage (Uncontrolled)

```tsx
import React from 'react';
import SisyphusProgressBar from 'sisyphus-progressbar';

function App() {
  return (
    <div>
      <h1>Loading...</h1>
      <SisyphusProgressBar />
    </div>
  );
}
```

### Controlled Usage

```tsx
import React, { useState, useEffect } from 'react';
import SisyphusProgressBar from 'sisyphus-progressbar';

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0; // Reset for demo
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h1>Upload Progress</h1>
      <SisyphusProgressBar 
        progress={progress} 
        showPercentage={true} 
      />
    </div>
  );
}
```

### Hide Percentage

```tsx
<SisyphusProgressBar 
  progress={75} 
  showPercentage={false} 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | `undefined` | Progress value (0-100). When provided, the component becomes controlled. |
| `showPercentage` | `boolean` | `true` | Whether to show the percentage display in the bottom right corner. |

## Animation States

The progressbar has three distinct animation states:

1. **Normal**: Sisyphus steadily pushes the boulder upward
2. **Chasing**: When progress decreases or random drops occur, Sisyphus chases the rolling boulder
3. **Pushing**: Sisyphus catches up and pushes the boulder back up the mountain

## Philosophy

This component is inspired by Albert Camus' essay "The Myth of Sisyphus" and includes rotating philosophical quotes:

- "The struggle itself toward the heights is enough to fill a man's heart."
- "There is no fate that cannot be surmounted by scorn."
- "One must imagine Sisyphus happy." (shown when progress reaches 95%+)

## Styling

The component uses Tailwind CSS classes for styling. Make sure you have Tailwind CSS configured in your project, or the component will fall back to basic styling.

### Required CSS Classes

The component uses these Tailwind classes:
- Layout: `w-full`, `max-w-md`, `mx-auto`, `p-4`, `space-y-4`
- Background: `bg-amber-50`, `bg-amber-100`, `bg-orange-50`
- Colors: `text-amber-800`, `text-amber-900`, `border-amber-700`
- Effects: `shadow-2xl`, `rounded-lg`, `opacity-*`

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with SVG support

## Performance

The component uses `requestAnimationFrame` for smooth 60fps animations and includes performance optimizations:
- Capped delta time to prevent large jumps
- Efficient state updates
- Minimal re-renders

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Your Name]

## Credits

- Inspired by Albert Camus' "The Myth of Sisyphus"
- SVG animations and physics simulation
- Greek architectural elements and styling
