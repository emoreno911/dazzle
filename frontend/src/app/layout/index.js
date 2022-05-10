import Footer from "./Footer"
import Header from "./Header"

const Layout = ({ children }) => (
    <>
    <Header />
    <main className="max-w-5xl mx-auto py-6 md:py-10">
        <div className="flex flex-wrap overflow-hidden">
            <div className="w-full flex flex-wrap overflow-hidden">
                <div className="w-full overflow-hidden">
                    <div className="max-w-screen-lg mx-auto p-4">
                        {
                            children
                        }
                    </div>
                </div>
            </div>
        </div>
    </main>
    <Footer />
    </>
)

export default Layout