import React from 'react';
import { Route, HashRouter, Routes } from 'react-router-dom';
import Claim from './pages/claim';
import Link from './pages/link';
import Home from './pages/home';
import DataContextProvider from './app/context';

function App() {
  return (
    <DataContextProvider>
        <HashRouter>
            <Routes>
                <Route path="/link/:depositId" element={<Link />} />
                <Route path="/claim/:depositId" element={<Claim />} />
                <Route path="/claim" element={<Claim />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </HashRouter>
    </DataContextProvider>
  );
}

export default App;
