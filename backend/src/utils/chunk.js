function splitIntoChunks(text, maxLen = 400) {
  const chunks = [];
  let current = "";

  // Split by sentences, but be more careful about preserving all content
  const parts = text.split(/[\n\r]|(?<=[.?!])\s+/).filter(part => part.trim());

  for (const sentence of parts) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue; // Skip empty parts
    
    const testCurrent = current ? current + " " + trimmedSentence : trimmedSentence;
    
    if (testCurrent.length > maxLen && current.trim()) {
      // Push current chunk and start new one
      chunks.push(current.trim());
      current = trimmedSentence;
    } else {
      // Add to current chunk
      current = testCurrent;
    }
  }
  
  // Always push the final chunk if it has content
  if (current && current.trim()) {
    chunks.push(current.trim());
  }
  
  return chunks;
}

module.exports = { splitIntoChunks };



