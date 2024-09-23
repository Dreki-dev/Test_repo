
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './Auth.js'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hello" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;