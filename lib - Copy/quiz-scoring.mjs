/** @param {number[]} answers @param {number[]} correctAnswers */
export function scoreAnswers(answers, correctAnswers) {
  if (answers.length !== correctAnswers.length || correctAnswers.length === 0) throw new Error("Answer count must match a non-empty quiz.");
  const correct = answers.reduce((count, answer, index) => count + (answer === correctAnswers[index] ? 1 : 0), 0);
  return { score: Math.round((correct / correctAnswers.length) * 100), correct, total: correctAnswers.length };
}
