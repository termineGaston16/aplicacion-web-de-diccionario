import { useEffect, useState } from "react";
import { DictionaryAnswer, DictionaryAnswerWithError } from "../interface"
import { ImSearch } from "react-icons/im";

interface Props {
    result: DictionaryAnswer[] | DictionaryAnswerWithError | undefined,
    isLoading: boolean,
    isError: boolean
}

const ShowResults: React.FC<Props> = ({ result, isLoading, isError }) => {

    const [linkAudio, setLinkAudio] = useState<string>('')

    useEffect(() => {
        if (Array.isArray(result)) setLinkAudio(result[0].phonetics[0].audio)
    }, [result])

    if (isLoading) {
        return (
            <div>
                <ImSearch />
                <span>Buscando...</span>
            </div>
        );
    }

    if (result) {
        if ('title' in result) {
            return (
                <div>
                    <h3>{result.title}</h3>
                    <p>{result.message}</p>
                    <p>{result.resolution}</p>
                </div>
            );

        } else {

            return (
                <ul>
                    {result.map((word, index) => (
                        <li key={index}>
                            <section>
                                <div>
                                    <span>{word.word}</span>

                                    <select onChange={e => setLinkAudio(e.target.value)}>
                                        {word.phonetics.map((item, index) => (
                                            <option key={index} value={item.audio}>{item.text}</option>
                                        ))}
                                    </select>
                                </div>

                                <audio src={linkAudio} controls></audio>
                            </section>

                            <section>
                                <ul>
                                    {word.meanings.map((item, index) => (
                                        <li key={index}>
                                            <h4>{item.partOfSpeech}</h4>

                                            <ul>
                                                {item.definitions.map((def, index) => (
                                                    <li key={index}>
                                                        <p>
                                                            <span>Definición:</span> <br />
                                                            {def.definition}
                                                        </p>

                                                        <p>
                                                            <span>Ejemplo:</span> <br />
                                                            {def.example}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>

                                            <ul>
                                                {item.synonyms.map((word, index) => (
                                                    <li key={index}>{word}</li>
                                                ))}
                                            </ul>

                                            <ul>
                                                {item.antonyms.map((word, index) => (
                                                    <li key={index}>{word}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>

                                <span>Fuente:</span>
                                {word.sourceUrls.map((link, index) => (
                                    <a
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
        return <div>Error</div>;
    }

    return undefined;
};

export default ShowResults;
