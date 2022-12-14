import { PathAndContent } from './helpers';
import { Row } from '../../src';
export * from './alternateEncoding';
export * from './noHeadersAndQuotes';
export * from './skipLines';
export * from './withHeaders';
export * from './withHeadersAndQuotes';
export * from './withHeadersAndAlternateQuote';
export * from './withHeadersAndMissingColumns';
export * from './withHeadersAlternateDelimiter';
export * from './withHeadersAndSkippedLines';
export * from './headerColumnMismatch';
export * from './malformed';
export * from './trailingComma';
export * from './emptyRows';
export * from './duplicateHeaders';
export * from './RecordingStream';
export * from './helpers';
export declare const write: <R extends Row<any>>(opts: PathAndContent<R>) => void;
