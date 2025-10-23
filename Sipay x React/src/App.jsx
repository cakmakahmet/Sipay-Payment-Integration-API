// src/App.jsx
import React from "react";
import PaymentsTable from "./PaymentsTable.jsx";


export default function App() {
  return (
    <PaymentsTable
      apiBase="http://localhost:5249"
      logsEndpoint="/api/payment/logs"
    />
  );
}
