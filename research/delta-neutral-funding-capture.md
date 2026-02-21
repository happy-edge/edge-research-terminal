# Delta-Neutral Funding Capture During Volatility Spikes

**Research Date:** 2026-02-14
**Status:** Complete

## Overview

Delta-neutral funding arbitrage captures funding payments while eliminating directional price exposure. The strategy becomes particularly attractive during volatility spikes when funding rates can reach extreme levels (up to 4%/hour on Hyperliquid).

## Core Mechanics

### Basic Setup
1. **Long spot** - Buy underlying asset (e.g., 1 BTC @ $50,000)
2. **Short perp** - Short equivalent notional in perpetuals (1 BTC short @ $50,000)
3. **Net delta = 0** - Price movements cancel out
4. **Profit = funding payments** - Collect positive funding when shorts pay longs

### Funding Rate Basics
- **Positive funding** → Longs pay shorts → Profit when short perp
- **Negative funding** → Shorts pay longs → Profit when long perp (but borrowing costs eat edge)
- **Ideal regime:** Bullish market with positive funding (short perp, long spot)

## Hyperliquid-Specific Mechanics

### Key Parameters
- **Funding interval:** Hourly (vs 8h on Binance/CEXes)
- **Funding cap:** 4% per hour (much higher than CEX caps)
- **Interest rate component:** 0.00125% per hour (11.6% APR, paid to shorts)
- **Premium sampled:** Every 5 seconds, averaged over the hour

### Formula
```
Funding Rate = Average Premium Index + clamp(interest_rate - premium, -0.0005, 0.0005)
Funding Payment = position_size × oracle_price × funding_rate
```

### Why HL is Attractive for This Strategy
1. **Higher caps** - Can capture extreme funding during cascades
2. **Hourly settlement** - More granular, faster compounding
3. **Impact price calculation** - Uses liquidity-aware pricing
4. **Peer-to-peer** - No exchange fee on funding

## Entry Timing During Volatility Spikes

### When to Enter
1. **Funding spike detection** - Watch for funding > 0.1%/hour (87% APR equivalent)
2. **Liquidation cascades** - Mass liquidations create imbalanced markets
3. **Spread widening** - Use Bollinger Bands on basis for entry timing
4. **One-sided positioning** - Check open interest imbalance

### Optimal Entry Signals
- Funding rate spikes 5-10x above baseline
- Open interest heavily skewed (e.g., 70%+ long)
- Recent liquidation cascade on one side
- Basis (perp-spot) at Bollinger Band extremes

### Exit Signals
- Funding normalizes (below target APR threshold)
- Basis converges
- Position becomes unprofitable after fees

## Execution Risks

### 1. Liquidation Risk on Short Leg
- Even 1x leverage can face margin calls if price spikes
- **Mitigation:** Use cross margin, maintain buffer, set alerts

### 2. Basis Risk
- Spot and perp prices can diverge temporarily
- **Mitigation:** Monitor basis, be prepared for short-term MTM losses

### 3. Funding Rate Reversal
- High positive funding can flip negative during crashes
- **Mitigation:** Size appropriately, set stop-loss on funding APR

### 4. Execution Slippage
- Entering/exiting both legs simultaneously is crucial
- **Mitigation:** Use VWAP for size, avoid illiquid pairs

### 5. Platform/Depeg Risk
- Stablecoin depeg affects settlement
- **Mitigation:** Monitor USDC/USDT health, diversify

## Capital Efficiency

### Position Sizing
```
Required capital = Spot position + Perp margin + Buffer

Example (1 BTC @ $50,000):
- Spot: $50,000 (100%)
- Perp margin (5x): $10,000 (20%)
- Buffer for drawdown: $5,000 (10%)
- Total: $65,000 for 1 BTC notional
```

### Return Calculation
```
Example: 1 BTC position, 0.05% hourly funding (very high)
- Hourly income: $50,000 × 0.0005 = $25
- Daily income: $25 × 24 = $600
- On $65,000 capital: ~0.9% daily, ~27% monthly

Reality check: Funding this high rarely persists. 
Average scenario (0.01% hourly): ~5% monthly return
```

### Leverage Considerations
- **Spot leg:** No leverage (own the asset)
- **Perp leg:** Can use 1-5x leverage
- Higher leverage = better capital efficiency but higher liquidation risk
- **Recommendation:** 2-3x on perp leg with ample buffer

## Practical Execution Flow

### Pre-Entry Checklist
- [ ] Funding rate > target APR threshold
- [ ] Open interest skew confirms one-sided market
- [ ] Basis at favorable entry point
- [ ] Sufficient capital for both legs + buffer
- [ ] Understand liquidation price on perp

### Entry Sequence
1. Check current funding rate and predicted next rate
2. Calculate position size based on capital
3. Place spot buy order
4. Immediately short equivalent perp notional
5. Verify net delta ≈ 0

### Monitoring
- Track funding payments (hourly on HL)
- Monitor basis for exit signals
- Watch for margin health on perp leg
- Set alerts for funding rate normalization

### Exit Sequence
1. Close perp short (market or limit)
2. Sell spot position
3. Calculate total PnL (funding earned - fees - any basis loss)

## Cross-Exchange Considerations

### Perp-Perp Arbitrage (Alternative)
- Short high-funding perp, long low-funding perp
- More leverage available (no spot leg)
- Funding interval normalization required
- Fee structure differences matter

### HL vs Binance Differences
| Parameter | Hyperliquid | Binance |
|-----------|-------------|---------|
| Funding interval | 1 hour | 8 hours |
| Funding cap | 4%/hour | Varies by asset |
| Oracle | Validator median | Weighted CEX average |
| Premium calc | Impact price-based | Simple mark vs index |

### Normalization Required
- Adjust 8h rates to hourly for comparison
- Account for fee differences
- Consider accrued interest on longer intervals

## Risk Management Framework

### Position Limits
- Max 20% of trading capital per position
- Diversify across 3-5 assets if possible
- Never all-in on single funding opportunity

### Stop Conditions
1. Funding APR drops below 20% threshold
2. Unrealized loss > 2% of position
3. Liquidation price within 20% of current price
4. Platform issues or unusual behavior

### Emergency Procedures
- Priority: Close perp leg first (reduce risk)
- Secondary: Sell spot
- Accept slippage over liquidation

## Key Takeaways

1. **Best during volatility** - Strategy thrives when markets are one-sided
2. **Hourly HL advantage** - More granular than 8h CEX funding
3. **Not risk-free** - Basis risk, liquidation risk, funding reversal all exist
4. **Capital intensive** - Need spot + margin + buffer
5. **Timing matters** - Entry during funding spikes, exit when normalized
6. **Monitor constantly** - Hourly funding means hourly attention needed (or automation)

## Future Research

- [ ] Backtest historical funding rate patterns on HL
- [ ] Build automated monitoring for funding spikes
- [ ] Analyze correlation between OI skew and funding persistence
- [ ] Compare HL vs CEX basis during major volatility events

---

*Sources: Hyperliquid Docs, BSIC Research, Flipster, various DeFi community discussions*
