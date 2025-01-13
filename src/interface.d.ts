export interface DictionaryAnswer {
    word: string,
    phonetics:
    {
        text: string,
        audio: string
    }[]
    ,
    origin: string,
    meanings:
    {
        partOfSpeech: string,
        definitions:
        {
            definition: string,
            example: string,
            synonyms: string[],
            antonyms: string[]
        }[]

    }[],
    license: {
        name: string,
        url: string
    },
    sourceUrls: string[]
}


export interface DictionaryAnswerWithError {
    title: string,
    message: string,
    resolution: string
}