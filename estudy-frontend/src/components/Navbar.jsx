import React from 'react'
import { useContext } from 'react'
import DataContext from '../context'
import { Link } from 'react-router-dom'
import axios from '../axios'


export default function Navbar() {
    const {isLoggedIn, setUser} = useContext(DataContext);

    const SignIn = () => {
        const {setAuthModalType} = useContext(DataContext);

        return (
        <div>
            <nav>
                <li><button className='SignIn' onClick={() => setAuthModalType("Login")}>Sign in</button></li>
            </nav>
        </div>
        );
    }

    const UserNavbar = () => {
        const handleLogout = async () => {
            setUser(null, null);
            setIsLoggedIn(false);
        }

        const {setIsLoggedIn} = useContext(DataContext);

        return (
            <div>
                <nav>
                    <li><Link to="/courses">Courses</Link></li>
                    <li><Link to="/courses/create">New course</Link></li>
                    <li><b>you are logged in.</b></li>
                    <li className='Spacer'></li>
                    <li>
                        <button className='SignIn' onClick={handleLogout}>Logout</button>
                    </li>
                </nav>
            </div>
        );
    }
    return isLoggedIn ? UserNavbar() : SignIn();
}
