import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";

function App({ socket }) {
  return (
    <div className="App">
      <div className="Content">
        <Routes>
          <Route exact path="/" element={<Home socket={socket} />} />
          <Route
            exact
            path="/background"
            element={
              <>
                <Header />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
