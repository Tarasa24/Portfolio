const app = require('./app')

async function main() {
  const port = 8081
  app.listen(port, () =>
    console.log(`<Website Backend server> listening on port ${port}`)
  )
}

main()
