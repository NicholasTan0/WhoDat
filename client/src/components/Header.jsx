import '../stylesheets/Header.css'
import logo from '../assets/logo.png'
import icon from '../assets/favicon.png'
import Switch from 'react-switch';

import { useState, useRef } from 'react';

function Header({
    enableLives, 
    lives,
    enableHints,
    hints, 
    enableTime,
    timeLimit, 
    setEnableLives, 
    setLives,
    setEnableHints,
    setHints, 
    setEnableTime,
    setTimeLimit,
}) {
    const [isOpen, setOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(2);

    const hearts = Array.from({ length: 5 });

    const modal = useRef(null);

    const handleLives = (checked) => {
        setEnableLives(checked);
    };

    const handleHints = (checked) => {
        setEnableHints(checked);
    };

    const handleTime = (checked) => {
        setEnableTime(checked);
    };

    const handleClose = () => {
        modal.current.close();
    }

    return (
        <div className='header-container'>
            <header>
                {/* <div id='menuOpen'><Hamburger color='#013141' toggled={isOpen} toggle={setOpen}></Hamburger></div> */}
                <svg id="menuOpen" onClick={()=>setOpen(true)} width="40" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                        fill="#013141"
                    />
                </svg>

                <img id='logo' src={logo} alt='WhoDat?' onClick={()=>window.location.reload()}></img>
                <svg id='info' onClick={()=>modal.current.showModal()} fill="#013141" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g data-name="Layer 2">
                        <g data-name="menu-arrow-circle">
                            <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/>
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                            <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5 1 1 0 0 0 2 0A1.5 1.5 0 1 1 12 11a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-1.16A3.49 3.49 0 0 0 12 6z"/>
                            <circle cx="12" cy="17" r="1"/>
                        </g>
                    </g>
                </svg>
            </header>

            {isOpen && <div className="overlay visible" onClick={() => setOpen(false)}></div>}
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                <svg id="menuClose" onClick={()=>setOpen(false)} width="48" height="48" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" fill="#013141">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> 
                        <g id="color"></g>
                        <g id="hair"></g> 
                        <g id="skin"></g> 
                        <g id="skin-shadow"></g> 
                        <g id="line"> 
                            <line x1="17.5" x2="54.5" y1="17.5" y2="54.5" fill="none" stroke="#013141" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="4"></line> 
                            <line x1="54.5" x2="17.5" y1="17.5" y2="54.5" fill="none" stroke="#013141" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="4"></line>
                        </g> 
                    </g>
                </svg>
                {/* <div id='menuClose'><Hamburger color='#013141' toggled={isOpen} toggle={setOpen}></Hamburger></div> */}
                <ul>
                    <li>
                        <div className='switch-container'>
                            Enable Lives
                            <Switch
                            onChange={handleLives}
                            checked={enableLives}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            />
                        </div>
                        {enableLives && 
                        <div className='lives-container'>
                            {hearts.map((_, i) => {
                            const isFilled = hoveredIndex !== null
                            ? i <= hoveredIndex
                            : i <= selectedIndex;

                            return (
                            <svg
                                key={i}
                                viewBox="0 0 24 24"
                                width="32"
                                height="32"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {setSelectedIndex(i); setLives(i+1)}}
                                fill={isFilled ? "red" : "none"}
                                stroke="red"
                                strokeWidth="2">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                                2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                                14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                                6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            );
                        })}
                        </div>}
                    </li>
                    <li>
                        <div className='switch-container'>
                            Enable Hints
                            <Switch
                            onChange={handleHints}
                            checked={enableHints}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            />
                        </div>
                        {enableHints && <div className='checkbox-container'>
                            <div>
                                <input 
                                    type='checkbox' 
                                    id='team' 
                                    checked={hints.team}
                                    onChange={(e)=>setHints((prev)=>({...prev, team: e.target.checked}))}
                                />
                                <label htmlFor='team'>Team</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox'
                                    id='position'
                                    checked={hints.position}
                                    onChange={(e)=>setHints((prev)=>({...prev, position: e.target.checked}))}
                                />
                                <label htmlFor='position'>Position</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox' 
                                    id='age'
                                    checked={hints.age}
                                    onChange={(e)=>setHints((prev)=>({...prev, age: e.target.checked}))}
                                />
                                <label htmlFor='age'>Age</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox' 
                                    id='height'
                                    checked={hints.height}
                                    onChange={(e)=>setHints((prev)=>({...prev, height: e.target.checked}))}
                                />
                                <label htmlFor='height'>Height</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox' 
                                    id='college'
                                    checked={hints.college}
                                    onChange={(e)=>setHints((prev)=>({...prev, college: e.target.checked}))}
                                />
                                <label htmlFor='college'>College</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox' 
                                    id='number'
                                    checked={hints.number}
                                    onChange={(e)=>setHints((prev)=>({...prev, number: e.target.checked}))}
                                />
                                <label htmlFor='number'>Number</label>
                            </div>
                        </div>}
                    </li>
                    <li>
                        <div className='switch-container'>
                            Enable Time Limit
                            <Switch
                            onChange={handleTime}
                            checked={enableTime}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            />
                        </div>
                        {enableTime && <div>
                            <input 
                                id='slider'
                                type='range' 
                                min={1} 
                                max={10} 
                                value={timeLimit} 
                                onChange={(e)=>setTimeLimit(Number(e.target.value))}
                            />
                            <label htmlFor='slider'>{timeLimit}s</label>
                        </div>}
                    </li>
                </ul>
            </nav>

            <dialog ref={modal}>
                <div className='how-to-play'>
                    <button onClick={handleClose}>{'← Back'}</button>
                    <h2>How to Play:</h2>
                    <hr></hr>
                    <h3>Difficulties:</h3>
                    <div className='span-container'>
                        <p>{<span id='easy-span'>Easy</span>} - Guess the NBA player out of the four options.</p>
                        <p>{<span id='normal-span'>Normal</span>} - Guess the NBA player using the search bar.</p>
                        <p>{<span id='hard-span'>Hard</span>} - Guess the NBA player based on their silhouette.</p>
                    </div>
                    <div className='ball-container'>
                        <img src={icon} alt='Basketball'></img>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default Header