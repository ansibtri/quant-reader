export function countWords(text: string) {
  // 1. create a segmenter for the desired locale
  const segmenter = new Intl.Segmenter('en', { granularity: 'word' });

  // 2. Segment the text
  const segments = segmenter.segment(text);

  // 3. county only segments where isWordLike is true
  let wordCount = 0;
  for (const segment of segments) {
    if (segment.isWordLike) {
      wordCount++;
    }
  }
  return wordCount;
}
