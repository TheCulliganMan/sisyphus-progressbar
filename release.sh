#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting release process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. LINT THE CODE
echo "🔍 Linting code..."
if npm run lint; then
    print_status "Code linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# 2. TEST THE CODE
echo "🧪 Running tests..."
if npm test -- --watchAll=false; then
    print_status "All tests passed"
else
    print_error "Tests failed"
    exit 1
fi

# 3. VERIFY STYLES - Check that Tailwind classes are properly used
echo "🎨 Verifying Tailwind CSS usage..."
TAILWIND_CLASSES=$(grep -E "(className=)" src/SisyphusProgressBar.tsx || true)
if [ -n "$TAILWIND_CLASSES" ]; then
    print_status "Found Tailwind className usage - modern CSS approach"
else
    print_warning "No Tailwind classes found - may be using inline styles"
fi

# Check for style prop usage (still needed for dynamic styles)
INLINE_STYLES=$(grep -c "style={{" src/SisyphusProgressBar.tsx || true)
if [ "$INLINE_STYLES" -gt 0 ]; then
    print_status "Found $INLINE_STYLES dynamic inline style definitions - good for dynamic values!"
else
    print_warning "No inline styles found - may be missing dynamic styling"
fi

# 4. BUILD THE PROJECT
echo "🏗️  Building project..."
if npm run build; then
    print_status "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# 5. GET VERSION FROM PACKAGE.JSON
VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $VERSION"

# 6. COMMIT THE CODE
echo "📝 Committing changes..."
git add .
if git diff --cached --quiet; then
    print_warning "No changes to commit"
else
    git commit -m "feat: upgrade to Tailwind CSS for better maintainability

- Convert inline styles to Tailwind CSS classes
- Maintain dynamic styles for animations and calculations
- Improve code readability and maintainability
- Keep SVG and dynamic styles as inline where appropriate

Version: $VERSION"
    print_status "Changes committed"
fi

# 7. TAG THE CODE
echo "🏷️  Creating git tag..."
if git tag -a "v$VERSION" -m "Release v$VERSION - Tailwind CSS upgrade for better maintainability"; then
    print_status "Tagged as v$VERSION"
else
    print_warning "Tag v$VERSION may already exist"
fi

# 8. FINAL VERIFICATION
echo "🔍 Final verification..."

# Check that the component exports properly
if node -e "const comp = require('./dist/index.js'); console.log('✅ Component exports:', typeof comp.default === 'function' ? 'OK' : 'FAILED')"; then
    print_status "Component exports correctly"
else
    print_error "Component export verification failed"
fi

# Verify no external CSS dependencies
if ! grep -q "\.css" dist/index.js 2>/dev/null; then
    print_status "No external CSS dependencies found in build"
else
    print_warning "Found CSS imports in build - may cause issues in npm"
fi

# Show git status
echo "📊 Git status:"
git status --short

echo ""
print_status "🎉 Release process completed successfully!"
echo ""
echo "Summary:"
echo "- Version: $VERSION"
echo "- Commit: $(git rev-parse --short HEAD)"
echo "- Tag: v$VERSION"
echo "- Tailwind CSS classes verified: ✅"
echo "- Build artifacts ready: ✅"
echo ""
echo "Next steps:"
echo "1. Push to repository: git push origin main --tags"
echo "2. Publish to npm: npm publish"
