import { Link } from "react-router-dom";
import HeroHome from '../app/common/HeroHome'

const Home = () => (
    <>
        <div className="home-unpaired flex flex-col items-center justify-center">
            <HeroHome />
            <div>
                <ul className="my-5 w-full">
                    <li className="inline-block">
                        <Link to="/hedera">
                            <div className="box-home w-48 flex flex-col justify-center items-center font-semibold text-white border rounded-md p-6 mx-4">
                                <span>Use on Hedera</span>
                                <img src="/img/hedera-logo.svg" className="w-14 h-14 mt-4" alt="hedera" />
                            </div>
                        </Link>
                    </li>
                    <li className="inline-block">
                        <Link to="/tron">
                            <div className="box-home w-48 flex flex-col justify-center items-center font-semibold text-white border rounded-md p-6 mx-4">
                                <span>Use on Tron</span>
                                <img src="/img/tron-logo.svg" className="w-14 h-14 mt-4" alt="tron" />
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="flex items-center justify-center my-5">
                <small className="block text-gray-400">Currently on Testnet</small>
            </div>
        </div>
    </>
)

export default Home