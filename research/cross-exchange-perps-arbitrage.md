# Cross-Exchange Perps Arbitrage: Funding + Basis Spreads

**Research Date:** 2026-02-14  
**Status:** Complete

---

## Executive Summary

Cross-exchange perpetual futures arbitrage exploits structural inefficiencies between exchanges — primarily **funding rate differentials** and **basis spreads**. Historical data shows consistent 5-15% APR yields with low directional risk when executed properly.

---

## 1. Funding Rate Mechanics

### Why Funding Rates Exist
- Perpetual futures have no expiry → no natural convergence to spot
- **Funding rate** = periodic payment between longs/shorts to anchor perp price to spot
- When perp > spot: positive funding → longs pay shorts
- When perp < spot: negative funding → shorts pay longs

### Why Rates Differ Across Exchanges
| Factor | Impact |
|--------|--------|
| Settlement frequency | Binance: 8h, Hyperliquid: 1h, dYdX: 8h |
| Liquidity depth | More liquidity → smaller divergence |
| Trader flow/sentiment | Different user bases → different positioning |
| Risk parameters | Liquidation engines, margin requirements |
| Market making | Different MM presence compresses rates differently |

**Key insight:** These structural differences create *persistent* spreads, not random noise.

---

## 2. Core Arbitrage Strategies

### 2.1 Cross-Exchange Funding Arbitrage

**Setup:**
- Exchange A: BTC funding = +5% APR (longs pay)
- Exchange B: BTC funding = +25% APR (shorts receive)

**Execution:**
1. **Long BTC perp** on Exchange A (pay 5%)
2. **Short BTC perp** on Exchange B (receive 25%)

**Result:** Delta-neutral, earn 20% APR funding differential

**Risks:**
- Margin on 2 exchanges (capital inefficient)
- Funding rate can flip
- Liquidation risk during volatility
- Rebalancing costs

### 2.2 Cash-and-Carry (Basis Trade)

**Setup:**
- Spot BTC: $100,000
- BTC perp: $100,500 (0.5% premium)
- Funding rate: +15% APR

**Execution:**
1. **Buy spot** BTC
2. **Short perp** BTC (same size)

**Result:** Lock in premium + collect positive funding

**Why it works:**
- Perp trades at premium when market bullish
- You're selling that premium while collecting funding
- Delta-neutral to BTC price

### 2.3 Fixed-Yield via Funding Rate Swaps (Boros)

**Innovation:** Lock in funding rates via on-chain interest rate swaps

**Execution:**
1. Short Hyperliquid BTC YU (Yield Unit) on Boros
2. Short BTC on Hyperliquid
3. Long Binance BTC YU on Boros
4. Long BTC on Binance

**Result:** Fixed APR (5-11% historical), no funding rate volatility

**Historical performance (Boros study):**
- BTC: 5.98-11.4% Fixed APR
- Peak opportunities: 23-48% APR during divergence events
- Outperforms AAVE lending (2-4%) and ETH staking (3-5%) by 2-4x

---

## 3. Execution Considerations

### Capital Requirements
| Strategy | Capital Efficiency | Typical Margin |
|----------|-------------------|----------------|
| Cross-exchange funding | Low (2x margin) | 10-20x leverage each side |
| Cash-and-carry | Medium (1x spot + margin) | 5-10x short side |
| Boros fixed-yield | High (collateral for swaps) | Variable |

### Operational Complexity
1. **Multi-exchange monitoring** — need real-time funding data
2. **Margin management** — maintain healthy collateral on both legs
3. **Rebalancing** — when positions drift, need to rebalance
4. **Withdrawal/deposit timing** — cross-exchange capital movement

### Transaction Costs
- Trading fees: ~0.02-0.05% per side
- Withdrawal fees: Variable
- Slippage: Depends on size and liquidity
- Gas (for DeFi): Can be significant on mainnet

