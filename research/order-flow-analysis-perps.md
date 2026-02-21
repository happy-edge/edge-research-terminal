# Order Flow Analysis for Perps Trading

*Research compiled: 2026-02-14*

---

## Core Concepts

### What is Order Flow?
Order flow is the raw transaction data showing **who is executing market orders** (aggressive) vs **who is providing liquidity** (passive). It reveals the battle between buyers and sellers at a granular level.

- **Market orders** = aggressive (take liquidity, cross the spread)
- **Limit orders** = passive (provide liquidity, rest in the book)

### Why Order Flow Matters for Perps
Perp markets attract more aggressive/leveraged speculators than spot. Understanding order flow helps:
- Identify when aggressive traders are getting trapped
- Spot divergences between intent and price action
- Find absorption patterns at key levels
- Time entries around liquidation cascades

---

## Cumulative Volume Delta (CVD)

### Formula
```
CVD = Σ (Buy Volume - Sell Volume)
```

Where:
- **Buy Volume** = orders executed at the ask (buyers lifting offers)
- **Sell Volume** = orders executed at the bid (sellers hitting bids)

### Interpretation
| CVD Movement | Meaning |
|--------------|---------|
| Rising CVD | Net buying pressure, buyers aggressive |
| Falling CVD | Net selling pressure, sellers aggressive |
| Flat CVD + Rising Price | Weak rally, lacking conviction |
| Flat CVD + Falling Price | Weak selloff, may bounce |

### Key Setups

#### 1. CVD Divergences (Most Important)
**Bearish Divergence:**
- Price makes **higher high**
- CVD makes **lower high**
- Interpretation: Aggressive buyers losing steam, potential reversal

**Bullish Divergence:**
- Price makes **lower low**
- CVD makes **higher low**
- Interpretation: Aggressive sellers being absorbed, potential reversal

#### 2. Spot vs Perp CVD Divergence
Critical insight from CryptoCred:
> "Perps attract more aggressive positioning and sloppy execution on average"

- Perp CVD aggressive + Spot CVD flat/opposite = potential reversal
- Perp longs ramping into resistance, no spot follow-through = bearish
- Perp shorts piling in at support, spot not selling = bullish

#### 3. Confirmation Patterns
- Breakout + Rising CVD = legitimate move with conviction
- Breakout + Flat/Falling CVD = likely fakeout
- Reversal + CVD already turning before price = strong confirmation

---

## Delta & Volume Delta

### Per-Bar Delta
Delta for each candle/bar = Buy Volume - Sell Volume

- **Positive delta** = more aggressive buying
- **Negative delta** = more aggressive selling

### Filtering by Size
Use minimum volume filters to focus on larger/institutional orders:
- Filter for trades >X contracts to see "whale" activity
- Small trades = noise; large trades = signal

---

## Absorption Patterns

### What is Absorption?
When **passive orders absorb aggressive orders** without price moving proportionally.

### Signs of Absorption
1. **High delta, low price movement** - Lots of buying but price not moving up = sellers absorbing
2. **CVD divergence at key levels** - Price tests support/resistance repeatedly, CVD shows opposite pressure
3. **Volume spikes without follow-through** - Burst of activity but price stalls

### Practical Examples
- Price at resistance, positive delta, price doesn't break = sellers absorbing
- Price at support, negative delta, price doesn't break = buyers absorbing
- Large CVD spike with minimal price impact = absorption happening

### Trading Absorption
- Wait for absorption to complete (divergence forms)
- Enter on reversal confirmation (structure break, candle pattern)
- Stop beyond the absorbed level

---

## Reading the Tape (Time & Sales)

### Key Elements
1. **Trade size** - Large prints vs retail noise
2. **Trade direction** - At bid (sell) vs at ask (buy)
3. **Velocity** - Bursts of activity vs steady flow
4. **Clustering** - Multiple large trades at same level

### What to Watch For
- **Iceberg activity** - Repeated fills at same price (hidden liquidity)
- **Sweeps** - Large aggressive orders clearing multiple levels
- **Stacking** - Consistent buying/selling over time without price movement (accumulation/distribution)

