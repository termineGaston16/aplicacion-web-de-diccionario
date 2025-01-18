import { useEffect, useRef, useState } from "react";
import { DictionaryAnswer, DictionaryAnswerWithError } from "../interface"
import { ImSearch } from "react-icons/im";
import '../CSS/showResults.css'

interface Props {
    result: DictionaryAnswer[] | DictionaryAnswerWithError | undefined,
    isLoading: boolean,
    isError: boolean
}

const ShowResults: React.FC<Props> = ({ result, isLoading, isError }) => {

    const [linkAudio, setLinkAudio] = useState<string>('')
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (Array.isArray(result)) setLinkAudio(result[0]?.phonetics[0]?.audio)
    }, [result])

    if (isLoading) {
        return (
            <div className="ShowResults__isLoading">
                <ImSearch className="ShowResults__isLoading__icon" />
                <span className="ShowResults__isLoading__textMessage">Buscando...</span>
            </div>
        );
    }

    if (result) {
        if ('title' in result) {
            return (
                <div className="ShowResults__resultNotFound">
                    <h3 className="ShowResults__resultNotFound__title">{result.title}</h3>
                    <p className="ShowResults__resultNotFound__message">{result.message}</p>
                    <p className="ShowResults__resultNotFound__resolution">{result.resolution}</p>
                </div>
            );

        } else {

            return (
                <ul className="ShowResults__results">
                    {result?.map((word, index) => (
                        <li
                            className="ShowResults__results__item"
                            key={index}>
                            <section className="ShowResults__results__item__word">
                                <div className="ShowResults__results__item__word__content">
                                    <span className="ShowResults__results__item__word__content__world-span">{word.word}</span>

                                    <select
                                        className="ShowResults__results__item__word__content__select_world-scund"
                                        onChange={e => {
                                            const selectedValue = e.target.value;

                                            if (selectedValue) {
                                                setLinkAudio(selectedValue);
                                            } else {
                                                setLinkAudio('')
                                            }
                                        }}
                                    >
                                        {word.phonetics.map((item, index) => (
                                            item.text && <option
                                                className="ShowResults__results__item__word__content__world-scund"
                                                key={index} value={item.audio}>{item.text}</option>
                                        ))}
                                    </select>
                                </div>

                                <audio
                                    ref={audioRef}
                                    src={linkAudio}></audio>
                                <button
                                    className={`ShowResults__results__item__word__audio ${linkAudio.length <= 0 && 'no-audio'}`}
                                    onClick={() => { if (linkAudio.length > 0) audioRef.current?.play() }}
                                    type="button">▶</button>
                            </section>

                            <section className="ShowResults__results__item__complements">
                                <ul className="ShowResults__results__item__complements__list">
                                    {word.meanings.map((item, index) => (
                                        <li
                                            className="ShowResults__results__item__complements__list__item"
                                            key={index}>
                                            <h4 className="ShowResults__results__item__complements__list__item__partOfSpeech">{item.partOfSpeech}</h4>

                                            <ul className="ShowResults__results__item__complements__list__item__definitions">
                                                {item.definitions.map((def, index) => (
                                                    <li
                                                        className="ShowResults__results__item__complements__list__item__definitions__def"
                                                        key={index}>

                                                        {def.definition && <p className="ShowResults__results__item__complements__list__item__definitions__def__p">
                                                            <span className="ShowResults__results__item__complements__list__item__definitions__def__p__title">Definición:</span> <br />
                                                            {def.definition}
                                                        </p>}

                                                        {def.example && <p className="ShowResults__results__item__complements__list__item__definitions__def__p">
                                                            <span className="ShowResults__results__item__complements__list__item__definitions__def__p__title">Ejemplo:</span> <br />
                                                            {def.example}
                                                        </p>}

                                                    </li>
                                                ))}
                                            </ul>

                                            <ul className="ShowResults__results__item__complements__list__item__list__synonyms">
                                                {item.synonyms.length > 0 && <span className="ShowResults__results__item__complements__list__item__list__synonyms__word__title">Sínonimos: </span>}
                                                {item.synonyms.map((word, index) => (
                                                    <li
                                                        className="ShowResults__results__item__complements__list__item__list__synonyms__word"
                                                        key={index}>
                                                        {word}
                                                    </li>
                                                ))}
                                            </ul>

                                            <ul className="ShowResults__results__item__complements__list__item__list__synonyms">
                                                {item.antonyms.length > 0 && <span className="ShowResults__results__item__complements__list__item__list__synonyms__word__title">Antónimos: </span>}
                                                {item.antonyms.map((word, index) => (
                                                    <li
                                                        className="ShowResults__results__item__complements__list__item__list__synonyms__word"
                                                        key={index}>
                                                        {word}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>

                                <span className="ShowResults__results__item__complements__font">Fuente:</span>
                                {word.sourceUrls.map((link, index) => (
                                    <a
                                        className="ShowResults__results__item__complements__font__arcor"
                                        key={index}
                                        target="_blank" href={link}>{link}</a>
                                ))}

                            </section>
                        </li>
                    ))}
                </ul>
            );
        }
    }

    if (isError) {
        return <span style={{ color: 'red' }}>
            Ocurrió un error inesperado. Vuelve a intentarlo.
        </span>;
    }


    return undefined;
};

export default ShowResults;
