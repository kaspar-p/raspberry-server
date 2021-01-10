import { useEffect, useRef } from "react";

import { io } from "socket.io-client";
import "./App.css";

function App() {
  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://10.0.0.216:1441");

    console.log("Begin handling: ", socket.current);
    socket.current.on("connect", () => {
      console.log("Connected: ", socket.current.id);
    });

    socket.current.on(
      "display-image",
      ({ imageWidth, imageHeight, imageStream }) => {
        const parent = document.getElementById("app-header");
        while (parent.children.length > 0) {
          parent.removeChild(parent.children[0]);
        }

        let binaryString = "";
        imageStream.on("data", (data) => {
          console.log("streaming: ", data);
          for (let i = 0; i < data.length; i++) {
            binaryString += String.fromCharCode(data[i]);
          }
        });

        stream.on("end", function (data) {
          b64String = btoa(binaryString);

          const image = new Image();

          // set the img.src to the canvas data url
          image.height = imageHeight;
          image.width = imageWidth;
          image.src = "data:image/jpg;base64," + b64String;

          // append the new img object to the page
          document.getElementById("app-header").appendChild(image);
        });
      }
    );
  });

  return (
    <div className="App">
      <header className="App-header" id="app-header"></header>
    </div>
  );
}

export default App;