### Perp-Specific Tape Reading
- Watch for **liquidation cascades** - Rapid, clustered market orders
- Note **funding rate context** - High funding + aggressive positioning = potential squeeze setup
- Cross-reference with **OI changes** - New positions vs closing positions

---

## Open Interest + CVD Integration

### Combining Signals
| Price | OI | CVD | Interpretation |
|-------|-----|-----|----------------|
| ↑ | ↑ | ↑ | Longs aggressive, new positions, strong trend |
| ↓ | ↑ | ↓ | Shorts aggressive, new positions, strong trend |
| ↑ | ↓ | ↑ | Shorts closing (covering), weak rally |
| ↓ | ↓ | ↓ | Longs closing (liquidating), weak dump |
| ↑ | ↑ | ↓ | Divergence! Longs adding but sellers absorbing |
| ↓ | ↑ | ↑ | Divergence! Shorts adding but buyers absorbing |

### Key Insight
> "For every buyer there is a seller - OI is always 50% longs and 50% shorts. The question is: who is *aggressive*?"

---

## Funding Rate Context

### Funding + CVD Combinations
- **High positive funding + Rising CVD** = Longs very aggressive (crowded)
- **High positive funding + Falling CVD** = Longs aggressive but being absorbed
- **Negative funding + Falling CVD** = Shorts aggressive
- **Negative funding + Rising CVD** = Shorts aggressive but being absorbed

### Warning: Don't Trust Funding Alone
From CryptoCred:
> "Funding alone does not make for a compelling squeeze. You need a credible case that aggressors are offside."

Post-dump negative funding often just reflects perps getting hit harder than spot (leverage), not new shorts.

---

## Practical Setups

### 1. Absorption Reversal at Key Level
- Price approaches S/R with aggressive CVD in trend direction
- CVD makes new extreme but price doesn't follow proportionally
- CVD divergence forms (higher low at support / lower high at resistance)
- Enter on structure break, stop beyond level

### 2. Failed Breakout
- Price breaks key level, OI increases
- CVD doesn't confirm (flat or diverging)
- Price stalls/reverses quickly
- Fade the breakout, stop above/below recent extreme

### 3. Liquidation Cascade Entry
- Sharp move triggers liquidations (OI drops rapidly)
- Price becomes dislocated (extended from fair value)
- CVD shows exhaustion (extreme reading then divergence)
- Fade into the liquidation area, tight stop

### 4. Spot/Perp Divergence
- Perps aggressive in one direction
- Spot not following or even opposite
- High conviction reversal setup if at key level

---

## Tools for Order Flow Analysis

### Free/Basic
- **TradingView CVD** - Built-in indicator, works on futures pairs
- **Coinglass** - Aggregated OI, CVD, liquidations
- **Coinalyze** - Exchange-specific CVD, OI delta

### Professional
- **Bookmap** - Heatmap + CVD + depth visualization
- **ATAS** - Footprint charts, advanced CVD filtering
- **Exocharts** - Crypto-specific order flow tools
- **Velodata** - OI, CVD, funding aggregation

---

## Key Takeaways

1. **CVD divergences are the money signal** - When aggressive participation doesn't move price proportionally, something's absorbing it.

2. **Spot vs Perp CVD is underrated** - Perps = tourists, Spot = often smarter money. Watch for divergences.

3. **Context is everything** - CVD at random levels = noise. CVD at key S/R with confluence = signal.

4. **Don't trade indicators, trade reactions** - The indicator tells you WHO is aggressive. Price reaction tells you if they're RIGHT.

5. **Perps amplify everything** - Liquidations, leverage, and cascades make order flow signals more extreme in perps.

---

## References
- CryptoCred: "Comprehensive Guide to Crypto Futures Indicators"
- Bookmap: "How CVD Can Transform Your Trading Strategy"
- CoinPerps: "What is CVD in Crypto Trading"
- Phemex Academy: "Guide to Cumulative Volume Delta"
