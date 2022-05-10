import React, { useContext, useState } from "react"

const toFixedIfNecessary = (n, d) => n 

const TokenList = () => {
	return (
		<div className="p-4 rounded-md text-white bg-color-dark w-full">
			<h3 className="text-lg font-bold">
				<span>Tokens</span> 
			</h3>
			<div className="flex items-center justify-between mt-3">
				<div className="p-2">
					<span className="font-bold">HBAR</span>
				</div>
				<div className="grow leading-5 p-2">
					<span className="text-base tracking-tight text-gray-100 dark:text-white">
						{toFixedIfNecessary(33, 2)}
					</span>
					<small className="text-sm text-gray-400 ml-2">$11.50</small>
				</div>
				<div>
					<button
						type="button"
						className="flex text-sm p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none"
						onClick={() => {}}
					>
						<img src="./img/dz-logo-black.png" alt="logo" className="dz-button"/>
					</button>
				</div>
			</div>
			<div className="flex items-center justify-between mt-3">
				<div className="p-2">
					<span className="font-bold">USDC</span>
				</div>
				<div className="grow leading-5 p-2">
					<span className="text-base tracking-tight text-gray-100 dark:text-white">
						{toFixedIfNecessary(55, 2)}
					</span>
					<small className="text-sm text-gray-400 ml-2">$55.00</small>
				</div>
				<div>
					<button
						type="button"
						className="flex text-sm p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none"
						onClick={() => {}}
					>
						<img src="./img/dz-logo-black.png" alt="logo" className="dz-button"/>
					</button>
				</div>
			</div>
		</div>
	)
}

export default TokenList