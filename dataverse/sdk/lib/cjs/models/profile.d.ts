import { CeramicDoc } from '../typings';
export interface BasicProfile {
    name: string;
    description: string;
    image: {
        original: {
            src: string;
            mimeType: string;
            width: number;
            height: number;
        };
    };
    background: {
        original: {
            src: string;
            mimeType: string;
            width: number;
            height: number;
        };
    };
}
export declare type BasicProfileDoc = CeramicDoc<BasicProfile>;
