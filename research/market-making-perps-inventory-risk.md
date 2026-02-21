# Market Making on Perpetual Futures: Inventory Risk & Volatility Behavior

**Research Date:** 2026-02-14
**Task:** [Learning] Market Making on Perps - Inventory Risk

---

## 1. Introduction to Market Making on Perps

Market making on perpetual futures involves continuously quoting bid and ask prices to capture the spread while managing the risk of accumulating unwanted inventory. Unlike spot market making, perps introduce additional complexities:

- **No expiration** — positions can be held indefinitely, but inventory risk persists
- **Funding rates** — hourly payments between longs/shorts affect carry costs
- **High leverage** — amplifies both profits and inventory risk
- **24/7 markets** — no session close to force inventory liquidation

### Key Concern: Inventory Risk

When a market maker's quotes get hit asymmetrically, they accumulate directional exposure. In a trending market, this can lead to significant losses if the MM is holding inventory against the trend.

---

## 2. The Avellaneda-Stoikov Model

The foundational academic framework for inventory-aware market making comes from Avellaneda & Stoikov (2008). Their key insight: **adjust quotes based on current inventory to encourage mean-reversion**.

### Core Formulas

**Reservation Price:**
```
r = s - q·γ·σ²·(T-t)
```

**Optimal Spread:**
```
δ = γ·σ²·(T-t) + (2/γ)·ln(1 + γ/κ)
```

Where:
- `s` = current mid-price
- `q` = inventory quantity (+ for long, - for short)
- `γ` = inventory risk aversion parameter
- `σ` = volatility
- `T-t` = time remaining in trading session
- `κ` = order book liquidity parameter

### Intuition

1. **Reservation price shifts with inventory:**
   - Positive inventory (long) → lower reservation price → encourages selling
   - Negative inventory (short) → higher reservation price → encourages buying
   
2. **Risk aversion (γ) controls aggression:**
   - Higher γ → more aggressive inventory management (wider quote shifts)
   - Lower γ → quotes stay closer to mid (more passive)

3. **Volatility widens spreads:**
   - Higher σ → wider optimal spreads to compensate for adverse selection

### Adaptation for 24/7 Crypto Markets

The original model assumes a fixed trading session (T-t → 0 forces liquidation). For perpetual markets:
- Use rolling time horizons (e.g., 4-hour windows)
- Or use the **infinite horizon model** where spreads don't depend on time
- Hummingbot implements configurable session durations

---

## 3. Practical Inventory Management Strategies

### 3.1 Delta Hedging

Maintain a balanced position so total portfolio delta ≈ 0:
- Accumulate long perp position → short equivalent spot (or vice versa)
- Used extensively by firms like Wintermute
- Isolates spread revenue from directional exposure

### 3.2 Position Limits & Liquidation

- Set hard inventory limits (e.g., max ±$100K notional)
- Auto-liquidate when limits breached (market orders if necessary)
- Accept slippage as cost of risk management

### 3.3 Skewing Quotes

Dynamically adjust bid/ask quantities:
- Long inventory → show larger ask size, smaller bid size
- Short inventory → show larger bid size, smaller ask size
- More subtle than moving prices, may be preferred in thin markets

### 3.4 Funding Rate Awareness

On Hyperliquid and other perp exchanges:
- **Positive funding** → longs pay shorts → unfavorable to hold long inventory
- **Negative funding** → shorts pay longs → unfavorable to hold short inventory
- Factor into inventory target (bias toward funded side)

### 3.5 Time-Based Cleanup

- If inventory exceeds threshold for X minutes, liquidate portion
- Prevents overnight/extended risk accumulation
- HFT on crypto often closes every 60 seconds (from Reddit discussion)

---

## 4. Market Maker Behavior During Volatility Events

### 4.1 The Withdrawal Pattern

During high volatility, market makers typically:

1. **Widen spreads** — compensate for increased adverse selection risk
2. **Reduce order sizes** — limit potential inventory accumulation
3. **Pull orders entirely** — "step back" when conditions exceed risk tolerance

