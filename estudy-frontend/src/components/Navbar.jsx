import React from 'react'
import { useContext } from 'react'
import DataContext, {useUser} from '../context'
import { Link } from 'react-router-dom'
import axios from '../axios'

import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import context from "../context";

export default function Navbar() {
    const {isLoggedIn, setUser, userName} = useContext(DataContext);

    const SignIn = () => {
        const {setAuthModalType} = useContext(DataContext);

        return (
        <div>
            <nav>
                <li className="estudylogo"><Link to="/"><FontAwesomeIcon
                    icon={icon({name: 'graduation-cap'})}/> estudy</Link></li>
                <li className='Spacer'></li>
                <li>
                    <button className='SignIn' onClick={() => setAuthModalType("Login")}>
                        Sign in <FontAwesomeIcon icon={icon({name: 'user'})}/>
                    </button>
                </li>
                <li>
                    <button className='SignIn' onClick={() => setAuthModalType("Register")}>
                        Register <FontAwesomeIcon icon={icon({name: 'user-plus'})}/>
                    </button>
                </li>
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
        const { user } = useUser();

        return (
            <div>
                <nav>
                    <li className="estudylogo"><Link to="/courses"><FontAwesomeIcon icon={icon({name: 'graduation-cap'})}/> estudy</Link></li>
                    <li><Link to="/courses"><FontAwesomeIcon icon={icon({name:'book'})}/> Courses</Link></li>
                    <li><Link to="/courses/create"><FontAwesomeIcon icon={icon({name:'file'})}/> New course</Link></li>
                    <li><b>you are logged in as {userName}.</b></li>
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
