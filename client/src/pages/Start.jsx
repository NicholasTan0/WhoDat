import logo from '../assets/logo.png'

export default function Start({ setDifficulty }) {
    return(
        <div className='flex flex-col flex-1 min-h-0 py-8 px-[15%] gap-4'>
            <img src={logo} className='h-1/5 w-auto object-contain'/>
            <div className='grid grid-cols-3 flex-1 gap-4'>
                <div 
                    className="outline-green-400 outline-2 flex flex-col justify-center items-center h-full cursor-pointer hover:outline-5 bg-white gap-4 p-8 hover:shadow-lg relative isolate hover:before:content-[''] hover:before:absolute hover:before:inset-0 hover:before:-z-10 hover:before:bg-[url('/src/assets/silhouette.png')] hover:before:bg-cover hover:before:bg-center hover:before:opacity-20"
                    onClick={()=>setDifficulty("easy")}
                >
                    <h1 className='font-bold text-5xl'>Easy</h1>
                    <div className='flex justify-center items-center w-full'>
                        <hr className="grow border-t-2 border-black -mb-2" />
                        <h2 className='text-2xl px-3'>Multiple Choice</h2>
                        <hr className="grow border-t-2 border-black -mb-2" />
                    </div>
                    <p className='text-center text-lg text-neutral-600'>Pick the player's name out of a random selection of other players. Change the number of choices as needed.</p>
                </div>
                <div 
                    className= "outline-yellow-400 outline-2 flex flex-col justify-center items-center h-full cursor-pointer hover:outline-5 bg-white gap-2 p-8 hover:shadow-lg relative isolate hover:before:content-[''] hover:before:absolute hover:before:inset-0 hover:before:-z-10 hover:before:bg-[url('/src/assets/silhouette.png')] hover:before:bg-cover hover:before:bg-center hover:before:opacity-20"
                    onClick={()=>setDifficulty("medium")}
                >
                    <h1 className='font-bold text-5xl'>Medium</h1>
                    <div className='flex justify-center items-center w-full'>
                        <hr className="grow border-t-2 border-black -mb-2" />
                        <h2 className='text-2xl px-3'>Assisted Search</h2>
                        <hr className="grow border-t-2 border-black -mb-2" />
                    </div>
                    <p className='text-center text-lg text-neutral-600'>Use the search bar to find the player's name. Results will show up to help you narrow down the right player.</p>
                </div>
                <div 
                    className="outline-red-400 outline-2 flex flex-col justify-center items-center h-full cursor-pointer hover:outline-5 bg-white gap-2 p-8 hover:shadow-lg relative isolate hover:before:content-[''] hover:before:absolute hover:before:inset-0 hover:before:-z-10 hover:before:bg-[url('/src/assets/silhouette.png')] hover:before:bg-cover hover:before:bg-center hover:before:opacity-20"
                    onClick={()=>setDifficulty("hard")}
                >
                    <h1 className='font-bold text-5xl'>Hard</h1>
                    <div className='flex justify-center items-center w-full'>
                        <hr className="grow border-t-2 border-black -mb-2" />
                        <h2 className='text-2xl px-3'>Spelling Bee</h2>
                        <hr className="grow border-t-2 border-black -mb-2" />
                    </div>
                    <p className='text-center text-lg text-neutral-600'>Type out the player's full name with no help from the search bar. Don't miss the hyphens, and apostrophes!</p>
                </div>
            </div>
            <div className='flex flex-row h-1/8 justify-center items-center gap-4'>
                <div className='text-lg h-min border-2 text-neutral-800 rounded-full py-4 px-8 bg-white hover:underline hover:bg-offwhite active:scale-95 cursor-pointer transition-all'>How to Play</div>
                <div className='text-lg h-min border-2 text-neutral-800 rounded-full py-4 px-8 bg-white hover:underline hover:bg-offwhite active:scale-95 cursor-pointer transition-all'>Settings</div>
                <div className='text-lg h-min border-2 text-neutral-800 rounded-full py-4 px-8 bg-white hover:underline hover:bg-offwhite active:scale-95 cursor-pointer transition-all'>Learn More</div>
            </div>
        </div>
    )
}