import { signInWithGoogle } from '../../utils/firebase';

const SocialLogin = () => (
    <ul className="my-5 w-full">
        <li className="block">
            <button 
                type="button" 
                className="w-full flex justify-center text-sm px-6 py-3 my-4 text-white rounded-md bg-blue-400 focus:outline-none"
                onClick={signInWithGoogle}
            >
                <div className="flex text-md font-semibold">
                    <img src={`/img/google-icon.png`} className="w-5 h-5 mr-2 " alt="icon"/>
                    <span>Login with Google</span>
                </div>
            </button>
        </li>
        <li className="block">
            <button 
                type="button" 
                className="w-full flex justify-center text-sm px-6 py-3 my-4 text-white rounded-md bg-gray-700 focus:outline-none"
            >
                <div className="flex text-md font-semibold">
                    <img src={`/img/github-logo.png`} className="w-5 h-5 mr-2 " alt="icon"/>
                    <span>Login with Github</span>
                </div>
            </button>
        </li>
    </ul>
)


export default SocialLogin