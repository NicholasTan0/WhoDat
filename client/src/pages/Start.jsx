// import logo from '../assets/logo-dark.png'

export default function Start({ setDifficulty, setScreen }) {
    return(
        <div className="flex flex-col w-full h-full justify-center items-center pb-8">
            <div className='grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 gap-6 px-[10vw] w-full h-full'>
                <div
                    className="group outline-offwhite outline-4 flex flex-col justify-start md:justify-center items-center h-full cursor-pointer bg-black/60 text-offwhite p-10 relative isolate overflow-hidden hover:outline-green-500
                    before:content-[''] before:absolute before:inset-0 before:-z-10 
                    before:bg-[url('/src/assets/silhouette.png')] before:bg-cover before:bg-center 
                    before:opacity-15 before:scale-110 before:filter-[blur(8px)] 
                    before:transition-all before:duration-250
                    hover:before:scale-100 hover:before:filter-[blur(0px)]" 
                    onClick={()=>setDifficulty("easy")}
                >
                    <h1 className='font-bold text-[clamp(3cqi,3.5rem,6rem)] text-green-500 md:mt-16'>Easy</h1>
                    <div className='flex justify-center items-center md:w-full'>
                        <hr className="grow border-t-2 hidden md:block border-offwhite -mb-2" />
                        <h2 className='text-[clamp(0.8rem,1.5cqi,3vw)] px-3'>Multiple Choice</h2>
                        <hr className="grow border-t-2 hidden md:block border-offwhite -mb-2" />
                    </div>
                    <p className='transtion-all duration-200 md:opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-center text-[clamp(1rem,2vw,1.5cqi)] text-offwhite mt-4 grow'>Pick the player's name out of a random selection of other players. Change the number of choices as needed.</p>
                    <p className='transtion-all duration-200 absolute md:bottom-[8%] opacity-0 md:opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-3 text-center text-[4cqi] text-offwhite'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-current h-[4cqi] aspect-square" viewBox="0 0 16 16">
                            <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5z"/>
                            <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0"/>
                        </svg>
                    </p>
                </div>
                <div
                    className="group outline-offwhite outline-4 flex flex-col justify-start md:justify-center items-center h-full cursor-pointer bg-black/60 text-offwhite p-10 relative isolate overflow-hidden hover:outline-yellow-500
                    before:content-[''] before:absolute before:inset-0 before:-z-10 
                    before:bg-[url('/src/assets/silhouette.png')] before:bg-cover before:bg-center 
                    before:opacity-15 before:scale-110 before:filter-[blur(8px)] 
                    before:transition-all before:duration-250
                    hover:before:scale-100 hover:before:filter-[blur(0px)]" 
                    onClick={()=>setDifficulty("medium")}
                >
                    <h1 className='font-bold text-[clamp(3cqi,3.5rem,6rem)] text-yellow-500 md:mt-16'>Medium</h1>
                    <div className='flex justify-center items-center w-full'>
                        <hr className="grow border-t-2 hidden md:block border-offwhite -mb-2" />
                        <h2 className='text-[clamp(0.8rem,1.5cqi,3vw)] px-3'>Assisted Search</h2>
                        <hr className="grow border-t-2 hidden md:block border-offwhite -mb-2" />
                    </div>
                    <p className='transtion-all duration-200 md:opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-center text-[clamp(1rem,2vw,1.5cqi)] text-offwhite mt-4 grow'>Use the search bar to find the player's name. Results will show up to help you narrow down the right player.</p>
                    <p className='transtion-all duration-200 absolute md:bottom-[8%] opacity-0 md:opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-3 text-center text-[4cqi] text-offwhite'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-current h-[clamp(16px,3.5cqi,64px)] aspect-square" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </p>
                </div>
                <div 
                    className="group outline-offwhite outline-4 flex flex-col justify-start md:justify-center items-center h-full cursor-pointer bg-black/60 text-offwhite p-10 relative isolate overflow-hidden hover:outline-red-500
                    before:content-[''] before:absolute before:inset-0 before:-z-10 
                    before:bg-[url('/src/assets/silhouette.png')] before:bg-cover before:bg-center 
                    before:opacity-15 before:scale-110 before:filter-[blur(8px)] 
                    before:transition-all before:duration-250
                    hover:before:scale-100 hover:before:filter-[blur(0px)]"
                    onClick={() => setDifficulty("hard")}
                >
                    <h1 className='font-bold text-[clamp(3cqi,3.5rem,6rem)] text-red-500 md:mt-16'>Hard</h1>
                    <div className='flex justify-center items-center w-full'>
                        <hr className="grow border-t-2 hidden md:block border-offwhite -mb-2" />
                        <h2 className='text-[clamp(0.8rem,1.5cqi,3vw)] px-3'>Spelling Bee</h2>
                        <hr className="grow border-t-2 hidden md:block border-offwhite -mb-2" />
                    </div>
                    <p className='transtion-all duration-200 md:opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-center text-[clamp(1rem,2vw,1.5cqi)] text-offwhite mt-4 grow'>Type out the player's full name with no help from the search bar. Don't miss the hyphens, and apostrophes!</p>
                    <p className='transtion-all duration-200 absolute md:bottom-[8%] opacity-0 md:opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-3 text-center text-[4cqi] text-offwhite'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-current h-[4cqi] aspect-square" viewBox="0 0 16 16">
                            <path d="M8.217 11.068c1.216 0 1.948-.869 1.948-2.31v-.702c0-1.44-.727-2.305-1.929-2.305-.742 0-1.328.347-1.499.889h-.063V3.983h-1.29V11h1.27v-.791h.064c.21.532.776.86 1.499.86zm-.43-1.025c-.66 0-1.113-.518-1.113-1.28V8.12c0-.825.42-1.343 1.098-1.343.684 0 1.075.518 1.075 1.416v.45c0 .888-.386 1.401-1.06 1.401zm-5.583 1.035c.767 0 1.201-.356 1.406-.737h.059V11h1.216V7.519c0-1.314-.947-1.783-2.11-1.783C1.355 5.736.75 6.42.69 7.27h1.216c.064-.323.313-.552.84-.552s.864.249.864.771v.464H2.346C1.145 7.953.5 8.568.5 9.496c0 .977.693 1.582 1.704 1.582m.42-.947c-.44 0-.845-.235-.845-.718 0-.395.269-.684.84-.684h.991v.538c0 .503-.444.864-.986.864m8.897.567c-.577-.4-.9-1.088-.9-1.983v-.65c0-1.42.894-2.338 2.305-2.338 1.352 0 2.119.82 2.139 1.806h-1.187c-.04-.351-.283-.776-.918-.776-.674 0-1.045.517-1.045 1.328v.625c0 .468.121.834.343 1.067z"/>
                            <path d="M14.469 9.414a.75.75 0 0 1 .117 1.055l-4 5a.75.75 0 0 1-1.116.061l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.908 1.907 3.476-4.346a.75.75 0 0 1 1.055-.117"/>
                        </svg>
                    </p>
                </div>
            </div>
            <button className="flex justify-center items-center cursor-pointer mt-8 w-min text-offwhite" title="Home" onClick={()=>setScreen("title")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
            </button>
        </div>
    )
}