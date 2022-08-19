/// <reference types="node" />
import { CsvParserStream, Row } from '../../src';
export interface PathAndContent<T extends Row> {
    path: string;
    content: string | Buffer;
    parsed: T[];
}
export interface ParseResults<O extends Row> {
    count: number;
    rows: O[];
    invalidRows: Row[];
}
export declare const collectData: <I extends Row<any>, O extends Row<any>>(stream: CsvParserStream<I, O>) => Promise<ParseResults<O>>;
export declare const parseContentAndCollectFromStream: <I extends Row<any>, O extends Row<any>>(data: PathAndContent<O>, parser: CsvParserStream<I, O>) => Promise<ParseResults<O>>;
export declare const expectParsed: <R extends Row<any>>(resultsPromise: Promise<ParseResults<R>>, expectedRows: any[], expectedInvalidRows?: any[]) => Promise<void>;
