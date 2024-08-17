import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { getStatus, updateHwid } from "../Utils/Requests";
import { AdsClick, LibraryBooks, LogoutSharp, Settings, SettingsInputComponent, SignalWifiBad, SignalWifiStatusbar4Bar, WifiOff } from "@mui/icons-material";
import toast from "react-hot-toast";

interface Props {
    selected: string;
}

export const Navbar: React.FC<Props> = ({ selected }) => {
    const { logout, loading } = useAuth();
    const [open, setOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [status, setStatus] = useState<string>('Cheat Offline'); // Initial state is 'Online'
    const [statusColor, setStatusColor] = useState<string>('text-red-600');
    const [authenticated, setAuthenticated] = useState<string>('HWID Inactive'); // Initial state is 'Online'
    const [authenticatedColor, setAuthenticatedColor] = useState<string>('text-red-600');
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === "keydown" &&
                    ((event as React.KeyboardEvent).key === "Tab" ||
                        (event as React.KeyboardEvent).key === "Shift")
                ) {
                    return;
                }
                setDrawerOpen(open);
            };

    const fetchStatus = async () => {
        const response = await getStatus();
        if (response.isOnline) {
            setStatus('Cheat Online');
            setStatusColor('text-green-400');
        } else {
            setStatus('Cheat Offline');
            setStatusColor('text-red-700');
        }

        if (response.isAuthorized) {
            setAuthenticated('HWID Active');
            setAuthenticatedColor('text-green-400');
        } else {
            setAuthenticated('HWID Inactive');
            setAuthenticatedColor('text-red-700');
        }
    };

    useEffect(() => {
        if (loading) {
            return;
        }
        fetchStatus();
    }, [loading]);

    const drawerList = (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            className="w-64"
        >
            <List>
                <ListItem>
                    <p className="text-[#787878] text-xl ">webclicker</p>
                </ListItem>
                <Divider />
                <ListItem>
                    <h2 className="text-start text-2xl text-[#787878] py-3">Cheat</h2>
                </ListItem>
                <ListItem button component={Link} to="/combat">
                    <ListItemText primary="Combat" className="text-[#950000]" />
                </ListItem>
                <ListItem button component={Link} to="/visuals">
                    <ListItemText primary="Combat" className="text-[#950000]" />
                </ListItem>
                <ListItem button component={Link} to="/destruct">
                    <ListItemText primary="Destruct" className="text-[#950000]" />
                </ListItem>
                <Divider />
                <ListItem>
                    <h2 className="text-start text-2xl text-[#787878] py-3">General</h2>
                </ListItem>
                <ListItem button component={Link} to="/guides">
                    <ListItemText primary="Guides" className="text-[#950000]" />
                </ListItem>
                <Divider />
                <ListItem>
                    <h2 className="text-start text-2xl text-[#787878] py-3">Account</h2>
                </ListItem>
                <ListItem button onClick={handleClickOpen}>
                    <ListItemText primary="Set HWID" className="text-[#950000]" />
                </ListItem>
                <ListItem button onClick={logout}>
                    <ListItemText primary="Logout" className="text-[#950000]" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <>
            <div className="bg-[#0a0a0a] flex flex-col h-full w-full md:w-72 justify-center align-middle">
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: "form",
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(
                                (formData as any).entries()
                            );
                            const hwid = formJson.HWID;
                            updateHwid({ _key: "hwid", _value: hwid });
                            handleClose();
                            toast.success("HWID set to " + hwid + "\n\nYou need to sign out and sign back in for changes to occur.",
                                {
                                  style: {
                                    borderRadius: '10px',
                                    background: '#0a0a0a',
                                    color: '#fff',
                                    borderWidth: '1px',
                                    borderColor: '#ffffff15',
                                  },
                                }
                            );
                        },
                    }}
                >
                    <DialogTitle>Set HWID</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Enter your new HWID</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="HWID"
                            name="HWID"
                            label="HWID"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogActions>
                </Dialog>

                <div className="m-4 flex justify-between items-center md:hidden">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <p className="text-[#787878] text-xl">webclicker</p>
                    <div className="flex gap-2">
                        {status == "Offline" ? <WifiOff /> : <SignalWifiStatusbar4Bar />}
                        <p className={statusColor}>{status}</p>
                    </div>
                </div>

                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}
                    PaperProps={{
                        sx: {
                            backgroundColor: "#000000",
                        }
                    }}

                >
                    {drawerList}
                </Drawer>
                <div className="hidden md:block">
                    <div className="pt-5">
                        <p className="text-center text-4xl font-semilight text-red-900">webclicker</p>
                    </div>
                    <div className="pt-3 pb-5 mx-3 flex flex-row justify-center gap-4 items-center md:flex text-xs">
                        <p className={authenticatedColor}>{authenticated}</p>
                        <Divider orientation="vertical" variant="fullWidth" flexItem />
                        <span className="flex gap-2 justify-center align-middle items-center">
                            <p className={statusColor}>{status}</p>
                        </span>
                    </div>
                </div>
                <Divider variant="fullWidth" flexItem className="hidden md:block" />
                <div className=" items-center grow flex-col text-gray-500 space-y-6 hidden md:flex mt-6">
                    <NavbarButton name="Combat" icon={<AdsClick />} onClick={() => { navigate("/combat") }} activeItem={selected} />
                    <NavbarButton name="Destruct" icon={<SignalWifiBad />} onClick={() => { navigate("/destruct") }} activeItem={selected} />
                    <NavbarButton name="Misc" icon={<Settings />} onClick={() => { navigate("/misc") }} activeItem={selected} />
                    <Divider className="" variant="middle" flexItem />
                    <NavbarButton name="Guides" icon={<LibraryBooks />} onClick={() => { navigate("/guides") }} activeItem={selected} />
                    <NavbarButton name="Set HWID" icon={<SettingsInputComponent />} onClick={() => { handleClickOpen() }} activeItem={selected} />
                    <Divider className="" variant="middle" flexItem />
                    <NavbarButton name="Logout" icon={<LogoutSharp />} onClick={() => { logout() }} activeItem={selected} />
                </div>
            </div>
        </>
    );
};

const NavbarButton = ({ icon, name, onClick, activeItem }: { icon: JSX.Element, name: string, onClick: (name: string) => void, activeItem: string }) => {
    const isActive = activeItem === name;

    return (
        <button onClick={() => onClick(name)} className={` hover:text-gray-300 transition-all duration-200 ${isActive ? " shadow-[#ffffff] bg-[#470a0c] text-gray-200 " : ""} md:w-60 rounded-md `} >
            <div className="m-2 flex flex-row gap-4 text-sm align-middle items-center">
                {icon}
                <p>{name}</p>
            </div>
        </button>
    )
}