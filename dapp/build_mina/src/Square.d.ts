import { Field, SmartContract, State } from 'o1js';
export declare class Square extends SmartContract {
    num: State<import("o1js/dist/node/lib/field").Field>;
    userScore: State<import("o1js/dist/node/lib/field").Field>;
    tag: State<import("o1js/dist/node/lib/field").Field>;
    score: State<import("o1js/dist/node/lib/field").Field>;
    init(): void;
    updateScore(newTag: Field, newScore: Field, oldTag: Field, oldScore: Field): void;
}
