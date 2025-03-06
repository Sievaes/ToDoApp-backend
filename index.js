const App = require("./app")
const config = require("./utils/config")

App.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`)
})
