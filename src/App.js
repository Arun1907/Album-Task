import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AlbumDetails from "./Components/AlbumDetails/AlbumDetails";
import Overview from "./Components/Overview/Overview";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/album/:id" element={<AlbumDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
