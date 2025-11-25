const User = require("../models/User");

exports.upsertGithubUser = async ({
  email,
  github_username,
  avatar_url,
  access_token,
  name,
}) => {
  let user = await User.findOne({ email });

  if (!user) {
    // generate unique username from GitHub handle
    let uniqueUsername = github_username;
    let collision = await User.findOne({ username: uniqueUsername });
    let counter = 1;
    while (collision) {
      uniqueUsername = `${github_username}${counter}`;
      collision = await User.findOne({ username: uniqueUsername });
      counter++;
    }

    user = await User.create({
      email,
      name: name || github_username,
      username: uniqueUsername,
      avatarUrl: avatar_url,
      profile: {
        avatar: avatar_url,
        links: { github: github_username },
      },
      githubUsername: github_username,
      github_access_token: access_token,
      authProviders: ["github"],
      isOnboardedStep1: true, // 🔥 step1 auto-filled from GitHub
      // isOnboarded stays false until step2
    });
  } else {
    user.profile = user.profile || {};
    user.profile.links = user.profile.links || {};

    user.avatarUrl = user.avatarUrl || avatar_url;
    user.profile.avatar = user.profile.avatar || avatar_url;
    user.profile.links.github = github_username;

    user.githubUsername = github_username;
    user.github_access_token = access_token;

    if (!user.authProviders?.includes("github")) {
      user.authProviders = [...(user.authProviders || []), "github"];
    }

    await user.save();
  }

  return user;
};
