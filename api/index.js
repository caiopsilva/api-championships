import app from './config/server'
const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

export default server
