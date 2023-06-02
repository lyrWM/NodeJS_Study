const app = require("express")();
const bodyParser = require("body-parser");
const router = require("./routes");

require('dotenv').config();


app.use(bodyParser.json());
app.use("/", router);

const serverPort = Number(process.env.SERVER_PORT) || 9090;

app.listen(serverPort, () => {
    console.log(`App listening on port ${serverPort}`);
})
