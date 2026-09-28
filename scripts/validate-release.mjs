import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const htmlFiles = [
  "Tourism.html",
  "whale-sharks.html",
  "firefly-river.html",
  "kayaking.html",
  "travel-guide.html",
  "privacy.html",
  "accessibility.html",
  "disclaimer.html",
  "media-credits.html",
  "site-map.html"
];
const marketingPages = [
  "Tourism.html",
  "whale-sharks.html",
  "firefly-river.html",
  "kayaking.html",
  "travel-guide.html"
];
const mediaAttributePattern =
  /(?:src|poster|data-media-src|data-media-poster|data-souvenir-viewer-src)="([^"]+\.(?:jpe?g|png|webp|gif|avif|mp4|webm)[^"]*)"/gi;
const problems = [];
let mediaReferences = 0;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function resolveLocalReference(currentFile, reference) {
  const [pathname = "", fragment = ""] = reference.split("#", 2);
  const cleanPath = pathname.split("?", 1)[0];
  const targetFile = cleanPath || currentFile;
  return { targetFile, fragment };
}

for (const file of htmlFiles) {
  const content = read(file);
  const ids = [...content.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  for (const duplicateId of new Set(duplicateIds)) {
    problems.push(`${file}: duplicate id #${duplicateId}`);
  }

  for (const match of content.matchAll(/href="([^"]+)"/g)) {
    const reference = match[1];

    if (/^(?:https?:|mailto:|tel:|sms:)/i.test(reference)) continue;

    const { targetFile, fragment } = resolveLocalReference(file, reference);
    const absoluteTarget = path.join(root, targetFile);

    if (!fs.existsSync(absoluteTarget)) {
      problems.push(`${file}: missing local target ${targetFile}`);
      continue;
    }

    if (fragment && path.extname(targetFile).toLowerCase() === ".html") {
      const targetContent = read(targetFile);
      const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (!new RegExp(`\\sid=["']${escapedFragment}["']`).test(targetContent)) {
        problems.push(`${file}: missing #${fragment} in ${targetFile}`);
      }
    }
  }

  for (const match of content.matchAll(/src="([^"]+)"/g)) {
    const reference = match[1];

    if (/^(?:https?:|data:)/i.test(reference)) continue;

    const cleanPath = reference.split("?", 1)[0];

    if (cleanPath && !fs.existsSync(path.join(root, cleanPath))) {
      problems.push(`${file}: missing local source ${cleanPath}`);
    }
  }

  for (const match of content.matchAll(mediaAttributePattern)) {
    mediaReferences += 1;

    if (!match[1].startsWith("https://")) {
      problems.push(`${file}: media must use external HTTPS: ${match[1]}`);
    }
  }
}

const requiredMetadata = [
  /<title>[^<]+<\/title>/,
  /<meta\s+name="description"\s+content="[^"]+"/,
  /<link rel="canonical" href="https:\/\/www\.donsol\.gov\.ph\/[^"]+"/,
  /<meta property="og:title" content="[^"]+"/,
  /<meta property="og:description" content="[^"]+"/,
  /<meta property="og:image" content="https:\/\/[^"]+"/,
  /<meta name="twitter:title" content="[^"]+"/,
  /<meta name="twitter:description" content="[^"]+"/,
  /<meta name="twitter:image" content="https:\/\/[^"]+"/
];

for (const file of marketingPages) {
  const content = read(file);

  for (const requirement of requiredMetadata) {
    if (!requirement.test(content)) {
      problems.push(`${file}: missing required marketing metadata ${requirement}`);
    }
  }

  const structuredDataBlocks = [
    ...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
  ];

  if (!structuredDataBlocks.length) {
    problems.push(`${file}: missing JSON-LD structured data`);
  }

  for (const block of structuredDataBlocks) {
    try {
      JSON.parse(block[1]);
    } catch {
      problems.push(`${file}: invalid JSON-LD structured data`);
    }
  }
}

const sitemap = read("sitemap.xml");

for (const file of htmlFiles) {
  if (!sitemap.includes(`https://www.donsol.gov.ph/${file}`)) {
    problems.push(`sitemap.xml: missing ${file}`);
  }
}

const mainPage = read("Tourism.html");

for (const file of ["Tourism.html", "whale-sharks.html", "travel-guide.html"]) {
  const content = read(file);

  if (!/November(?:-|\s+)to(?:-|\s+)early June/i.test(content)) {
    problems.push(`${file}: missing the usual November-to-early-June whale shark season`);
  }

  if (!/February(?:-|\s+)to(?:-|\s+)May/i.test(content)) {
    problems.push(`${file}: missing the February-to-May peak planning window`);
  }

  if (!/sightings? (?:are|is|remain) never guaranteed/i.test(content)) {
    problems.push(`${file}: missing the whale shark sighting disclaimer`);
  }
}

for (const summaryId of ["whale-video-summary", "kayaking-video-summary"]) {
  if (!mainPage.includes(`id="${summaryId}"`)) {
    problems.push(`Tourism.html: missing media summary #${summaryId}`);
  }

  if (!mainPage.includes(`data-media-description-id="${summaryId}"`)) {
    problems.push(`Tourism.html: media items do not reference #${summaryId}`);
  }
}

const script = read("assets/js/tourism.js");

if (!script.includes("buildCloudinarySrcset")) {
  problems.push("assets/js/tourism.js: responsive Cloudinary image support is missing");
}

const stylesheet = read("assets/css/tourism.css");

if (!stylesheet.includes('url("../fonts/barabara-final.otf")')) {
  problems.push("assets/css/tourism.css: production font reference is incorrect");
}

if (!fs.existsSync(path.join(root, "assets/fonts/barabara-final.otf"))) {
  problems.push("assets/fonts/barabara-final.otf: production font is missing");
}

const result = {
  checkedHtmlFiles: htmlFiles.length,
  checkedMarketingPages: marketingPages.length,
  mediaReferences,
  problems
};

console.log(JSON.stringify(result, null, 2));

if (problems.length) {
  process.exitCode = 1;
}
