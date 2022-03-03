import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Uploader from "./Uploader";
import Header from "./Header";
import React from "react";
function App() {
  return (
    <React.Fragment>
      <Header />
      <Uploader />
      {/* <Footer /> */}
    </React.Fragment>
  );
}

export default App;
