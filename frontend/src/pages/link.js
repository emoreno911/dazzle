import React, { useContext } from "react"
import Layout from "../app/layout"

const linkResult = 'https://testnet.dazzle.xyz/l/98JDKJFKJ2'

function Link() {
    return (
        <Layout>	
            <div className="flex flex-col text-white">
                <h3 className="text-xl font-bold">Here is your Link!</h3>
                <div className="flex flex-wrap items-stretch w-full relative my-5">
                    <input 
                        type="text"
                        defaultValue={linkResult}
                        className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 h-10 rounded-lg rounded-r-none px-3 relative bg-color-dark text-white" 
                    />
                    
                    <div className="flex">
                        <button title="Copy Link" className="flex items-center leading-normal rounded-l-none px-3 whitespace-no-wrap text-sm w-16 h-10 justify-center items-center text-md font-bold rounded-lg bg-color-alt text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <h3 className="text-xl font-bold">Share</h3>
                <div className="my-5 flex">
                    <div className="border border-white p-2 mr-2 rounded">WhatsApp</div>
                    <div className="border border-white p-2 mr-2 rounded">Telegram</div>
                    <div className="border border-white p-2 mr-2 rounded">Email</div>
                </div>
            </div>
        </Layout>
	)
}

export default Link;