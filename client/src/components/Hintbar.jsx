import { useState, useEffect, useRef } from "react"

export default function Hintbar(){
    const [input, setInput] = useState("")
    const name = "Jack Pembrook"
    const hint = Array.from(name).map((letter, i) =>
                    letter === " "
                        ? " "
                        : "_"
                );
    const [change, setChange] = useState(hint)

    return (
        <div className="w-full h-full flex flex-col gap-8 justify-center items-center text-5xl tracking-widest">
            <button onClick={()=>{
                setInput("")
            }}>Clear input</button>
            <input 
                type="text"
                value={input}
                onChange={(e)=>setInput(e.target.value)} 
                placeholder="Enter text"
                className="w-1/2 p-8 bg-yellow-500"
            />
            <div className="flex flex-row">
                {Array.from(name).map((letter, i) =>
                    letter === " "
                        ? <div key={i} className="ml-1">&nbsp;</div>
                        : <div key={i} className="ml-1">_</div>
                )}
            </div>
            {hint}
            <button onClick={()=>{
                setInput(hint.join(""))
            }}>Click me!</button>

            <button onClick={()=>{
                setChange(prev => {
                    const newChange = [...prev];

                    let rand;
                    do {
                        rand = Math.floor(Math.random() * name.length);
                    } while (name[rand] === " " || newChange[rand] === name[rand]);

                    newChange[rand] = name[rand];

                    const newInput = newChange.join("");
                    setInput(newInput);

                    return newInput;
                });
            }}>Click me 2!</button>
        </div>
    )
}