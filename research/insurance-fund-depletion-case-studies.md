# Insurance Fund Depletion Events — Historical Case Studies

*Research compiled: February 13, 2026*

---

## Executive Summary

Insurance funds are the last line of defense before Auto-Deleveraging (ADL) kicks in on derivatives exchanges. When they're insufficient, profitable traders get forcibly closed out to cover the losses of liquidated positions. This research examines four major stress events where insurance funds were tested or depleted.

**Key Finding:** The common thread across all events is that insurance funds are structurally inadequate for extreme tail events. They work for normal volatility but fail catastrophically when:
1. Leverage is concentrated in one direction (87%+ longs in Oct 2025)
2. Illiquid assets are used for large positions (JELLY, altcoins)
3. Secret exemptions exist for favored parties (Alameda, Binance VIPs)
4. Cross-venue arbitrage fails (exchange outages, withdrawal freezes)

---

## Case Study 1: BitMEX "Black Thursday" — March 12-13, 2020

### What Happened
- Bitcoin dropped 60% in hours during COVID panic
- $1.67B liquidated across two days on BitMEX alone
- BitMEX's 35,000 BTC ($205M) insurance fund was "barely used"
- Exchange went offline for ~30 minutes during peak volatility

### Insurance Fund Mechanics
- **Primary purpose:** Prevent ADL by absorbing losses when liquidated positions can't be closed profitably
- **Controversy:** Users questioned why the fund wasn't used to backstop losses
- **BitMEX's defense:** "The fund's purpose is to prevent ADL, not to subsidize traders"

### ADL Triggers
- ADL was NOT widely activated despite massive liquidations
- The exchange going offline actually *prevented* the cascade from fully playing out
- Many users suspected the outage was intentional to save the insurance fund

### Key Lesson
**Exchange downtime can be a hidden circuit breaker.** BitMEX's "DDoS" may have prevented insurance fund depletion by halting the doom loop. The question of when exchanges should intervene vs. let markets clear remains unresolved.

---

## Case Study 2: FTX Collapse — November 2022

### What Happened
- Not a traditional insurance fund depletion — but a fundamental breach of the model
- Alameda Research had a **secret exemption** from FTX's auto-liquidation protocol
- This allowed Alameda to maintain underwater positions that would have been liquidated for any other trader
- When revealed, it triggered a bank run and collapse

### The Secret Exemption Problem
From bankruptcy filings (John Ray III, Nov 17, 2022):
> "The secret exemption of Alameda from certain aspects of FTX.com's auto-liquidation protocol"

This meant:
- Alameda could hold leveraged positions without liquidation risk
- Other traders unknowingly faced ADL risk from Alameda's hidden losses
- The insurance fund was meaningless when the biggest counterparty was exempt

### Systemic Implications
- **$10B+ in client funds lost** (CFTC estimate)
- Alameda was the backstop for FTX's liquidation engine — a massive conflict of interest
- The insurance fund becomes theater when favored parties bypass the rules

### Key Lesson
**Secret exemptions corrupt the entire system.** If anyone is exempt from liquidation, the insurance fund calculation is wrong, and non-exempt traders bear hidden risk. This is reportedly still happening at Binance with "no-ADL agreements" for large market makers.

---

## Case Study 3: Hyperliquid JELLY Exploit — March 26, 2025

