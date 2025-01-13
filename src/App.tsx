import { GiBlackBook } from "react-icons/gi";
import { RiLetterSpacing2 } from "react-icons/ri";
import { IoMoonOutline } from "react-icons/io5";
import { FaSun } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import './style.css'
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

export default function App() {

    const [sourceOfLetter, setSourceOfLetter] = useState<string>('serif')

    const [keyword, setKeyword] = useState<string>('')
    const query = new QueryClient

    const { isLoading, isError } = useQuery({
        queryKey: [keyword],
        queryFn: async () => fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`, { method: 'GET' })
            .then(res => {
                if (!res.ok) throw new Error('Error fetching data')
                return res.json()
            }),
        cacheTime: 0,
        enabled: keyword!!,
        onError:()=>{},
        onSuccess:()=>{},
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay:2000,
    })

    return (<>
        <header style={{ fontFamily: `${sourceOfLetter}` }}>
            <a href="/" rel="noopener noreferrer">
                <GiBlackBook />
                Free Dictionary API
            </a>

            <div>
                <select onChange={(e) => setSourceOfLetter(e.target.value)}>
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="monospace">Monospace</option>
                </select>
                <RiLetterSpacing2 />
            </div>

            <div>
                <label>
                    <input type="radio" name="option" value="option1" />
                </label>

                <label>
                    <input type="radio" name="option" value="option2" />
                </label>

                <IoMoonOutline />
                <FaSun />
            </div>

        </header>

        <QueryClientProvider client={query}>
            <main style={{ fontFamily: `${sourceOfLetter}` }}>
                <label htmlFor="">
                    <input type="search" />
                    <CiSearch />
                </label>

                <div>
                    <div>
                        <span>{keyword.length <= 0 ? '¡Bienvenido! Busca una palabra' : keyword}</span>
                        {keyword && <span>{keyword}</span>}
                    </div>
                    <button type="button">▶</button>
                </div>
            </main>
        </QueryClientProvider>

    </>)
}