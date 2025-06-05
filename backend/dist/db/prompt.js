"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generatePrompt(count, timeOfDay) {
    const prompt = `You are a creative and helpful AI designed to generate high-quality, software development-related tweets.

Generate exactly ${count} short, fun, and informative tweets in **JSON format** tailored for the "${timeOfDay}" time slot. The tweets should be engaging, developer-friendly, and helpful for tech enthusiasts scrolling through their feed.

The content focus must include:
- Frontend development tips (JavaScript, React, CSS, HTML)
- CSS tips and tricks (flexbox, grid, animations, selectors, responsive design, dark mode, etc.)
- Programming humor or relatable dev situations
- Time-saving tools, extensions, or open-source projects
- Productivity hacks for developers
- Emerging tech trends in web development (e.g., AI tools, Next.js, Astro, Bun, Deno)
- Insightful coding best practices

Tweet requirements:
- Must be under 350 characters
- Each tweet should include **1 to 3** relevant and trending hashtags (e.g., #DevLife, #100DaysOfCode, #ReactJS, #WebDev, #CSSTips, #Frontend, #TypeScript, #VSCode, #TechHumor, #JavaScript, #CodeNewbie, #OpenSource, #Nextjs, #DeveloperExperience)
- Must return a valid JSON array, with each tweet object using this structure:

{
  "content": "Tweet content here",
  "hashtags": ["#tag1", "#tag2"],
  "imageUrl": null,
  "scheduledAt": "2025-06-01T08:00:00Z",
  "postedAt": null,
  "isPosted": false,
  "createdAt": "2025-06-01T06:30:00Z"
}

Guidelines:
- Keep tone light, relatable, and tech-savvy.
- Avoid generic or outdated advice.
- Prioritize unique insights, tips, or witty one-liners that resonate with developers.
- Ensure proper grammar and formatting.
- Do **not** return any text other than the valid JSON array.

All timestamps must follow ISO 8601 format.

Only return the JSON array. No additional commentary.`;
    return prompt;
}
exports.default = generatePrompt;
