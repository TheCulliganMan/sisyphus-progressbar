# Contributing to Sisyphus ProgressBar

Thank you for your interest in contributing to Sisyphus ProgressBar! This document provides guidelines and information for contributors.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/sisyphus-progressbar.git
   cd sisyphus-progressbar
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run build` - Build the package
- `npm run dev` - Build in watch mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking

## Testing

We use Jest and React Testing Library for testing. Please ensure all tests pass before submitting a PR:

```bash
npm test
```

## Code Style

We use ESLint and TypeScript for code quality. Please ensure your code:

- Follows the existing code style
- Passes ESLint checks (`npm run lint`)
- Passes TypeScript checks (`npm run type-check`)
- Includes appropriate tests for new features

## Submitting Changes

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "feat: add your feature description"
   ```

3. Push to your fork and create a pull request

## Commit Message Format

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features. Include:

- Clear description of the issue
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Browser/environment information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
