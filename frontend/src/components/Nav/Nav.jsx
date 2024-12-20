import { useState } from 'react';
import './Nav.css';
import { IoPerson } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

function Nav() {
    const [burgar, setBurgar] = useState("hamburgar");
    const [menu, setMenu] = useState("closemenu");
    const [openshop, setOpenshop] = useState("dropdown-menu");
    const [openevent, setOpenevent] = useState("dropdown-menu");
    const [openother, setOpenother] = useState("dropdown-menu");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const user = useSelector((state) => state.auth.user); 
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    function makecross() {
        if (burgar === "hamburgar") {
            setBurgar("cross");
            setMenu("openmenu");
        } else {
            setBurgar("hamburgar");
            setMenu("closemenu");
        }
    }

    function openShop() {
        if (openshop === "dropdown-menu") {
            setOpenshop("openshop");
        }   else {
            setOpenshop("dropdown-menu");
        }
    }
    function openEvent(){
        if (openevent === "dropdown-menu") {
            setOpenevent("openshop");
        }
        else {
            setOpenevent("dropdown-menu");
        }
    }
    function openOther(){
        if (openother === "dropdown-menu") {
            setOpenother("openshop");
        } 
        else {
            setOpenother("dropdown-menu");
        }
    }


  

    return (
        <>
            <nav>
                <div className="left-nav">
                    <div className={burgar} onClick={makecross}>
                        <span></span><span></span><span></span>
                    </div>
                    <ul className={menu}>
                        <li><NavLink to='/'>Home</NavLink></li>
                        <li><NavLink to='/Aboutus'>About Us</NavLink></li>
                        <li className='dropdown' onClick={openShop}>
                            Rooms<FaAngleDown />
                            <ul className={openshop}>
                                <li><NavLink to='/CampingTents' className='drop-link'>Camping Tents</NavLink></li>
                                <li><NavLink to='/DeluxeRoom' className='drop-link'>Deluxe Room</NavLink></li>
                            </ul>
                        </li>
                        <li className='moblink' onClick={openEvent}>
                            Events<FaAngleDown />
                            <ul className={openevent}>
                                <li><NavLink to='/Corporate-Events' className='drop-link'>Corporate Events</NavLink></li>
                                <li><NavLink to='/Private-Events' className='drop-link'>Private Events</NavLink></li>
                            </ul>
                        </li>
                        <li className='moblink' onClick={openOther}>
                            Other<FaAngleDown />
                            <ul className={openother}>
                                <li><NavLink to='/Gallery' className='drop-link'>Gallery</NavLink></li>
                                <li><NavLink to='/Activites' className='drop-link'>Activities</NavLink></li>
                            </ul>
                        </li>
                        <li><a href="#Contact">Contact</a></li>
                    </ul>
                </div>
                <div className="center-nav-logo">
                   <a href="/"> <img src='./logo.png' alt="Logo" /></a>
                </div>
                <div className="right-nav">
                    <ul>
                        <li className='dropdown'>
                            Events <FaAngleDown />
                            <ul className='dropdown-menu'>
                                <li><NavLink to='/Corporate-Events' className='drop-link'>Corporate Events</NavLink></li>
                                <li><NavLink to='/Private-Events' className='drop-link'>Private Events</NavLink></li>
                            </ul>
                        </li>
                        <li className='dropdown'>
                            Other <FaAngleDown />
                            <ul className='dropdown-menu'>
                                <li><NavLink to='/Gallery' className='drop-link'>Gallery</NavLink></li>
                                <li><NavLink to='/Activites' className='drop-link'>Activities</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                    <div className="user-section">
                        {user ? (
                            <div 
                                className="user" 
                                onMouseEnter={() => setDropdownOpen(true)} 
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <span>Welcome, {user.name} <FaAngleDown /></span>
                                {dropdownOpen && (
                                    <ul className="user-menu">
                                        <li onClick={handleLogout}>Logout</li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <span><NavLink to='/login'><IoPerson /></NavLink></span>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Nav;
