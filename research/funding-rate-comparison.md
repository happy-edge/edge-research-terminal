# Cross-Exchange Funding Rate Discrepancies

**Research Date:** 2026-02-13  
**Objective:** Compare funding rate formulas across Binance, Bybit, OKX, dYdX. Identify exploitable discrepancies for cross-exchange arb.

---

## Executive Summary

Funding rates are periodic payments between long/short holders on perpetual futures to anchor contract prices to spot. While the core mechanism is consistent, **formula nuances, intervals, and caps differ materially across exchanges** — creating arbitrage windows.

---

## Funding Rate Formula Components

All exchanges use two core components:

1. **Interest Rate (I):** Cost of capital / borrowing differential between base and quote currencies
2. **Premium Index (P):** Measures perp price deviation from spot index

**General Formula:**
```
Funding Rate = Premium Index + clamp(Interest Rate - Premium Index, -cap, +cap)
```

---

## Exchange-by-Exchange Breakdown

### Binance

**Interval:** 4-hour or 8-hour (varies by contract)  
**Settlement Times:** 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC (4h) or 00:00, 08:00, 16:00 UTC (8h)

**Formula:**
```
Funding Rate (F) = Premium Index (P) + clamp(Interest Rate (I) - P, -0.05%, +0.05%)
```

**Key Details:**
- Fixed interest rate: **0.03%** per 8 hours (0.01% per period for 4h)
- Premium calculated via Impact Bid/Ask prices
- **Capped rate** tied to Maintenance Margin Ratio for high-leverage contracts (30x+)
- Uses mark price at funding timestamp for payment calculation

**Cap:** Varies by contract — typically ±0.75% to ±3% depending on leverage tier

---

### Bybit

**Interval:** 8-hour  
**Settlement Times:** 00:00, 08:00, 16:00 UTC

**Formula:**
```
F = P + clamp(I - P, -0.05%, +0.05%)
```

Where:
- **P (Premium Index)** = [Max(0, Impact Bid - Index) - Max(0, Index - Impact Ask)] / Index
- **I (Interest Rate)** = 0.03% per 8 hours

**Key Details:**
- Calculated every minute, averaged over 8h window
- During **extreme volatility**, Bybit temporarily adjusts caps/floors to force convergence
- Pre-market listings use different calculation (bid/ask only, no spot reference)

**Cap:** Adjustable during volatility events

---

### OKX

**Interval:** 8-hour  
**Settlement Times:** 00:00, 08:00, 16:00 UTC

**Formula:**
```
F = clamp(Premium Index, -0.75%, +0.75%) + clamp(I - P, -0.05%, +0.05%)
```

**Key Details:**
- Interest Rate = 0.03% per 8h (same as Binance/Bybit)
- Premium uses TWAP of (Mid Price - Index) / Index over funding period
- **Two-layer clamping** — both premium and interest-premium spread are capped
- More aggressive convergence mechanism

**Cap:** ±0.75% for premium component

---

### dYdX (v4)

**Interval:** 1-hour (more frequent than CEXs)  
**Settlement:** Continuous/hourly

**Formula:**
```
Funding Rate = (Oracle Price - Mark Price) / Oracle Price × (1 / 8)
```

**Key Details:**
- No explicit interest rate component
- Uses oracle-derived index price (Pyth, etc.)
- Hourly funding = premium-only mechanism
- **1/8 factor** scales to approximate 8h equivalent
- Fully on-chain, transparent calculation
- No manual adjustment or circuit breakers

**Cap:** No explicit cap — relies on oracle + on-chain settlement

---

## Comparison Matrix

| Feature | Binance | Bybit | OKX | dYdX |
|---------|---------|-------|-----|------|
| **Interval** | 4h/8h | 8h | 8h | 1h |
| **Interest Rate** | 0.03%/8h | 0.03%/8h | 0.03%/8h | None |
| **Cap Mechanism** | MMR-based | Dynamic | Two-layer | None |
| **Premium Calc** | Impact Bid/Ask | Impact Bid/Ask | TWAP Mid | Oracle vs Mark |
| **Volatility Adjustment** | No | Yes | No | No |
| **Settlement** | Discrete | Discrete | Discrete | Continuous |

---

## Exploitable Discrepancies

### 1. **Interval Arbitrage (dYdX vs CEXs)**

dYdX settles hourly while CEXs settle every 8 hours. During trending markets:
- CEX funding accumulates over 8h → visible large rate
- dYdX rate adjusts faster → smaller per-period payments

**Strategy:** When CEX shows extreme funding rate building, the dYdX rate may not yet reflect full premium. Arb by taking opposite positions.

### 2. **Cap Discrepancy Arbitrage**

When market stress causes rates to hit caps:
- Binance caps based on maintenance margin (can be high for alts)
- OKX has tighter ±0.75% premium cap
- dYdX has no cap

**Strategy:** During extreme funding, identify where one exchange caps and another doesn't. Position on capped exchange (lower cost) vs uncapped.

### 3. **Volatility Adjustment Windows (Bybit)**

Bybit uniquely adjusts caps during volatility events. When Bybit widens/tightens:
- Other exchanges remain static
- Creates temporary funding differential

**Strategy:** Monitor Bybit announcements for cap adjustments. Fast execution during transition windows.

### 4. **TWAP vs Snapshot Timing (OKX vs Binance)**

- OKX uses TWAP over funding period
- Binance uses snapshot at settlement

**Strategy:** If you can predict settlement-time price vs period-average, position accordingly.

### 5. **Funding Rate Lag on CEXs**

CEXs publish "predicted" funding rate that updates throughout the period. During rapid moves:
- Predicted rate lags actual premium
- dYdX rate is more real-time

**Strategy:** When spot price moves sharply near CEX funding timestamp, the settled rate often overshoots/undershoots the predicted. Position on dYdX to hedge the mismatch.

---

## Practical Considerations

### Execution Costs
- CEX fees: ~0.02-0.04% taker
- dYdX fees: ~0.02-0.05%
- Slippage on less liquid pairs
- **Break-even:** Need ~0.1%+ funding differential after fees

### Capital Efficiency
- CEXs allow cross-margin
- dYdX requires separate collateral
- Factor margin requirements into ROI

### Risk Management
- Oracle manipulation on dYdX (historical exploits)
- CEX counterparty risk
- Funding rate can flip sign mid-period

---

## Tools for Monitoring

- **CoinGlass** (coinglass.com/FundingRate) — aggregated rates
- **CoinAnk** (coinank.com/fundingRate) — historical + comparison
- **ArbitrageScanner** (arbitragescanner.io/funding-rates) — cross-exchange view
- **Individual exchange APIs** for real-time rates

---

## Conclusions

1. **Best arb opportunity:** dYdX hourly vs CEX 8-hour during trending markets
2. **Highest complexity:** OKX two-layer caps vs others during stress
3. **Lowest friction:** Binance-Bybit pair trades (similar formulas, different caps)
4. **Key edge:** Speed of reaction to Bybit volatility adjustments

Funding rate arb is **real but thin-margin**. Best suited for:
- Automated systems with low-latency execution
- Large capital to absorb fee drag
- Continuous monitoring of rate divergences

---

*Research compiled from exchange documentation, CubeExchange guide, BitDegree, and market data aggregators.*
