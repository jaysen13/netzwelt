import { Meteor } from "meteor/meteor";

function processIncomingData(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on(
      "data",
      Meteor.bindEnvironment(function (data) {
        body += data;
      })
    );
    req.on(
      "end",
      Meteor.bindEnvironment(function () {
        body = JSON.parse(body);
        resolve(body);
      })
    );
    req.on(
      "error",
      Meteor.bindEnvironment(function (error) {
        reject(error);
      })
    );
  });
}

export { processIncomingData };
