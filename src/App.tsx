import { GiBlackBook } from "react-icons/gi";
import { RiLetterSpacing2 } from "react-icons/ri";
import { IoMoonOutline } from "react-icons/io5";
import { FaSun } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { useQuery } from "react-query";
import { DictionaryAnswer, DictionaryAnswerWithError } from "./interface";
import { ResultsNotFound, GenericError } from "./ERRORES/errors";
import ShowResults from "./RESULTS/ShowResults";

import './style.css'
import './CSS/app.css'


export default function App() {

    const [sourceOfLetter, setSourceOfLetter] = useState<string>('serif')
    const [backgroundTheme, setBackgroundTheme] = useState<string>('light')

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
        <header
            className="app-header"
            style={{ fontFamily: `${sourceOfLetter}` }}>
            <a
                className="app-header__ancla"
                href="/" rel="noopener noreferrer">
                <GiBlackBook className="app-header__ancla__icon" />
                Free Dictionary API
            </a>

            <div className="app-header__change">
                <div className="app-header__changeLetter">
                    <select
                        className="app-header__changeLetter__select"
                        onChange={(e) => setSourceOfLetter(e.target.value)}>
                        <option
                            className="app-header__changeLetter__select__letter"
                            value="serif" style={{ fontFamily: 'serif' }}>Serif</option>

                        <option
                            className="app-header__changeLetter__select__letter"
                            value="sans-serif" style={{ fontFamily: 'sans-serif' }}>Sans Serif</option>

                        <option
                            className="app-header__changeLetter__select__letter"
                            value="monospace" style={{ fontFamily: 'monospace' }}>Monospace</option>
                    </select>
                    <RiLetterSpacing2 className="app-header__changeLetter__icon" />
                </div>

                <div className="app-header__changeTema">
                    <input
                        style={{ opacity: '0', cursor: 'pointer' }}
                        type="radio"
                        id="dark"
                        name="theme"
                        value="dark"
                        onChange={(e) => setBackgroundTheme(e.target.value)}
                    />
                    <input
                        style={{ opacity: '0', cursor: 'pointer' }}
                        type="radio"
                        id="light"
                        name="theme"
                        value="light"
                        onChange={(e) => setBackgroundTheme(e.target.value)}
                    />
                    <div className={`topicIndicator ${backgroundTheme}`}></div>
                </div>

                {backgroundTheme === 'light' ? <FaSun className="app-header__light-icon" /> : <IoMoonOutline className="app-header__dark-icon" />}

            </div>

        </header>

        <main
            className="app-main"
            style={{ fontFamily: `${sourceOfLetter}` }}>
                
            <div className="app-main__label-search">
                <input
                    className="app-main__input-search"
                    style={{ fontFamily: `${sourceOfLetter}` }}
                    type="search" onChange={(e) => doublingSetWordReference(e.target.value)} />
                <CiSearch className="app-main__input-search__icon" />
            </div>

            {
                !result && !isError
                    ?
                    <span className="app-main__welcome">¡Bienvenido! Busca una palabra.</span>
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