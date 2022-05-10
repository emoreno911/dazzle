import React, { useContext, useState } from "react"

// https://cdn.solanamonkey.business/gen2/371.png

const CardItem = () => (
    <div className="flex items-center mx-2 my-2 rounded-lg">
        <a href="#">
            <img className="icopic rounded-lg" src="https://cdn.solanamonkey.business/gen2/371.png" alt="" />
        </a>
        <div className="grow leading-5 p-2">
            <a href="#">
                <h5 className="text-md font-bold tracking-tight text-gray-100 dark:text-white">
                    Monke #371
                </h5>
                <small className="text-sm text-gray-400">A collection of random Monkes with superpowers</small>
            </a>
        </div>
        <div className="p-2 pr-0">
            <button
                type="button"
                className="flex text-sm p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none"
                onClick={() => {}}
            >
                <img src="./img/dz-logo-black.png" alt="logo" className="dz-button"/>
            </button>
        </div>
    </div>
)


const NftList = () => {
	return (
		<div className="p-4 rounded-md text-white bg-color-dark w-full">
			<h3 className="text-lg font-bold">
				<span>NFTs</span> 
			</h3>
            <div className="w-full rounded">
                <CardItem />
                <CardItem />
                <CardItem />
                <CardItem />
            </div>
		</div>
	)
}

export default NftList