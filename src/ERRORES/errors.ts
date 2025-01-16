import { DictionaryAnswerWithError } from "../interface";

export class ResultsNotFound extends Error {
    public objectError: DictionaryAnswerWithError;

    constructor(objectError: DictionaryAnswerWithError) {
        super();
        this.name = 'ResultsNotFound';
        this.objectError = {
            message: objectError.message,
            resolution: objectError.resolution,
            title: objectError.title,
        };
    }
}

export class GenericError extends Error {

    constructor(message:string) {
        super(message);
        this.name = 'GenericError'
        this.message = message
    }
}