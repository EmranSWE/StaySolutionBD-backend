import app from './app'
import config from './config'

async function bootstrap() {
  try {
    app.listen(config.port, () => {
      console.log(`Server running at ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

bootstrap()
