import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import { MeetProvider } from "./components/layout/MeetProvider";

function App() {
  return (
    <MeetProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </MeetProvider>
  );
}

export default App;
