import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import ReactLoading from 'react-loading'

// Components
import FavPooke from './component/FavPoke'
import FavPoke from './component/FavPoke'

function App() {
  const [poke, setPoke] = useState(""); //สร้างstateไว้เก็บข้อมูลpokemon 
  const [loading, setLoading] = useState(false); //ค่าเริ่มต้นเป็นf พอเรียกใช้จะset true พอfetch เสร็จไม่มีอะไรผิดก็set fเหมือนเดิม
  const [error, setError] = useState("");
  const [number, setNumber] = useState(1);
  const [fav, setFav] = useState([]);

  //fetch ข้อมูลนอกreact
  useEffect(() => {
    let abortController = new AbortController(); //cancel request(ป้องกันการเรียกซ้ำ)
    const loadPoke = async () => {
      try{
        setLoading(true);
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`,{
          signal: abortController.signal //เวลาจะยิงreqไปที่apiใช้แบบนี้
        });

        setPoke(response.data)
        setError("");

      }catch(error){
        setError("Something went wrong", error);
      }finally{
        setLoading(false);
      }
    }

    loadPoke();

    console.log(poke);

    return () => abortController.abort();
  }, [number])

  console.log(poke);

  const prevPoke = () => {
    setNumber((number) => number - 1)
  }

  const nextPoke = () => {
    setNumber((number) => number + 1)
  }

  const addFav = () => {
    setFav((oldState) => [...oldState, poke])
  }

  console.log("Pokemon ID:", number);
  console.log("Your fav pokemon: ", fav)

  return (
    <div className="max-w-5xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
        <div>
          {loading ? <ReactLoading type='spin' color='black' height={'20%'} width={'20%'}/> 
          : 
          <>
            <h1>{poke?.name}</h1>
            <button onClick={addFav}>Add to favourite</button>
            <br />
            <img src={poke?.sprites?.other?.home?.front_default} alt={poke?.home} />
            <ul>
              {poke?.abilities?.map((abil, idx) => (
                <li key={idx}>{abil.ability.name}</li>
              ))}
            </ul>
            <button onClick={prevPoke}>Previous</button>
            <button onClick={nextPoke}>Next</button>
          </>}
          
        </div>
        <div>
          <h2>Your favourite pokemon</h2>
          {fav.length > 0 ? <FavPoke fav={fav}/> : <div className='flex h-full justify-center items-center'><p>No favourite pokemon...</p></div>}
        </div>
      </div>
    </div>
  )
}

export default App
