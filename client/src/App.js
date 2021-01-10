import { useEffect, useRef } from "react";

import logo from "./logo.svg";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const socket = useRef();
  const data = useRef();

  useEffect(() => {
    socket.current = io("http://10.0.0.216:1441");

    console.log("Begin handling: ", socket.current);
    socket.current.on("connect", () => {
      console.log("Connected: ", socket.current.id);
    });

    socket.current.on("display-image", (data) => {
      console.log("Displaying Image:", data);

      const parent = document.getElementById("app-header");
      while (parent.children.length > 0) {
        parent.removeChild(parent.children[0]);
      }

      const canvas = document.createElement("canvas");
      canvas.width = data.imageWidth;
      canvas.height = data.imageHeight;
      const context = canvas.getContext("2d");
      const imageData = context.createImageData(200, 200);

      imageData.data.set(data.imageData);

      console.log(imageData);
      context.putImageData(imageData, 0, 0);

      const image = new Image();

      // set the img.src to the canvas data url
      image.height = data.imageHeight;
      image.width = data.imageWidth;
      image.src = canvas.toDataURL();

      // append the new img object to the page
      document.getElementById("app-header").appendChild(image);
    });
  });

  return (
    <div className="App">
      <header className="App-header" id="app-header"></header>
    </div>
  );
}

export default App;
