import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import ToastProvider from "./components/ToastProvider";
import QueryProvider from "./components/QueryProvider";
import { useTestAPI } from "./hooks/useTestAPI";
import "./App.css";

function AppContent() {
  useTestAPI();
  
  return (
    <BrowserRouter>
      <ToastProvider />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}
