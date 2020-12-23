const Repo = require('../models/Repo')

async function gitSync(req, res) {
  try {
    const repos = await Repo.findAll();
    res.json(repos);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = gitSync;
