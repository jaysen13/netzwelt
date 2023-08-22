import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Meteor } from "meteor/meteor";
import Login from "/imports/ui/Login";
import Homepage from "/imports/ui/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Homepage />} />
          <Route path="account/login" element={<Login />} />
          <Route path="*" element={<h1>Page not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

Meteor.startup(() => {
  const root = ReactDOM.createRoot(document.getElementById("react-target"));
  root.render(<App />);
});
