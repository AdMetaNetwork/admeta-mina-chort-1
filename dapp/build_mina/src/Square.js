var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, Struct, Poseidon } from 'o1js';
class UserScore extends Struct({
    score: Field,
    tag: Field
}) {
    constructor(tag, score) {
        super({ tag, score });
        this.tag = tag;
        this.score = score;
    }
    hash() {
        return Poseidon.hash([this.tag, this.score]);
    }
}
export class Square extends SmartContract {
    constructor() {
        super(...arguments);
        this.num = State();
        this.userScore = State();
        this.tag = State();
        this.score = State();
    }
    init() {
        super.init();
        this.num.set(Field(3));
        this.userScore.set(new UserScore(Field(0), Field(0)).hash());
    }
    updateScore(newTag, newScore, oldTag, oldScore) {
        const currentScore = this.userScore.getAndAssertEquals();
        const currentScoreHash = Poseidon.hash([oldTag, oldScore]);
        currentScoreHash.assertEquals(currentScore);
        this.userScore.set(new UserScore(newTag, newScore).hash());
        const currentState = this.num.getAndAssertEquals();
        this.num.assertEquals(currentState);
        this.num.set(currentState.add(1));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Square.prototype, "num", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Square.prototype, "userScore", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Square.prototype, "tag", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Square.prototype, "score", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field, Field, Field]),
    __metadata("design:returntype", void 0)
], Square.prototype, "updateScore", null);
//# sourceMappingURL=Square.js.map