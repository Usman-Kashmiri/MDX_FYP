import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import { MeetProvider } from "./components/layout/MeetProvider";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: "04101675-dac7-4044-96ab-d81bc8bbd55b",
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendNotification();
      }
    };

    const sendNotification = async () => {
      try {
        await beamsClient.start();
        await beamsClient.addDeviceInterest("debug-hello");
      } catch (error) {
        console.error("Error:", error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <MeetProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </MeetProvider>
  );
}

export default App;
