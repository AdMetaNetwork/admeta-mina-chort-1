import { Field, SmartContract, State } from 'o1js';
export declare class Score extends SmartContract {
    GameFi: State<import("o1js/dist/node/lib/field").Field>;
    DeFi: State<import("o1js/dist/node/lib/field").Field>;
    Metaverse: State<import("o1js/dist/node/lib/field").Field>;
    NFT: State<import("o1js/dist/node/lib/field").Field>;
    DID: State<import("o1js/dist/node/lib/field").Field>;
    AI: State<import("o1js/dist/node/lib/field").Field>;
    init(): void;
    updateScore(GameFi: Field, DeFi: Field, Metaverse: Field, NFT: Field, DID: Field, AI: Field): void;
}
