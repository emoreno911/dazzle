import { Link } from "react-router-dom";

const Header = () => {
	return (
		<>
		<header className="max-w-5xl mx-auto pt-5">
			<div className="flex flex-wrap -mx-2 overflow-hidden px-5 lg:px-2 my-2">

				<div className="px-2 w-full overflow-hidden md:w-1/6 lg:w-1/3 xl:w-1/3 text-center md:text-left flex-grow">
                    <h1 className="font-bold text-2xl header-title page-title">
                        <img src="./img/dz-logo.png" alt="logo" className="dz-logo"/>
                        <Link to="/">
                            Dazzle Protocol
                        </Link>
                    </h1>
                    {/* <ul className="mt-4 w-full">
                        <li className="inline-block"><a className="block font-semibold pr-4 h-12" href="/">Home</a></li>
                        <li className="inline-block"><a className="block font-semibold pr-4 h-12" href="/faq">Claim</a></li>
					</ul> */}
				</div>

				<div className="my-2 px-2 w-full overflow-hidden md:w-2/6 lg:w-1/3 xl:w-1/3 text-center md:text-right hidden md:flex items-start justify-end">
                    <Link to="/link">
                        Link
                    </Link>
                    <span className="inline-block mx-2"></span>
                    <Link to="/claim">
                        Claim
                    </Link>
				</div>
			</div>
    </header>
		</>
	)
}

export default Header