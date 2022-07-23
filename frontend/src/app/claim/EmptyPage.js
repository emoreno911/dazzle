import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";


function EmptyPage() {
    let navigate = useNavigate();
    const idInput = useRef();

    const handleNavigation = () => {
        if (idInput.current.value === "")
            return;

        navigate(`${window.location.hash}/${idInput.current.value}`, { replace: true });
    }

    return (
      <>
        <div className="flex flex-col text-white text-center link-page">
          <h3 className="text-xl font-bold">Do you have a claim ID to submit?</h3>
          <div className="my-10">
            <div className="flex flex-wrap items-stretch w-full max-w-xl mx-auto relative">
                <input 
                    type="text"
                    ref={idInput}
                    placeholder="Paste your claim ID here"
                    className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 h-10 rounded-lg rounded-r-none px-3 relative bg-color-dark text-white" 
                />
                
                <div className="flex">
                    <button 
                        title="Go to Link" 
                        onClick={() => handleNavigation()}
                        className="flex items-center leading-normal rounded-l-none px-3 whitespace-no-wrap text-sm w-16 h-10 justify-center items-center text-md font-bold rounded-lg bg-color-alt text-gray-100"
                    >
                        GO
                    </button>
                </div>
            </div>
          </div>
          {/* <h3 className="text-xl font-bold">Search for your items here!</h3> */}
        </div>
      </>
    );
}

export default EmptyPage;