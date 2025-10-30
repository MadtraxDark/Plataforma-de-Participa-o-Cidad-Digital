import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import ToastProvider from "./components/ToastProvider";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <AppRoutes />
    </BrowserRouter>
  );
}
