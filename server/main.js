import { WebApp } from "meteor/webapp";
import bodyParser from "body-parser";
import { fetch, Headers } from "meteor/fetch";
import { processIncomingData } from "./helpers";
import { NETZWELT_BASE_URL } from "../imports/contants";

WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: false }));
WebApp.connectHandlers.use("/login", (req, res) => {
  processIncomingData(req)
    .then(async (body) => {
      try {
        const response = await fetch(NETZWELT_BASE_URL + "/Account/SignIn", {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(body),
        });
        const data = await response.json();
        res.writeHead(200);
        res.end(JSON.stringify(data));
      } catch (error) {
        throw error;
      }
    })
    .catch((err) => {
      res.writeHead(400);
      res.end(JSON.stringify({ err }));
    });
});
WebApp.connectHandlers.use("/allTeritories", async (req, res) => {
  try {
    const response = await fetch(NETZWELT_BASE_URL + "/Territories/All", { method: "GET" });
    const data = await response.json();
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } catch (error) {
    throw error;
  }
});
