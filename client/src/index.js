import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Nest as ProvidersNest } from "./components/Helpers/Nest";
import { appProviders } from "./utils/appProviders";

ReactDOM.render(
  <>
    <Router>
      <ProvidersNest elements={appProviders}>
        <App />
      </ProvidersNest>
    </Router>
  </>,
  document.getElementById("root")
);

reportWebVitals();
