import { useEffect } from "react";
import WSAvcPlayer from "h264-live-player";
import "./App.css";

function App() {
  useEffect(() => {
    console.log("Displaying Image!");
    const parent = document.getElementById("app-header");
    while (parent.children.length > 0) {
      parent.removeChild(parent.children[0]);
    }

    const canvas = document.createElement("canvas", {
      width: 1280,
      height: 960,
    });
    parent.appendChild(canvas);

    const player = new WSAvcPlayer(canvas, "webgl");
    player.connect("ws://10.0.0.216:1441/video");
  });

  return (
    <div className="App">
      <header className="App-header" id="app-header"></header>
    </div>
  );
}

export default App;
