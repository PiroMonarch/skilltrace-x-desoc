export function calculateScore(stats) {
  const {
    totalCommits = 0,
    activeDays = 0,
    languages = [],
    stars = 0,
    repoCount = 0
  } = stats

  const commitScore = Math.min((totalCommits / 1000) * 30, 30)
  const consistencyScore = Math.min((activeDays / 365) * 25, 25)
  const languageScore = Math.min(languages.length * 5, 25)
  const qualityScore = Math.min((stars / 100) * 10 + (repoCount / 50) * 10, 20)

  const overallScore = Math.round(commitScore + consistencyScore + languageScore + qualityScore)

  let grade = 'D'
  if (overallScore >= 85) grade = 'S'
  else if (overallScore >= 70) grade = 'A'
  else if (overallScore >= 50) grade = 'B'
  else if (overallScore >= 30) grade = 'C'

  return {
    overallScore,
    grade,
    breakdown: {
      commits: Math.round(commitScore),
      consistency: Math.round(consistencyScore),
      languages: Math.round(languageScore),
      quality: Math.round(qualityScore)
    }
  }
}
