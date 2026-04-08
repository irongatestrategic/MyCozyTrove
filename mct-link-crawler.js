#!/usr/bin/env node

/**
 * MCT Internal Link Crawler, Fixer & Monitor
 * IronGate Strategic — MyCozyTrove
 *
 * Usage:
 *   node mct-link-crawler.js crawl      — map all links, report orphans
 *   node mct-link-crawler.js fix        — propose AI-generated link fixes
 *   node mct-link-crawler.js monitor    — check a single file before commit
 *
 * Setup:
 *   Create a .env file in F:\Affiliate-Sites\MyCozyTrove\ with:
 *   ANTHROPIC_API_KEY=your-key-here
 */

const fs = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.resolve(__dirname, 'content/reviews');
const BACKUP_DIR  = path.resolve(__dirname, '.link-fixer-backups');
const LOG_FILE    = path.resolve(__dirname, 'link-crawler.log');
const BASE_URL    = '/reviews'; // MCT URL structure: /reviews/[category]/[slug]/

// Load API key from .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    }
  }
}

loadEnv();

// ─── LOGGING ─────────────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// ─── MARKDOWN PARSER ─────────────────────────────────────────────────────────

function extractLinks(content) {
  const links = [];
  // Match markdown links [text](/path/) and HTML href="/path/"
  const mdPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  const htmlPattern = /href="(\/[^"]+)"/g;
  let match;
  while ((match = mdPattern.exec(content)) !== null) {
    links.push(match[2]);
  }
  while ((match = htmlPattern.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      fm[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  return fm;
}

// ─── CRAWLER ─────────────────────────────────────────────────────────────────

function crawl() {
  log('=== MCT LINK CRAWLER STARTING ===');

  const files = [];
  const categories = fs.readdirSync(CONTENT_DIR).filter(f => {
    return fs.statSync(path.join(CONTENT_DIR, f)).isDirectory();
  });

  // Collect all markdown files
  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    const mdFiles = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
    for (const file of mdFiles) {
      const filePath = path.join(categoryDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const fm = extractFrontmatter(content);
      const slug = fm.slug || file.replace('.md', '');
      const url = `${BASE_URL}/${category}/${slug}/`;
      files.push({ filePath, category, slug, url, content, fm });
    }
  }

  log(`Found ${files.length} markdown files across ${categories.length} categories`);

  // Build link map
  const linkMap = {};
  for (const file of files) {
    linkMap[file.url] = {
      ...file,
      outboundLinks: extractLinks(file.content),
      inboundLinks: []
    };
  }

  // Calculate inbound links
  for (const [url, data] of Object.entries(linkMap)) {
    for (const link of data.outboundLinks) {
      // Normalize link — strip trailing slash variations
      const normalized = link.endsWith('/') ? link : link + '/';
      if (linkMap[normalized]) {
        linkMap[normalized].inboundLinks.push(url);
      }
    }
  }

  // Identify orphans
  const orphans = Object.values(linkMap).filter(f => {
    const hasNoInbound = f.inboundLinks.length === 0;
    const hasNoOutbound = f.outboundLinks.filter(l => l.startsWith('/reviews')).length === 0;
    return hasNoInbound || hasNoOutbound;
  });

  // ─── REPORT ───────────────────────────────────────────────────────────────

  console.log('\n' + '═'.repeat(60));
  console.log('  MCT INTERNAL LINK REPORT');
  console.log('═'.repeat(60));
  console.log(`  Total articles:     ${files.length}`);
  console.log(`  Orphaned articles:  ${orphans.length}`);
  console.log(`  Well-linked:        ${files.length - orphans.length}`);
  console.log('═'.repeat(60));

  if (orphans.length === 0) {
    console.log('\n✅ No orphans found. All articles are linked.\n');
    return { linkMap, orphans: [] };
  }

  console.log('\n📋 ORPHANED ARTICLES:\n');

  const noInbound = orphans.filter(o => o.inboundLinks.length === 0);
  const noOutbound = orphans.filter(o =>
    o.outboundLinks.filter(l => l.startsWith('/reviews')).length === 0
  );

  if (noInbound.length > 0) {
    console.log('  ❌ NO INBOUND LINKS (nothing points to these):');
    for (const o of noInbound) {
      console.log(`     ${o.url}`);
      console.log(`     Title: ${o.fm.title || 'unknown'}`);
      console.log(`     Category: ${o.category}`);
      console.log();
    }
  }

  if (noOutbound.length > 0) {
    console.log('  ⚠️  NO OUTBOUND INTERNAL LINKS (these link nowhere):');
    for (const o of noOutbound) {
      console.log(`     ${o.url}`);
      console.log(`     Title: ${o.fm.title || 'unknown'}`);
      console.log();
    }
  }

  // Save report to log
  log(`Orphans found: ${orphans.length}`);
  for (const o of orphans) {
    log(`  ORPHAN: ${o.url} | inbound: ${o.inboundLinks.length} | outbound internal: ${o.outboundLinks.filter(l => l.startsWith('/reviews')).length}`);
  }

  console.log('═'.repeat(60));
  console.log('\nRun: node mct-link-crawler.js fix\n  to generate AI link suggestions for these orphans.\n');

  return { linkMap, orphans };
}

// ─── FIXER ───────────────────────────────────────────────────────────────────

async function fix() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('\n❌ No API key found. Add ANTHROPIC_API_KEY to your .env file.\n');
    process.exit(1);
  }

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic.default({ apiKey });

  log('=== MCT LINK FIXER STARTING ===');

  const { linkMap, orphans } = crawl();

  if (orphans.length === 0) {
    console.log('Nothing to fix.\n');
    return;
  }

  // Build context — all known articles for the AI to reference
  const articleIndex = Object.values(linkMap).map(f => ({
    url: f.url,
    title: f.fm.title || f.slug,
    category: f.category,
    description: f.fm.description || ''
  }));

  console.log('\n🤖 Generating link suggestions via Claude API...\n');
  console.log('This may take a minute for large batches.\n');

  const proposals = [];

  for (const orphan of orphans) {
    process.stdout.write(`  Analyzing: ${orphan.slug}...`);

    try {
      const prompt = `You are an SEO internal linking specialist for MyCozyTrove.com — a fishing, camping, and outdoor gear affiliate site.

ARTICLE TO FIX:
Title: ${orphan.fm.title || orphan.slug}
URL: ${orphan.url}
Category: ${orphan.category}
Content (first 2000 chars):
${orphan.content.substring(0, 2000)}

AVAILABLE ARTICLES TO LINK TO/FROM:
${JSON.stringify(articleIndex, null, 2)}

TASK:
1. Suggest 1-2 internal links TO ADD to this article (outbound links from this article to related articles)
2. Suggest 1-2 articles that SHOULD LINK TO this article (where to add an inbound link)

For each suggestion provide:
- target_url: the URL of the article to link to
- anchor_text: natural anchor text (3-6 words, no "click here")
- insertion_point: a SHORT unique phrase from the article where the link should be inserted AFTER
- link_text_to_insert: the exact markdown link text to insert: [anchor text](url)
- reasoning: one sentence why this link makes sense

Return ONLY valid JSON in this exact format:
{
  "outbound": [
    {
      "target_url": "/reviews/category/slug/",
      "anchor_text": "natural anchor text",
      "insertion_point": "unique phrase from article",
      "link_text_to_insert": "[anchor text](/reviews/category/slug/)",
      "reasoning": "one sentence"
    }
  ],
  "inbound": [
    {
      "source_url": "/reviews/category/slug/",
      "anchor_text": "natural anchor text",
      "insertion_point": "unique phrase from source article",
      "link_text_to_insert": "[anchor text](${orphan.url})",
      "reasoning": "one sentence"
    }
  ]
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });

      const raw = response.content[0].text;
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const suggestion = JSON.parse(jsonMatch[0]);
        proposals.push({ orphan, suggestion });
        process.stdout.write(' ✅\n');
      } else {
        process.stdout.write(' ⚠️ (no valid JSON returned)\n');
      }
    } catch (err) {
      process.stdout.write(` ❌ (${err.message})\n`);
    }
  }

  if (proposals.length === 0) {
    console.log('\nNo proposals generated.\n');
    return;
  }

  // ─── DISPLAY DIFF ─────────────────────────────────────────────────────────

  console.log('\n' + '═'.repeat(60));
  console.log('  PROPOSED LINK CHANGES');
  console.log('  Review carefully before approving.');
  console.log('═'.repeat(60) + '\n');

  for (const { orphan, suggestion } of proposals) {
    console.log(`📄 ${orphan.fm.title || orphan.slug}`);
    console.log(`   ${orphan.url}\n`);

    if (suggestion.outbound && suggestion.outbound.length > 0) {
      console.log('   ADD OUTBOUND LINKS FROM THIS ARTICLE:');
      for (const link of suggestion.outbound) {
        console.log(`   → Target: ${link.target_url}`);
        console.log(`     Anchor: "${link.anchor_text}"`);
        console.log(`     After:  "...${link.insertion_point}..."`);
        console.log(`     Insert: ${link.link_text_to_insert}`);
        console.log(`     Why:    ${link.reasoning}\n`);
      }
    }

    if (suggestion.inbound && suggestion.inbound.length > 0) {
      console.log('   ADD INBOUND LINKS FROM OTHER ARTICLES:');
      for (const link of suggestion.inbound) {
        console.log(`   → Source: ${link.source_url}`);
        console.log(`     Anchor: "${link.anchor_text}"`);
        console.log(`     After:  "...${link.insertion_point}..."`);
        console.log(`     Insert: ${link.link_text_to_insert}`);
        console.log(`     Why:    ${link.reasoning}\n`);
      }
    }
    console.log('─'.repeat(60) + '\n');
  }

  // Save proposals to file
  const proposalFile = path.resolve(__dirname, 'link-proposals.json');
  fs.writeFileSync(proposalFile, JSON.stringify(proposals, null, 2));
  console.log(`💾 Proposals saved to: link-proposals.json\n`);

  // ─── APPROVAL ─────────────────────────────────────────────────────────────

  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question('Apply all proposed changes? (yes/no): ', async (answer) => {
    rl.close();
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ No changes made. Review link-proposals.json and re-run when ready.\n');
      return;
    }

    // ─── BACKUP & APPLY ───────────────────────────────────────────────────

    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, backupTimestamp);
    fs.mkdirSync(backupPath);

    let changesApplied = 0;
    let changesFailed = 0;

    for (const { orphan, suggestion } of proposals) {

      // Apply outbound links to orphan article
      if (suggestion.outbound && suggestion.outbound.length > 0) {
        let content = fs.readFileSync(orphan.filePath, 'utf8');
        const backupFile = path.join(backupPath, path.basename(orphan.filePath));
        fs.writeFileSync(backupFile, content); // backup first

        for (const link of suggestion.outbound) {
          if (content.includes(link.insertion_point)) {
            content = content.replace(
              link.insertion_point,
              `${link.insertion_point} ${link.link_text_to_insert}`
            );
            changesApplied++;
            log(`Applied outbound link to ${orphan.slug}: ${link.link_text_to_insert}`);
          } else {
            changesFailed++;
            log(`FAILED to find insertion point in ${orphan.slug}: "${link.insertion_point}"`);
          }
        }
        fs.writeFileSync(orphan.filePath, content);
      }

      // Apply inbound links to source articles
      if (suggestion.inbound && suggestion.inbound.length > 0) {
        for (const link of suggestion.inbound) {
          const sourceEntry = Object.values(linkMap).find(f => f.url === link.source_url);
          if (!sourceEntry) {
            log(`FAILED to find source file for ${link.source_url}`);
            changesFailed++;
            continue;
          }

          let content = fs.readFileSync(sourceEntry.filePath, 'utf8');
          const backupFile = path.join(backupPath, path.basename(sourceEntry.filePath));
          if (!fs.existsSync(backupFile)) fs.writeFileSync(backupFile, content);

          if (content.includes(link.insertion_point)) {
            content = content.replace(
              link.insertion_point,
              `${link.insertion_point} ${link.link_text_to_insert}`
            );
            changesApplied++;
            log(`Applied inbound link in ${sourceEntry.slug} -> ${orphan.slug}`);
          } else {
            changesFailed++;
            log(`FAILED to find insertion point in ${sourceEntry.slug}: "${link.insertion_point}"`);
          }
          fs.writeFileSync(sourceEntry.filePath, content);
        }
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`  ✅ Changes applied: ${changesApplied}`);
    console.log(`  ⚠️  Changes failed:  ${changesFailed}`);
    console.log(`  💾 Backups saved to: ${backupPath}`);
    console.log('═'.repeat(60));
    console.log('\nReview changes, then git add + commit + push as normal.\n');
    console.log('To revert: copy files from backup folder back to content/reviews/\n');

    log(`Fix complete. Applied: ${changesApplied}, Failed: ${changesFailed}, Backups: ${backupPath}`);
  });
}

// ─── MONITOR ─────────────────────────────────────────────────────────────────

function monitor(filePath) {
  if (!filePath) {
    console.error('\n❌ Usage: node mct-link-crawler.js monitor <path-to-file.md>\n');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`\n❌ File not found: ${filePath}\n`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fm = extractFrontmatter(content);
  const links = extractLinks(content).filter(l => l.startsWith('/reviews'));

  console.log('\n' + '═'.repeat(60));
  console.log('  MCT LINK MONITOR');
  console.log('═'.repeat(60));
  console.log(`  File:     ${path.basename(filePath)}`);
  console.log(`  Title:    ${fm.title || 'unknown'}`);
  console.log(`  Category: ${fm.category || 'unknown'}`);
  console.log(`  Internal links found: ${links.length}`);

  if (links.length === 0) {
    console.log('\n  ⚠️  WARNING: No internal links found in this article.');
    console.log('  This article will be an orphan when published.');
    console.log('  Add at least one internal link before committing.\n');
    console.log('  Suggested action: link to the category hub page.');
    console.log(`  Example: [explore more ${fm.category || 'gear'} reviews](${BASE_URL}/${fm.category || 'gear'}/)\n`);
  } else {
    console.log('\n  ✅ Article has internal links:\n');
    for (const link of links) {
      console.log(`     ${link}`);
    }
    console.log('\n  Good to commit.\n');
  }
  console.log('═'.repeat(60) + '\n');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'crawl':
    crawl();
    break;
  case 'fix':
    fix().catch(err => {
      console.error('\n❌ Error:', err.message);
      process.exit(1);
    });
    break;
  case 'monitor':
    monitor(arg);
    break;
  default:
    console.log(`
MCT Internal Link Crawler/Fixer/Monitor
────────────────────────────────────────
Usage:
  node mct-link-crawler.js crawl              Map all links, report orphans
  node mct-link-crawler.js fix                Generate & apply AI link fixes
  node mct-link-crawler.js monitor <file>     Check a file before committing

Setup:
  Create .env in F:\\Affiliate-Sites\\MyCozyTrove\\ with:
  ANTHROPIC_API_KEY=your-key-here
    `);
}
