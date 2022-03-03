import React from "react";
export default class Header extends React.Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "#5F4B89",
          color: "white",
          height: "225px",
          paddingTop: "10px",
          width: "100%",
        }}
        className='col-12  py-5 text-center'
      >
        <div style={{ paddingTop: "30px" }} className='col-12 row'>
          <h1
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "3.75rem",
              fontWeight: 300,
              letterSpacing: "-0.008333333em",
              lineHeight: "3.75rem",
            }}
          >
            <span className='mdi mdi-microsoft-excel' /> databyrd Matchback
          </h1>
        </div>

        <div className='col-md-3 text-end'></div>
      </div>
    );
  }
}
