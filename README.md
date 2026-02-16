# MyCozyTrove

Fishing, Camping & Outdoor Gear Reviews

## About

MyCozyTrove provides honest, real-world gear reviews for fishermen, campers, and outdoor enthusiasts. Based on 20+ years of experience in Mississippi and Alabama wilderness.

## Tech Stack

- **Static Site Generator:** Eleventy (11ty) v2.0.1
- **Template Language:** Markdown with Nunjucks
- **CSS:** Custom styles in `/assets/css/`
- **Images:** Stored in `/assets/images/`

## Local Development

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run serve

# Build for production
npm run build
```

The site will be available at `http://localhost:8080`

## Directory Structure

```
MyCozyTrove/
├── _data/              # Site configuration and data files
├── _includes/          # Layout templates
├── _site/              # Generated static site (gitignored)
├── assets/
│   ├── css/            # Stylesheets
│   ├── images/         # Site images and product photos
│   └── js/             # JavaScript files
├── content/
│   ├── index.md        # Homepage
│   ├── pages/          # Static pages (About, Contact, etc.)
│   └── reviews/        # Product review pages
│       ├── power/      # Portable power reviews
│       ├── gear/       # General outdoor gear
│       ├── fishing/    # Fishing-specific gear
│       └── camping/    # Camping equipment
├── .eleventy.js        # Eleventy configuration
└── package.json        # Node dependencies

```

## Deployment

### Option 1: Cloudflare Pages (Recommended)

1. Push to GitHub repository
2. Connect Cloudflare Pages to GitHub repo
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `_site`
   - Node version: 16 or higher

### Option 2: Manual Deploy

```bash
# Build the site
npm run build

# Upload _site directory to your hosting provider
```

## Content Management

### Adding a New Product Review

1. Create a new markdown file in the appropriate category:
   ```
   content/reviews/[category]/product-name.md
   ```

2. Add front matter:
   ```yaml
   ---
   layout: base
   title: Product Name Review - Brief Description
   ---
   ```

3. Write your review using markdown
4. Add product image to `assets/images/products/`
5. Build and deploy

### Updating Site Information

- **Site metadata:** Edit `_data/site.json`
- **Homepage:** Edit `content/index.md`
- **About page:** Edit `content/pages/about.md`

## Affiliate Networks

MyCozyTrove participates in:
- Commission Junction (CJ)
- Awin

Affiliate IDs and tracking codes are managed in `_data/site.json`

## Notes

- This site was built by copying the SafeHarborPrep structure and replacing content
- The .git folder has been removed - initialize a new repository when ready
- Google Analytics tracking ID placeholder is empty - add your tracking code to `_data/site.json`

## Next Steps After Download

1. Unzip the file locally
2. Run `npm install` to install dependencies
3. Run `npm run build` to test the build
4. Initialize new Git repo: `git init`
5. Create GitHub repository and push
6. Connect to Cloudflare Pages
7. Add Google Analytics tracking code (optional)

## Support

For questions about the site structure or deployment, refer to the original SafeHarborPrep documentation or Eleventy's official docs at https://www.11ty.dev/

---

Built with Eleventy | Deployed on Cloudflare Pages
