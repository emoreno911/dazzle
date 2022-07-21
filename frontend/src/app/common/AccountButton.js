import { useApp } from '../../context/app'

function AccountButton() {
    const {
        data:{status, account}
    } = useApp();

    return (
        <button 
            type="button" 
            className="flex text-sm px-5 py-2 text-white rounded-md bg-color-alt focus:outline-none"
        >
            <div>
                {
                    status === "connected" ?
                    <div className="flex text-md" title={`Account ${account.address}`}>
                        <img src={`/img/${account.network}-logo.svg`} className="w-5 h-5 mr-2 " alt="icon"/>
                        <span className="w-32 overflow-ellipsis overflow-hidden">{account.address}</span>
                    </div> :
                    <span className="block text-md">No Account Connected</span>
                }
            </div>
        </button>
    )
}

export default AccountButton;