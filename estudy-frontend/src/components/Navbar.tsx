import {useAuth} from '../context'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { CubeIcon } from "@radix-ui/react-icons"
import { PersonIcon } from "@radix-ui/react-icons"
import { ExitIcon } from "@radix-ui/react-icons"
import { useMediaQuery } from 'react-responsive';
import { User } from '../types';
import {useState, useEffect} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fileupload } from '@/axios'

export default function Navbar() {
    const { user, login, setModalType, logout } = useAuth();
    const [avatarPath, setAvatarPath] = useState<string>("");
    const isPhone: boolean = useMediaQuery({maxWidth: 768});

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser: User = JSON.parse(loggedInUser!);
            login(foundUser);
        }

    }, []);
    if (user != null){
        fileupload.get("/avatar/"+user.id.toString()).then( response => {
            setAvatarPath(response.data.url[0]);
        }
        );
    }

    const SignIn = () => {

        return (
            <div>
                <nav className="border-b-slate-950 fixed border-b-2 bg-white w-full">
                    <ul className='uppercase h-4 top-0 flex flex-row items-center m-auto list-none pt-8 pb-8 pl-2 pr-2'>
                        <li className="m-2 text-3xl ">
                            <Link to="/courses"><CubeIcon className="h-8 w-8 hover:bg-black hover:text-white" /></Link>
                        </li>
                        <li className='m-auto'></li>
                        <li className="m-1">
                            <Button onClick={() => setModalType("Login")}>
                                Sign in
                            </Button>
                        </li>
                        <li className="mr-2">
                            <Button onClick={() => setModalType("Register")}>
                                Register
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    const UserNavbar = () => {
        const handleLogout = async () => {
            logout();
            localStorage.removeItem("user");
        }

        if (!isPhone){
            return (
                <div>
                    <nav className="border-b-slate-950 fixed border-b-2 bg-white w-full">
                        <ul className='uppercase h-4 top-0 flex flex-row items-center m-auto list-none pt-8 pb-8 pl-2 pr-2'>
                            <li className="m-2 text-3xl ">
                                <Link to="/courses"><CubeIcon className="h-8 w-8 hover:bg-black hover:text-white" /></Link>
                            </li>
                            <li className="m-2 p-1 hover:border-solid hover:border-2 hover:border-black hover:rounded-md">
                                <Link to="/courses"><b>Courses</b></Link>
                            </li>
                            {(user?.role === "LECTURER") &&
                            <li className="m-2 p-1 hover:border-solid hover:border-2 hover:border-black hover:rounded-md">
                                <Link to="/courses/create"><b>New course</b></Link>
                            </li>
                            }
                            <li className='m-auto'></li>
                            <Avatar className="border-solid border-2 border-black">
                                <AvatarImage src={avatarPath}/>
                                <AvatarFallback><PersonIcon/></AvatarFallback>
                            </Avatar>
                            <li className="m-2">
                                <Link to="/profile">
                                    <Button><PersonIcon className="mr-2 h-4 w-4"/>{user?.username}</Button>
                                </Link>
                            </li>
                            <li className="mr-2">
                                <Button onClick={handleLogout}><ExitIcon className="mr-2 h-4 w-4" />Logout</Button>
                            </li>
                        </ul>
                    </nav>
                </div>
            );
            }
        else {
            return (
                <div>
                    <nav className="border-b-slate-950 fixed border-b-2 bg-white w-full">
                        <ul className='uppercase h-4 top-0 flex flex-row items-center m-auto list-none pt-8 pb-8 pl-2 pr-2'>
                            <li className="m-2 text-3xl ">
                                <Link to="/courses"><CubeIcon className="h-8 w-8 hover:bg-black hover:text-white" /></Link>
                            </li>
                            {(user?.role === "LECTURER") &&
                                <li className="m-2 p-1 hover:border-solid hover:border-2 hover:border-black hover:rounded-md">
                                    <Link to="/courses/create"><b>New course</b></Link>
                                </li>
                            }
                            <li className='m-auto'></li>
                            <Avatar className="border-solid border-2 border-black">
                                <AvatarImage src={avatarPath}/>
                                <AvatarFallback><PersonIcon/></AvatarFallback>
                            </Avatar>
                            <li className="m-2">
                                <Link to="/profile">
                                    <Button className="h-9 w-9 p-0"><PersonIcon className="h-6 w-6"/></Button>
                                </Link>
                            </li>
                            <li className="mr-2">
                                <Button className="h-9 w-9 p-0" onClick={handleLogout}><ExitIcon className="h-6 w-6"/></Button>
                            </li>
                        </ul>
                    </nav>
                </div>
            );
        }
    }
    return user?.isLoggedIn ? UserNavbar() : SignIn();
}
