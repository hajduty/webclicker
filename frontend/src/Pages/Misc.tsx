import { ConfigForm } from "../Shared/Modules/Config"
import { Navbar } from "../Shared/Navbar"

export const Misc = () => {
    return (
        <div className="bg-[#0e0e0e] min-h-screen flex overflow-hidden"> {/*0e0e0e 0a0a0a*/}
            <div className="flex flex-col justify-center align-middle text-gray-400 grow">
                <div className="sidebar md:fixed lg:fixed left-0 top-0 lg:h-full md:h-full">
                    <Navbar selected="Misc"/>
                </div>
                <div className='ml-0 lg:ml-60 md:ml-80 sm:ml-0 grow overflow-hidden'>
                    <h1 className="ml-0 lg:ml-40 md:ml-20 mt-10 text-4xl hidden md:block font-thin">Misc</h1>
                    <div className="flex-row flex mt-10 mx-0 lg:mx-20 flex-wrap scroll gap-4 justify-center">
                        <ConfigForm />
                    </div>
                </div>
            </div>
        </div>
    )
}