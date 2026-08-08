export const promptService = {
  buildSuggestionPrompt(activityData: any): string {
    const { commits, pullRequests, codingMinutes, repositories, languages, commitDetails } = activityData;
    
    let commitsContext = "";
    if (Array.isArray(commitDetails) && commitDetails.length > 0) {
      commitsContext = commitDetails.map((c: any, i: number) => {
        let filesList = "";
        if (Array.isArray(c.files) && c.files.length > 0) {
          filesList = c.files.map((f: any) => `- ${f.filename} (+${f.additions}, -${f.deletions})`).join("\n");
        }
        return `Commit #${i + 1}:
Message: "${c.message}"
Repository: ${c.repo}
Lines changed: +${c.additions}, -${c.deletions}
Files Modified:
${filesList}
`;
      }).join("\n---\n");
    }

    return `You are an expert technical content writer and developer advocate. Write 4-5 high-quality, engaging, and professional LinkedIn posts based on the developer's activity today.

Developer's Today Activity Stats:
- Commits count: ${commits}
- Pull Requests count: ${pullRequests}
- Coding Time: ${Math.floor(codingMinutes / 60)}h ${codingMinutes % 60}m
- Repositories worked on: ${Array.isArray(repositories) ? repositories.join(", ") : "None"}
- Languages breakdown: ${JSON.stringify(languages)}

Detailed Commits with files changed:
${commitsContext || "No commit details available."}

Requirements for the posts:
1. Write 4-5 distinct suggestions (e.g. Storytelling format, Technical deep-dive, Humorous hook, Bulleted key-learnings).
2. Avoid generic corporate buzzwords. Keep the tone authentic, conversational, and highly appealing to other developers.
3. Keep the length suitable for LinkedIn (concise, clear spacing, clear hooks).
4. Use standard developer terminology.
5. Return the result strictly as a JSON array of objects. Do not wrap the JSON in markdown code blocks. Do not write any explanatory text before or after the JSON.

Expected JSON Output Format:
[
  {
    "title": "Humorous Hook",
    "content": "Post content goes here..."
  },
  {
    "title": "Technical Storytelling",
    "content": "Post content goes here..."
  }
]
`;
  }
};
