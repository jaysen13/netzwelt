import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import bodyParser from "body-parser";
import { fetch, Headers } from "meteor/fetch";
import { processIncomingData } from "./helpers";

WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: false }));
WebApp.connectHandlers.use("/login", (req, res, next) => {
  let baseUrl = "https://netzwelt-devtest.azurewebsites.net";
  processIncomingData(req)
    .then(async (body) => {
      try {
        const response = await fetch(baseUrl + "/Account/SignIn", {
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
        res.writeHead(400);
        res.end(JSON.stringify({ error }));
      }
    })
    .catch((err) => {
      res.writeHead(400);
      res.end(JSON.stringify({ err }));
    });
});
