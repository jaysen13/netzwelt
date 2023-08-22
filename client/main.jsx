import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import Login from "/imports/ui/Login";

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container);
  root.render(<Login />);
});