### Risk Factors
| Risk | Mitigation |
|------|------------|
| Funding rate flip | Use fixed-yield products (Boros) or tight stop-losses |
| Liquidation cascade | Lower leverage, wider margin buffers |
| Exchange risk | Diversify across venues, limit exposure per exchange |
| Smart contract risk (DeFi) | Audit status, insurance, position sizing |
| Whale manipulation | Avoid low-liquidity markets |

---

## 4. Practical Implementation for Hyperliquid

### Current Funding Data Sources
- Hyperliquid API: `https://api.hyperliquid.xyz/info` (funding rates)
- Binance: `GET /fapi/v1/fundingRate`
- Coinglass aggregator: Cross-exchange comparison

### Monitoring Setup
1. Poll funding rates every 15-30 min
2. Calculate annualized differential: `(rate_A - rate_B) * 365 * 3` (for 8h funding)
3. Alert when differential > 10% APR

### Position Sizing
- **Conservative:** 2-5% of portfolio per arb position
- **Moderate:** 5-10% with tighter monitoring
- **Aggressive:** >10% with active margin management

### Entry/Exit Criteria
**Enter when:**
- Funding differential > 10% APR (after fees)
- Both venues have sufficient liquidity (OI > $10M)
- No major news/events expected

**Exit when:**
- Differential compresses below 3% APR
- One leg approaching liquidation
- Market conditions become erratic

---

## 5. Hyperliquid-Specific Opportunities

### Why HL vs CEX Spreads Exist
1. **Hourly funding** (HL) vs 8-hour (Binance) — faster adjustment
2. **Different trader demographics** — more degen/retail on HL
3. **Liquidity differences** — some assets more liquid on HL
4. **Vault mechanics** — HLP vault impacts funding dynamics

### Assets to Watch
- **Majors (BTC, ETH):** Tightest spreads, most liquid, lower alpha
- **Mid-caps:** Better spreads, moderate liquidity
- **Long-tail:** Highest spreads but execution risk

### Current Edge
Based on Boros research (Dec 2025):
- BTC HL vs Binance: 5.98-11.4% Fixed APR consistently
- ETH: Similar range
- Other assets (BNB, HYPE): Higher but less liquid

---

## 6. Automation Requirements

### Minimum viable bot:
1. **Funding rate monitor** — poll all venues
2. **Spread calculator** — compute net APR after costs
3. **Position opener** — execute on both venues atomically (or near-atomically)
4. **Margin monitor** — alert when collateral drops
5. **Rebalancer** — adjust positions to maintain delta-neutrality

### Advanced features:
- Predictive funding rate modeling
- Dynamic position sizing based on volatility
- Cross-venue optimal routing
- Boros integration for fixed yields

---

## 7. Key Learnings

1. **Structural > Random** — These are persistent inefficiencies, not noise
2. **Fees matter** — 10% APR is nothing if you're paying 2% round-trip
3. **Liquidity is king** — Don't arb illiquid markets
4. **Fixed > Floating** — Consider Boros for yield certainty
5. **Institutional headwind** — Arbs are being compressed as institutions enter
6. **Execution is the moat** — Strategy is known, execution separates winners

---

## 8. Next Steps

- [ ] Build funding rate monitor for HL + Binance
- [ ] Backtest spreads over last 90 days
- [ ] Calculate realistic returns after all costs
- [ ] Consider Boros integration for fixed yields
- [ ] Set up alerts for >15% APR opportunities

---

## Sources

1. Pendle/Boros: "Cross-Exchange Funding Rate Arbitrage" (Dec 2025)
2. Amberdata: "Ultimate Guide to Funding Rate Arbitrage" (Mar 2024)
3. OKX Learn: "Funding Rate Arbitrage: Unlocking Market Inefficiencies" (Jul 2025)
4. ScienceDirect: "Risk and Return Profiles of Funding Rate Arbitrage" (Aug 2025)
5. arXiv: "Fundamentals of Perpetual Futures" (academic paper)
