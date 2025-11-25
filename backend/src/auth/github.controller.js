const axios = require("axios");
const jwt = require("jsonwebtoken");
const { upsertGithubUser } = require("./github.service");

exports.loginRedirect = (req, res) => {
  const redirect = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=${process.env.GITHUB_OAUTH_SCOPES}&redirect_uri=${process.env.GITHUB_OAUTH_REDIRECT_URL}`;
  return res.redirect(redirect);
};

exports.loginCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing OAuth code");

    // 1️⃣ Exchange code for GitHub access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    console.log(tokenRes.data);
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(400).send("OAuth failed.");

    // 2️⃣ Fetch basic GitHub user
    const githubUser = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 3️⃣ Fetch verified email
    const githubEmail = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email =
      githubEmail.data.find((e) => e.primary && e.verified)?.email ||
      githubUser.data.email ||
      null;

    // 4️⃣ Store/update the user inside DB
    const user = await upsertGithubUser({
      email,
      github_username: githubUser.data.login,
      avatar_url: githubUser.data.avatar_url,
      access_token: accessToken,
      name: githubUser.data.name,
    });

    // 5️⃣ Create JWT for frontend login
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6️⃣ Redirect frontend → store token in localStorage
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`
    );
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return res.status(500).send(error);
  }
};

