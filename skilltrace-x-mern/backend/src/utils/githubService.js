import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'

dotenv.config()

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function fetchGitHubStats(username) {
  try {
    const { data: user } = await octokit.users.getByUsername({ username })
    
    const { data: repos } = await octokit.repos.listForUser({
      username,
      per_page: 100,
      sort: 'updated'
    })

    let totalCommits = 0
    const languages = {}

    for (const repo of repos.slice(0, 10)) {
      try {
        const { data: commits } = await octokit.repos.listCommits({
          owner: username,
          repo: repo.name,
          author: username,
          per_page: 100
        })
        totalCommits += commits.length

        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1
        }
      } catch (err) {
        continue
      }
    }

    const activeDays = Math.min(totalCommits, 365)
    const totalLangCount = Object.values(languages).reduce((a, b) => a + b, 0)
    
    const languageArray = Object.entries(languages)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalLangCount) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)

    return {
      user: {
        githubId: user.id.toString(),
        name: user.name,
        avatar: user.avatar_url,
        bio: user.bio
      },
      stats: {
        totalCommits,
        activeDays,
        repoCount: user.public_repos,
        stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        languages: languageArray
      }
    }
  } catch (error) {
    throw new Error(`GitHub Error: ${error.message}`)
  }
}
