const Integration = require('../models/Integration');

exports.connectProvider = async (req, res, next) => {
  try {
    const { provider, username } = req.body;

    if (!['GITHUB', 'LEETCODE'].includes(provider)) {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    const integration = await Integration.findOneAndUpdate(
      { userId: req.user.id, provider },
      {
        $set: {
          username,
          status: 'CONNECTED',
          errorMessage: null,
        },
      },
      { upsert: true, new: true }
    );

    // TODO: call processor endpoint to sync now
    // e.g. await axios.post(PROCESSOR_URL + '/internal/sync', { userId: req.user.id, provider })

    res.json({ integration });
  } catch (err) {
    next(err);
  }
};

const processorPipeline = require('../processors/processorPipeline');

exports.syncGithub = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // STEP A — backend fetches raw data from GitHub API
    // For MVP, suppose we have `rawActivities` already available
    const rawActivities = req.body.rawActivities; // array

    // STEP B — call pipeline
    const result = await processorPipeline(userId, rawActivities);

    if (!result.success) {
      return res.status(500).json({ message: 'Pipeline failed', error: result.error });
    }

    return res.json({ message: 'Sync success' });
  } catch (err) {
    next(err);
  }
};

