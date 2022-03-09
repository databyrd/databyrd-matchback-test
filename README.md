<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://databyrd-landing.s3.amazonaws.com/databyrd_searching.gif" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Databyrd Match Back App</h3>

 </div>

<!-- ABOUT THE PROJECT -->
## About The Project

A simple queue system that allows users to upload files to compare them using the <bold>"Address"</bold> column. 

Front end built with React.js, Backend build with Node.js and Express. 
Queue system built with Bull-Arena and internal to Express queue system. 


### Built With

* [React.js](https://reactjs.org/)
* [Redis](https://redistogo.com/)
* [Express.js](https://expressjs.com/)
* [Node.js](https://nodejs.org/en/)
* [Bull](https://github.com/OptimalBits/bull)

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* Express Server
  ```sh
  npm install npm@latest -g
    npm run dev
  ```
  
  * Client Side
  ```sh
  cd /.client./
    npm install
      npm start
  ```


## Usage

npm run dev, runs nodemon for auto refresh. 

In the client folder, npm start runs the client side to allow editing in real time. 

To view the queue in real time, run the express server and navigate to http://localhost:5000/arena.
