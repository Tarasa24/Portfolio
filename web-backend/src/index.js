const app = require('./app')
const Repo = require('./models/Repo')

async function main() {
  // Sync all models
  await Repo.sync()
  console.log('All models were synchronized successfully.')

  // Run http server
  const port = 8081
  app.listen(port, () =>
    console.log(`<Website Backend server> listening on port ${port}`)
  )
}

main()
