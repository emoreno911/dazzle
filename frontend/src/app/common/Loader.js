function Loader({ loaderMessage = "Loading..." }) {
    return (
        <div className="w-full flex flex-col justify-center items-center">
           <div className='lds-ellipsis'> 
                <div></div>
                <div></div>
                <div></div>
                <div></div>
           </div>
           <div className="text-white text-md my-3">{ loaderMessage }</div>
        </div>
    )
}

export default Loader;