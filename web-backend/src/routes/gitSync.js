const Repo = require('../models/Repo')

async function gitSync(req, res) {
  try {
    const repos = await Repo.findAll({
      order: [
        ['downloads', 'DESC'],
        ['stars', 'DESC'],
      ],
    })
    res.json(repos)
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = gitSync
