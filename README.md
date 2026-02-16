# MyCozyTrove

Honest outdoor gear reviews for fishermen, campers, and outdoor enthusiasts. Real experience from 20+ years in Mississippi and Alabama wilderness.

## Site Structure

- Built with Eleventy (11ty) static site generator
- Deployed via Cloudflare Pages
- Content managed through markdown files
- Git-based version control

## Content Categories

- **Power & Energy** - Portable power stations, solar chargers
- **Fishing Gear** - Boots, tackle storage, equipment
- **Camping Equipment** - Tents, sleeping systems, camp gear
- **Outdoor Gear** - Jackets, boots, weather protection

## Local Development

```bash
npm install
npm start
```

Site runs on http://localhost:8080

## Production Build

```bash
npm run build
```

Output in `_site/` directory

## Deployment

Automated deployment via Cloudflare Pages:
- Push to main branch triggers build
- Custom domain: mycozytrove.com
- SSL/CDN handled by Cloudflare

## Contact

admin@irongatestrategic.com

For questions about the site structure or deployment, refer to Eleventy's official docs at https://www.11ty.dev/
