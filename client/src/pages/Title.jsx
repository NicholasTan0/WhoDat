import Start from "./Start";

export default function Title({ setDifficulty, screen, setScreen }){
    return (
        // <div className="h-full w-full">
        //     <div className="pointer-events-none fixed top-0 left-0 w-72 h-72 bg-white rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]"/>
        //     <div className="h-full w-full grid grid-cols-1 grid-rows-[1fr_1fr_1fr] border-x-0 border-offwhite">
        //         <div className="flex flex-col justify-center items-center mt-16 text-offwhite">
        //             <a href="/" className='font-logo font-extrabold text-[8cqi] text-amber-500'>WhoDat?</a>
        //             <p className="text-[2cqi] -mt-8">NBA Player Guessing Game</p>
        //         </div>
        //         <div className='flex justify-center items-start mt-8'>
        //             {screen === "title" && <div className="flex flex-col justify-center items-center gap-4 mt-8">
        //                 <button 
        //                     className='cursor-pointer rounded-full px-32 py-8 border-2 border-black bg-slate-500/90 text-sky-100 text-2xl hover:text-3xl transition-all'
        //                     onClick={()=>setScreen("pick")}
        //                 >
        //                     Start
        //                 </button>
        //                 <button 
        //                     className='cursor-pointer rounded-full px-32 py-8 border-2 border-black bg-slate-500/90 text-sky-100 text-2xl hover:text-3xl transition-all'
        //                     onClick={()=>setScreen("how")}
        //                 >
        //                     How to Play
        //                 </button>
        //                 <button 
        //                     className='cursor-pointer rounded-full px-32 py-8 border-2 border-black bg-slate-500/90 text-sky-100 text-2xl hover:text-3xl transition-all'
        //                     onClick={()=>setScreen("more")}
        //                 >
        //                     Learn More
        //                 </button>
        //             </div>
        //             }
        //             {screen === "pick" && <Start
        //                 setDifficulty={setDifficulty}
        //                 setScreen={setScreen}
        //             />}
        //             {screen === "how" && <div className="flex flex-col justify-center items-center w-full text-offwhite text-[1.2cqi] bg-slate-600/90 p-8 mx-16 font-sans gap-4">
        //                 <h2 className="font-bold text-[1.5cqi]">How to Play:</h2>
        //                 <div className="text-[1.2cqi] leading-relaxed columns-3 [column-rule:2px_solid] border-2 px-4">
        //                     <div className="p-4">
        //                         <h3 className="font-semibold underline">Select a Difficulty</h3>

        //                         <ul className="list-disc list-inside">
        //                             <li>
        //                                 <span className="font-semibold text-green-400">Easy — Multiple Choice:</span>{" "}
        //                                 Choose the correct player from 4 possible choices.
        //                             </li>
        //                             <li>
        //                                 <span className="font-semibold text-yellow-400">Medium — Assisted Search:</span>{" "}
        //                                 Use the search bar to help find the correct player.
        //                             </li>
        //                             <li>
        //                                 <span className="font-semibold text-red-400">Hard — Spelling Bee:</span>{" "}
        //                                 Type the player's full name into the search bar.
        //                             </li>
        //                         </ul>
        //                     </div>

        //                     <div className="p-4">
        //                         <h3 className="font-semibold underline">Scoring</h3>

        //                         <p>
        //                             Points are awarded based on how quickly you answer. Faster
        //                             correct answers earn more points, while slower answers earn
        //                             fewer points. Incorrect answers earn no points.
        //                         </p>

        //                         <p className="mt-2">
        //                             Each player has a calculated{" "}
        //                             <span className="font-semibold">Notoriety Score</span>, which
        //                             determines their base point value.
        //                         </p>
        //                     </div>

        //                     <div className="p-4">
        //                         <h3 className="font-semibold underline">Hints</h3>

        //                         <p>
        //                             Hints appear on the right side of the screen. Using a hint
        //                             costs points.
        //                         </p>
        //                     </div>

        //                     <div className="p-4">
        //                         <h3 className="font-semibold underline">Settings</h3>

        //                         <p>
        //                             Open the settings menu to toggle the{" "}
        //                             <span className="font-semibold">timer</span> and{" "}
        //                             <span className="font-semibold">autoplay</span> features on
        //                             or off.
        //                         </p>
        //                     </div>
        //                 </div>
        //                 <button 
        //                     className='flex justify-center items-center cursor-pointer gap-3 py-2 px-4 rounded-xl hover:bg-amber-500/70'
        //                     title='Go Back'
        //                     onClick={()=>setScreen("title")}
        //                 >
        //                     <svg className='w-8 h-8 fill-current' viewBox="0 0 16 16">
        //                         <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        //                     </svg>
        //                     <p className='text-2xl'>Back</p>
        //                 </button>
        //             </div>}
        //             {screen === "more" && <div className="flex flex-col justify-center items-center w-1/2 text-offwhite bg-slate-600/90 p-8 mx-16 font-sans">
        //                 <p className="text-center text-[1.2cqi]">All players are pulled from <a className="text-blue-300 underline hover:text-blue-500" href="https://www.espn.com/nba/players" target="_blank" rel="noopener noreferrer">ESPN's NBA team rosters</a>. Player profiles without headshots are excluded. However, players who have valid headshots taken by organizations outside of the NBA (e.g. Colleges) are still included.</p>
        //                 <hr className="my-4 w-full"></hr>
        //                 <p className="text-center text-[1.2cqi]">This game was inspired by the following videos from <a className="text-blue-300 underline italic hover:text-blue-500" href="https://www.youtube.com/@enjoybball" target="_blank" rel="noopener noreferrer">Enjoy BBall</a>:</p>
        //                 <div className='grid grid-rows-3 grid-cols-1 lg:grid-cols-3 lg:grid-rows-1 w-full gap-4 my-4'>
        //                     <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/3n50gDEkFZQ?si=Muw68y_of4TQajae" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        //                     <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/uZ7kgDo7haA?si=i5OOezMVYAVoU6Qk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        //                     <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/7XdaMiemq4o?si=xGRklX3LZadc-ZOV" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        //                 </div>
        //                 <button 
        //                     className='flex justify-center items-center cursor-pointer gap-3 py-2 px-4 rounded-xl hover:bg-amber-500/70'
        //                     title='Go Back'
        //                     onClick={()=>setScreen("title")}
        //                 >
        //                     <svg className='w-8 h-8 fill-current' viewBox="0 0 16 16">
        //                         <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        //                     </svg>
        //                     <p className='text-2xl'>Back</p>
        //                 </button>
        //             </div>}
        //         </div>
        //         <div className="flex flex-col justify-end items-center text-neutral-300 p-4 gap-4">
        //             <div className="flex flex-row gap-4">
        //                 <a href="https://nicholastan0.github.io/" target="_blank" rel="noopener noreferrer" title="Check out my other projects!">
        //                     <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-neutral-400 hover:fill-neutral-200" viewBox="0 0 16 16">
        //                         <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
        //                     </svg>
        //                 </a>
        //                 <a href="https://github.com/NicholasTan0/WhoDat" target="_blank" rel="noopener noreferrer" title="Check out the GitHub!">
        //                     <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-neutral-400 hover:fill-neutral-200" viewBox="0 0 16 16">
        //                         <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
        //                     </svg>
        //                 </a>
        //             </div>
        //             <p>&copy; {new Date().getFullYear()} WhoDat. All rights reserved.</p>
        //         </div>
        //     </div>
        // </div>
        <div className="flex flex-col h-full w-full">
            <div className="hidden sm:block pointer-events-none fixed top-0 left-0 w-72 h-72 bg-white rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]"/>
            <h1 className="flex flex-col justify-center items-center w-full text-offwhite mt-12 mb-8">
                <a href="/" className='font-logo font-extrabold whitespace-nowrap text-[clamp(8cqi,8rem,18vw)] text-amber-500'>WhoDat?</a>
                <p className="text-[clamp(1rem,4cqi,2rem)] -mt-2 md:-mt-4 lg:-mt-8">NBA Player Guessing Game</p>
            </h1>
            <div className='flex flex-1 justify-center items-start'>
                {screen === "title" && <div className="flex flex-col flex-1 w-full justify-center items-center gap-4">
                    <button 
                        className='cursor-pointer rounded-full w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 py-8 border-2 border-black bg-slate-500/90 text-sky-100 text-2xl hover:text-3xl transition-all'
                        onClick={()=>setScreen("pick")}
                    >
                        Start
                    </button>
                    <button 
                        className='cursor-pointer rounded-full  w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 py-8 border-2 border-black bg-slate-500/90 text-sky-100 text-2xl hover:text-3xl transition-all'
                        onClick={()=>setScreen("how")}
                    >
                        How to Play
                    </button>
                    <button 
                        className='cursor-pointer rounded-full  w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 py-8 border-2 border-black bg-slate-500/90 text-sky-100 text-2xl hover:text-3xl transition-all'
                        onClick={()=>setScreen("more")}
                    >
                        Learn More
                    </button>
                </div>
                }
                {screen === "pick" && <Start
                    setDifficulty={setDifficulty}
                    setScreen={setScreen}
                />}
                {screen === "how" && <div className="flex flex-col justify-center items-center w-full text-offwhite bg-slate-600/90 p-8 mx-8 font-sans gap-4">
                    <h2 className="font-bold text-[clamp(2cqi,4vw,2rem)]">How to Play:</h2>
                    <div className="text-[clamp(1rem,1cqi,1vw)] leading-relaxed md:columns-3 [column-rule:2px_solid] border-2 px-4">
                        <div className="p-4">
                            <h3 className="font-semibold underline">Select a Difficulty</h3>

                            <ul className="list-disc list-inside">
                                <li>
                                    <span className="font-semibold text-green-400">Easy — Multiple Choice:</span>{" "}
                                    Choose the correct player from 4 possible choices.
                                </li>
                                <li>
                                    <span className="font-semibold text-yellow-400">Medium — Assisted Search:</span>{" "}
                                    Use the search bar to help find the correct player.
                                </li>
                                <li>
                                    <span className="font-semibold text-red-400">Hard — Spelling Bee:</span>{" "}
                                    Type the player's full name into the search bar.
                                </li>
                            </ul>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold underline">Scoring</h3>

                            <p>
                                Points are awarded based on how quickly you answer. Faster
                                answers earn more points, while slower answers earn
                                fewer points. Incorrect answers earn no points.
                            </p>

                            <p>
                                Each player has a hidden calculated{" "}
                                <span className="font-semibold">Notoriety Score</span>, which
                                determines their base point value.
                            </p>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold underline">Hints</h3>

                            <p>
                                Hints appear on the right side of the screen. Using a hint
                                costs points.
                            </p>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold underline">Settings</h3>

                            <p>
                                Open the settings menu to toggle the{" "}
                                <span className="font-semibold">timer</span> and{" "}
                                <span className="font-semibold">autoplay</span> features on
                                or off.
                            </p>
                        </div>
                    </div>
                    <button 
                        className='flex justify-center items-center cursor-pointer gap-3 py-2 px-4 rounded-xl hover:bg-amber-500/70'
                        title='Go Back'
                        onClick={()=>setScreen("title")}
                    >
                        <svg className='w-8 h-8 fill-current' viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                        <p className='text-2xl'>Back</p>
                    </button>
                </div>}
                {screen === "more" && <div className="flex flex-col justify-center items-center lg:w-1/2 text-offwhite text-[clamp(1.2rem,1.2cqi,1.2vw)] bg-slate-600/90 p-8 mx-4 font-sans">
                    <p className="text-center">All players are pulled from <a className="text-blue-300 underline hover:text-blue-500" href="https://www.espn.com/nba/players" target="_blank" rel="noopener noreferrer">ESPN's NBA team rosters</a>. Player profiles without headshots are excluded. However, players who have valid headshots taken by organizations outside of the NBA (e.g. Colleges) are still included.</p>
                    <hr className="my-4 w-full"></hr>
                    <p className="text-center">This game was inspired by the following videos from <a className="text-blue-300 underline italic hover:text-blue-500" href="https://www.youtube.com/@enjoybball" target="_blank" rel="noopener noreferrer">Enjoy BBall</a>:</p>
                    <div className='grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 w-full gap-4 my-4'>
                        <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/3n50gDEkFZQ?si=Muw68y_of4TQajae" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/uZ7kgDo7haA?si=i5OOezMVYAVoU6Qk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/7XdaMiemq4o?si=xGRklX3LZadc-ZOV" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                    <button 
                        className='flex justify-center items-center cursor-pointer gap-3 py-2 px-4 rounded-xl hover:bg-amber-500/70'
                        title='Go Back'
                        onClick={()=>setScreen("title")}
                    >
                        <svg className='w-8 h-8 fill-current' viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                        <p className='text-2xl'>Back</p>
                    </button>
                </div>}
            </div>
            <div className="flex sm:flex-col justify-center items-center text-neutral-300 py-4 gap-4">
                <div className="flex flex-row gap-4">
                    <a href="https://nicholastan0.github.io/" target="_blank" rel="noopener noreferrer" title="Check out my other projects!">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-neutral-400 hover:fill-neutral-200" viewBox="0 0 16 16">
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                        </svg>
                    </a>
                    <a href="https://github.com/NicholasTan0/WhoDat" target="_blank" rel="noopener noreferrer" title="Check out the GitHub!">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-neutral-400 hover:fill-neutral-200" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                        </svg>
                    </a>
                </div>
                <p className="text-[clamp(8px,14px,16px)]">&copy; {new Date().getFullYear()} WhoDat. All rights reserved.</p>
            </div>
        </div>
    )
}