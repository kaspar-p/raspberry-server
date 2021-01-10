import { useEffect, useRef } from "react";
import WSAvcPlayer from "h264-live-player";
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
      ({ imageWidth, imageHeight, imageData }) => {
        console.log("Displaying Image!", imageData);
        const parent = document.getElementById("app-header");
        while (parent.children.length > 0) {
          parent.removeChild(parent.children[0]);
        }

        const canvas = document.createElement("canvas", {
          width: imageWidth,
          height: imageHeight,
        });
        parent.appendChild(canvas);

        const player = new WSAvcPlayer(canvas, "webgl");
        player.connect("http://10.0.0.216:1441/video");
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
