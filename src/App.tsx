import { GiBlackBook } from "react-icons/gi";
import { RiLetterSpacing2 } from "react-icons/ri";
import { IoMoonOutline } from "react-icons/io5";
import { FaSun } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import './style.css'
import { useQuery } from "react-query";
import { DictionaryAnswer, DictionaryAnswerWithError } from "./interface";
import { ResultsNotFound, GenericError } from "./ERRORES/errors";
import ShowResults from "./RESULTS/showResults";

export default function App() {

    const [sourceOfLetter, setSourceOfLetter] = useState<string>('serif')

    let timeBeforeSearching: ReturnType<typeof setTimeout>;
    const [keyword, setKeyword] = useState<string | undefined>(undefined)
    const [result, setResult] = useState<DictionaryAnswer[] | DictionaryAnswerWithError | undefined>(undefined)

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
        queryFn: async () => {
            try {
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`);

                if (!res.ok && res.status === 404) {
                    const errorJson = await res.json();
                    throw new ResultsNotFound(errorJson);
                }

                if (!res.ok) {
                    throw new GenericError('An unexpected error occurred');
                }

                return await res.json();
            } catch (error) {
                throw error
            }
        },
        enabled: !!keyword,
        cacheTime: 0,
        retry: 0,
        onError: (error) => {
            if (error instanceof ResultsNotFound) {
                setResult(error.objectError);
            } else if (error instanceof GenericError) {
                setResult(undefined)
            }
        },
        onSuccess: (newData) => { setResult(newData) },
        refetchOnWindowFocus: false
    });

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

        <main style={{ fontFamily: `${sourceOfLetter}` }}>
            <label>
                <input type="search" onChange={(e) => doublingSetWordReference(e.target.value)} />
                <CiSearch />
            </label>

            {
                !result
                    ?
                    <span>¡Bienvenido! Busca una palabra.</span>
                    :
                    <ShowResults
                        isError={isError}
                        isLoading={isLoading}
                        result={result}
                    />
            }
        </main>
    </>)
}