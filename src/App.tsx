import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { appRoutes } from "./routes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/map" />} />
        {appRoutes.map(({ path, element, layout: Layout }) => (
          <Route
            key={path}
            path={path}
            element={Layout ? <Layout>{element}</Layout> : element}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
