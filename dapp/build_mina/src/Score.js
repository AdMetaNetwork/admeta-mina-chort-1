var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method } from 'o1js';
export class Score extends SmartContract {
    constructor() {
        super(...arguments);
        this.GameFi = State();
        this.DeFi = State();
        this.Metaverse = State();
        this.NFT = State();
        this.DID = State();
        this.AI = State();
    }
    init() {
        super.init();
        this.GameFi.set(Field(0));
        this.DeFi.set(Field(0));
        this.Metaverse.set(Field(0));
        this.NFT.set(Field(0));
        this.DID.set(Field(0));
        this.AI.set(Field(0));
    }
    updateScore(GameFi, DeFi, Metaverse, NFT, DID, AI) {
        const currentGameFi = this.GameFi.getAndAssertEquals();
        const currentDeFi = this.DeFi.getAndAssertEquals();
        const currentMetaverse = this.Metaverse.getAndAssertEquals();
        const currentNFT = this.NFT.getAndAssertEquals();
        const currentDID = this.DID.getAndAssertEquals();
        const currentAI = this.AI.getAndAssertEquals();
        this.GameFi.set(currentGameFi.add(GameFi));
        this.DeFi.set(currentDeFi.add(DeFi));
        this.Metaverse.set(currentMetaverse.add(Metaverse));
        this.NFT.set(currentNFT.add(NFT));
        this.DID.set(currentDID.add(DID));
        this.AI.set(currentAI.add(AI));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "GameFi", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "DeFi", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "Metaverse", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "NFT", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "DID", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "AI", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field, Field, Field, Field, Field]),
    __metadata("design:returntype", void 0)
], Score.prototype, "updateScore", null);
//# sourceMappingURL=Score.js.map