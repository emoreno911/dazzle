import React from 'react';
import { Route, HashRouter, Routes } from 'react-router-dom';
import Layout from './app/layout';
import Home from './pages/home';
import Claim from './pages/claim';
import Link from './pages/link';
import Tron from './pages/tron';
import Hedera from './pages/hedera';
import AppProvider from './context/app';
import TronProvider from './context/tron';
import HederaProvider from './context/hedera';

const HederaLayout = () => {
	return (
		<HederaProvider>
			<Layout />
		</HederaProvider>
	)
}

const TronLayout = () => {
	return (
		<TronProvider>
			<Layout />
		</TronProvider>
	)
}

const App = () => {
	return (
		<AppProvider>
			<HashRouter>
				<Routes>
					<Route path="/hedera" element={<HederaLayout />} >
						<Route index element={<Hedera />} />
						<Route path="link/:depositId" element={<Link />} />
						<Route path="claim/:depositId" element={<Claim />} />
						<Route path="claim" element={<Claim />} />
					</Route>
					<Route path="/tron" element={<TronLayout />} >
						<Route index element={<Tron />} />
						<Route path="link/:depositId" element={<Link />} />
						<Route path="claim/:depositId" element={<Claim />} />
						<Route path="claim" element={<Claim />} />
					</Route>
					<Route path="/" element={<Layout />} >
						<Route index element={<Home />} />
					</Route>
				</Routes>
			</HashRouter>
		</AppProvider>
	)
}

export default App;
