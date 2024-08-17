import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import { Navbar } from "../Shared/Navbar"
import { ExpandMoreOutlined } from "@mui/icons-material"

const AccordionForm: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    return (
        <Accordion className="mb-4 rounded-md border-2 border-transparent w-full m-4">
            <AccordionSummary
                className="flex items-center py-1 px-5 justify-between"
                expandIcon={<ExpandMoreOutlined />}
                aria-controls="panel1-content"
                id="pan1-header"
                sx={{ backgroundColor: "#0a0a0a" }}
            >
                {title}
            </AccordionSummary>
            <AccordionDetails className="bg-[#0a0a0a] flex flex-col gap-12">{children}</AccordionDetails>
        </Accordion>
    );
};


export const Guides = () => {
    return (
        <div className="bg-[#0e0e0e] min-h-screen flex overflow-hidden"> {/*0e0e0e 0a0a0a*/}
            <div className="flex flex-col justify-center align-middle text-gray-400 grow">
                <div className="sidebar md:fixed lg:fixed left-0 top-0 lg:h-full md:h-full">
                    <Navbar selected="Guides" />
                </div>
                <div className='ml-0 lg:ml-60 md:ml-80 sm:ml-0 grow overflow-hidden'>
                    <h1 className="ml-0 lg:ml-40 md:ml-20 mt-10 text-4xl hidden md:block">Guides</h1>
                    <div className="flex-row flex mt-10 mx-0 lg:mx-40 flex-wrap scroll gap-4 justify-normal">
                        <AccordionForm title="Installation">
                            <div>
                                <h1 className="text-xl">Hide logs of download</h1>
                                <p className="font-light italic">Do after every download, move, rename</p>
                                <br />
                                <span className="text-gray-400">
                                    <p className="text-wrap">Open CMD prompt as admin, and type in
                                        <span className="text-red-400 italic"> fsutil usn deletejournal /d c:</span>
                                    </p>
                                    <br />
                                    <p className="text-red-600">Note: This clears your journal logs and might be bannable on some servers, do NOT do mid-map. </p>
                                </span>
                            </div>
                            <div>
                                <h1 className="text-xl">Disable recent folder</h1>
                                <p className="font-light italic">Do once</p>
                                <br />
                                <span className="text-gray-400">
                                    <p>Go to your windows settings</p>
                                    <p>Click on Personalize</p>
                                    <p>Click on Start</p>
                                    <p>Disable "Show recently opened items in Jump Lists on Start or the Taskbar"</p>
                                </span>
                            </div>
                        </AccordionForm>
                    </div>
                </div>
            </div>
        </div>
    )
}
