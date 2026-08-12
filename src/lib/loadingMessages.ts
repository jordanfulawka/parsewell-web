export const loadingMessages = {
  parsingJobUrl: [
    'Reading the job posting...',
    'Pulling out the key details...',
    'Analyzing the job posting...',
    'Extracting job requirements...',
    'Scanning for must-have skills...',
    'Digging through the fine print...',
    'Figuring out what they actually want...',
    'Decoding the job description...',
    'Sniffing out the buzzwords...',
    'Untangling requirements list...',
  ],
  generatingResumeEdits: [
    'Matching your experience to the job description...',
    'Tailoring your resume for this role...',
    'Highlighting your most relevant skills...',
    'Finding the right keywords to include...',
    'Rewriting bullet points to fit this posting...',
    "Aligning your resume with what they're looking for...",
    'Polishing your resume for this application...',
    'Maximizing callback potential...',
    'Sprinkling in strategic keywords...',
    'Giving your resume a glow-up...',
    'Swapping in stronger action verbs...',
    'Quietly flexing your qualifications...',
  ],
  generatingCoverLetter: [
    'Drafting your cover letter...',
    'Writing an introduction that fits the role...',
    'Connecting your experience to the job...',
    'Putting your qualifications into words...',
    'Shaping your story for this application...',
    'Weaving in details from the job description...',
    'Crafting your best first impression...',
  ],
} as const;

export function getRandomMessage(stage: LoadingStage) {
  const stageLength = loadingMessages[stage].length;
  const randomNum = Math.floor(Math.random() * stageLength);
  return loadingMessages[stage][randomNum];
}

export type LoadingStage = keyof typeof loadingMessages;
