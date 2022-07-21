import React, { createContext, useState, useEffect, useContext } from 'react'

const DataContext = createContext();
export const useApp = () => useContext(DataContext);

const DataContextProvider = (props) => {
	const [status, setStatus] = useState('not connected');
	const [account, setAccount] = useState({});

	useEffect(() => {
		console.log("App context,", status)
	}, [])

	const setConnectedAccount = (address, network, status) => {
		setStatus(status);
		setAccount({
			network,
			address
		})
	}


	const isMobile = () => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	const data = {
		status,
		account
	}

	const fn = {
		isMobile,
        setConnectedAccount
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default DataContextProvider;