const app = require("./src/app");
const connectDb = require("./src/config/db")


connectDb()
app.listen(4000, () => {
  console.log("server is running on 4000 port");
});
