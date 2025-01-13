import { GiBlackBook } from "react-icons/gi";
import { RiLetterSpacing2 } from "react-icons/ri";
import { IoMoonOutline } from "react-icons/io5";
import { FaSun } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import './style.css'
import { useQuery } from "react-query";
import { DictionaryAnswer, DictionaryAnswerWithError } from "./interface";
import { toast, Toaster } from "sonner";

export default function App() {

    const [sourceOfLetter, setSourceOfLetter] = useState<string>('serif')

    let timeBeforeSearching: ReturnType<typeof setTimeout>;
    const [keyword, setKeyword] = useState<string | undefined>(undefined)
    const [result, setResult] = useState<DictionaryAnswer | DictionaryAnswerWithError | undefined>(undefined)

    const doublingSetWordReference = (value: string) => {
        if (timeBeforeSearching) clearTimeout(timeBeforeSearching)

        timeBeforeSearching = setTimeout(() => {
            const wordfiltered = value
                .trim()
                .toLocaleLowerCase()
                .replace(/[\W\s]/g, '')

            if (wordfiltered.length <= 0) return
            setKeyword(wordfiltered)

        }, 1000)
    }

    const { isLoading, isError } = useQuery({
        queryKey: [keyword],
        queryFn: async () => fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`, { method: 'GET' })
            .then(res => {
                if (!res.ok) {
                    toast.error('Hubo un problema al procesar la solicitud de dictionaryapi.dev')
                    throw new Error('Error fetching data')
                }
                return res.json()
            }),
        enabled: !!keyword,
        staleTime: 1800000,
        cacheTime: 1800000,
        onError: () => { },
        onSuccess: (newData) => {
            console.log(newData);
        },
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: 2000,
    })

    return (<>
        <Toaster position="bottom-center" />


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

        <main style={{ fontFamily: `${sourceOfLetter}` }}>
            <label htmlFor="">
                <input type="search" onChange={(e) => doublingSetWordReference(e.target.value)} />
                <CiSearch />
            </label>

            <div>
                <div>
                    <span>{keyword ? keyword : '¡Bienvenido! Busca una palabra.'}</span>
                    {keyword && <span>{keyword}</span>}
                </div>
                <button type="button">▶</button>
            </div>

            {isLoading ? <span>Cargando datos de busqueda</span> : isError && <span>Ocurrió un error</span>}
        </main>

    </>)
}