### What Happened
1. Attacker deposited $7.17M across 3 Hyperliquid accounts
2. Opened offsetting positions: $4.1M short + two longs totaling ~$4M on JELLY (market cap ~$25M)
3. Pumped JELLY price 429% on external exchanges
4. Short position was too large to liquidate normally → inherited by HLP (Hyperliquid's insurance vault)
5. HLP faced $10.5M floating loss with $230M total funds at risk if JELLY hit $0.15374

### Exchange Response (Controversial)
- Validators voted to **delist JELLY and settle at $0.0095** (the attacker's entry, not market price of $0.50)
- This revealed centralized control despite "decentralized" claims
- Attacker withdrew $6.26M before freeze; ~$900K remains locked
- Attacker's net result: -$4K to -$1M depending on whether remaining funds are returned

### Why It Almost Worked
- **Illiquid asset:** $4.1M short on a $25M market cap token = 16% of entire market
- **Inheritance rules:** HLP automatically takes over positions too large to liquidate
- **Oracle dependency:** Price pumped on external venues, forcing HLP to mark losses

### Key Lesson
**Position limits on illiquid assets are critical.** Allowing $4.1M positions on a $25M market cap token is insane. The insurance fund (HLP) was structurally incapable of hedging out of such a position without moving the market against itself.

---

## Case Study 4: October 10-11, 2025 — The $19B Flash Crash

### What Happened
- US tariff announcement triggered the largest liquidation cascade in crypto history
- **$19.3B liquidated** across all venues in 24 hours
- **1.62M accounts** liquidated
- **87% were longs** — extreme one-sided positioning

### Exchange-Level Breakdown
| Exchange | Liquidations | Notes |
|----------|-------------|-------|
| Hyperliquid | $10.3B | First ADL in 2+ years |
| Bybit | $4.65B | |
| Binance | $2.41B | Used $188M from insurance fund |
| OKX | Various | ADL activated |

### ADL Cascade Mechanics
1. Price drops → margin calls
2. Liquidation engines sell into thin books
3. Market makers withdraw (no bids)
4. More liquidations, prices gap down
5. Insurance fund depleted → ADL kicks in
6. Profitable shorts forcibly closed → removes buy pressure (short covers)
7. Recovery slows because shorts who would have covered are already closed

### Exchange Failures
- **Binance:** API failures, frozen accounts, execution delays
- **Coinbase/Robinhood:** Trading halts
- **Price divergence:** BTC spread 5-10% across exchanges
- **Oracle misfires:** Ethena USDe depegged to $0.62 on Binance

### Key Lesson
**ADL is a last resort that makes things worse before better.** By closing shorts (who would otherwise be buyers when covering), ADL removes natural buying pressure. The system survives but recovery is slower and winners are punished.

---

## How to Position Around Insurance Fund Stress

### Pre-Stress Indicators
1. **Funding rates:** Extreme positive funding = crowded longs
2. **Open interest vs insurance fund ratio:** If OI >> insurance fund, ADL risk is high
3. **Leverage distribution:** High average leverage = more liquidations per % move
4. **Market maker activity:** Reduced MM depth = thin books, gap risk

### During Stress
- **Reduce exposure before ADL hits:** Once ADL activates, even winning positions can be closed
- **Watch for exchange-specific issues:** If one venue is lagging, arbitrage breaks down
- **Don't assume insurance fund will save you:** It's sized for normal conditions, not tail events

### Positioning Strategies
1. **Short vol into crowded positioning:** When everyone is long and levered, the asymmetry favors shorts
2. **Avoid being the biggest winner:** ADL targets the most profitable positions first
3. **Diversify across venues:** Single-venue concentration = single-point-of-failure
4. **Keep dry powder off-exchange:** Can't buy the dip if your funds are locked in a frozen exchange

### Post-Stress Opportunities
- **Hyperliquid lost 50% of open interest** after Oct 2025 — capital flight creates opportunities
- **Funding resets:** After mass liquidations, funding often flips, creating carry trades
- **Mispricings persist:** Cross-venue spreads can take hours to normalize

---

## Structural Issues That Remain Unsolved

### 1. Secret Exemptions
- Binance reportedly exempts large market makers from ADL
- This creates hidden risk for retail traders
- No transparency on who is exempt

### 2. Oracle Manipulation
- Price feeds from illiquid venues can trigger liquidations
- Index prices can diverge from "real" market prices
- DeFi protocols especially vulnerable

### 3. Cross-Venue Fragmentation
- When one exchange freezes, arbitrage breaks
- Prices diverge, creating unfair liquidations
- No coordinated circuit breakers

### 4. Insurance Fund Sizing
- Insurance funds are sized for expected losses, not tail events
- "Expected" is based on historical data that excludes the next black swan
- The fund that "barely gets used" is probably too small

---

## Conclusion

Insurance fund depletion events reveal the true risk profile of leveraged crypto trading:

1. **The fund is not your friend:** It protects the exchange, not you
2. **ADL punishes winners:** Being right but too profitable can get you closed out
3. **Transparency varies wildly:** Some venues are honest about mechanics; others hide exemptions
4. **Tail risk is mispriced:** The next event will be "unprecedented" until it isn't

The best defense is position sizing that assumes the insurance fund doesn't exist. If you'd survive ADL closing half your position at the worst possible time, you're sized correctly.

---

## Sources
- BitMEX blog (March 2020)
- CoinDesk (FTX bankruptcy filings)
- Halborn Security (Hyperliquid JELLY postmortem)
- Cointelegraph (multiple)
- Arkham Intelligence (JELLY analysis)
- Solidus Labs ($20B crash analysis)
- Insights4VC (Oct 2025 crash timeline)
- Blockhead (Liquidation Alchemy series)
- CoinGlass liquidation data