This creates a **liquidity vacuum** that can trigger flash crashes.

### 4.2 Flash Crash Dynamics

**Typical sequence:**
1. Large directional order hits thin market
2. Stop-loss orders cascade (domino effect)
3. Market makers withdraw bids/offers
4. Price falls rapidly with no natural floor
5. Eventually buyers step in at depressed prices
6. Rapid rebound as liquidity returns

**Key stat:** 9 major flash crashes in last ~15 years, roughly annual occurrence.

### 4.3 "Hot Potato" Effect

During crisis moments:
- HFTs rapidly pass inventory between each other
- No one wants to hold risk
- Trading volume spikes while liquidity evaporates
- Prices can briefly become completely irrational

### 4.4 Why MMs Withdraw

1. **Inventory risk spikes** — volatility makes inventory dangerous
2. **Adverse selection** — informed traders hunting stops
3. **Latency arbitrage** — faster traders can exploit stale quotes
4. **Regulatory capital** — banks especially have strict VaR limits

### 4.5 Post-Crash Behavior

Market makers typically return quickly once:
- Volatility subsides
- Spreads can be widened sufficiently
- Inventory risk is manageable again

This creates **mean reversion opportunities** in the aftermath.

---

## 5. Volatility Risk in Perp Market Making

### 5.1 Gamma Risk

Market makers are typically "short gamma" — their P&L suffers from large moves in either direction. This is because:
- Inventory accumulated at one price becomes a loss at new prices
- The faster the move, the less time to adjust

### 5.2 Convexity in Inverse Perps

Inverse perpetuals (quoted in USD, settled in BTC) have non-linear P&L:
- Long positions liquidate faster on price drops
- Short positions liquidate slower on price rises
- Creates asymmetric risk profile

### 5.3 Auto-Deleveraging Risk

On many perp exchanges, during extreme moves:
- Profitable positions may be forcibly closed
- Socialized losses can hit winning traders
- Insurance funds may not cover all shortfalls

### 5.4 Practical Volatility Management

1. **Reduce position sizes during high vol regimes**
2. **Use wider spreads during volatility spikes**
3. **Implement circuit breakers** — pause quoting if realized vol exceeds threshold
4. **Monitor order book depth** — thin books = danger
5. **Track correlated assets** — cascade risk from other markets

---

## 6. Key Lessons for Our Trading

### For Market Making Strategies:
- Always implement inventory risk controls (A-S style or simpler)
- Never let inventory grow unbounded
- Wider spreads in volatile conditions, narrower when calm
- Consider funding rate direction in inventory targets

### For Directional Trading:
- Be aware of MM behavior — they amplify crashes
- Flash crash reversions can be profitable but risky
- Avoid tight stops in thin markets
- News/event windows have elevated risk

### For Risk Management:
- Position size matters more than being "right"
- Liquidity can vanish instantly
- Auto-deleveraging is a real risk on crypto exchanges
- Diversification across assets and time helps

---

## 7. Further Reading

1. **Avellaneda & Stoikov (2008)** - "High-frequency trading in a limit order book"
2. **Guéant, Lehalle & Fernandez-Tapia** - "Dealing with inventory risk"
3. **Hummingbot Documentation** - Practical A-S implementation
4. **CFTC Flash Crash Report (2010)** - Detailed crash analysis

---

## 8. Summary

Market making on perpetual futures requires balancing spread capture against inventory risk. The Avellaneda-Stoikov framework provides a principled approach: shift quotes away from accumulated inventory based on risk aversion and volatility.

During volatility events, MMs exhibit predictable behavior — widening spreads, reducing size, and eventually withdrawing. Understanding this pattern helps both for building MM strategies (know when to step back) and for trading around volatility (anticipate liquidity gaps and mean reversion).

**Core principle:** The market maker's job is to provide liquidity profitably, not to take directional bets. Inventory management is the key to survival.
