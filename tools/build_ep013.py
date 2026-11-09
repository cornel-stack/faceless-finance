#!/usr/bin/env python3
"""EP013 — "The 1973 Crash Nobody Remembers (and Why It Looks Like 2026)".
15-min, Casual Finance style, LOTS of verified evidence, spun up with timelines,
two-line overlay charts, annotated charts and arrow/flow diagrams."""
import json, pathlib

S = []

def ch(id, narr, pose="stand", props=None, bubble=None, caption=None, expr=None, variant=None):
    d = {"id": id, "type": "character", "narration": narr, "pose": pose}
    if expr: d["expression"] = expr
    if variant: d["variant"] = variant
    if bubble: d["bubble"] = bubble
    if props: d["props"] = [{"name": n, "label": l} for n, l in props]
    if caption: d["caption"] = caption
    S.append(d)

def callout(id, narr, text, sub=None, icon=None, brk=False):
    d = {"id": id, "type": "callout", "narration": narr, "text": text}
    if sub: d["sub"] = sub
    if icon: d["icon"] = icon
    if brk: d["break"] = True
    S.append(d)

def title(id, narr, heading, kicker=None, sub=None):
    d = {"id": id, "type": "title", "narration": narr, "heading": heading}
    if kicker: d["kicker"] = kicker
    if sub: d["sub"] = sub
    S.append(d)

def doodle(id, narr, items, labels=None, flow=False, caption=None):
    d = {"id": id, "type": "doodle", "narration": narr, "items": items}
    if labels: d["labels"] = labels
    if flow: d["flow"] = True
    if caption: d["caption"] = caption
    S.append(d)

def compare(id, narr, lt, lv, rt, rv, licon=None, ricon=None):
    l = {"title": lt, "value": lv}; r = {"title": rt, "value": rv}
    if licon: l["icon"] = licon
    if ricon: r["icon"] = ricon
    S.append({"id": id, "type": "compare", "narration": narr, "left": l, "right": r})

def chart(id, narr, title, data, unit=None, highlight=None, ctype="line", note=None, noteAt=None, notes=None, series2=None, seriesLabels=None):
    d = {"id": id, "type": "chart", "narration": narr, "chartType": ctype, "title": title,
         "data": [{"label": a, "value": b} for a, b in data]}
    if unit: d["unit"] = unit
    if highlight is not None: d["highlight"] = highlight
    if note: d["note"] = note
    if noteAt is not None: d["noteAt"] = noteAt
    if notes: d["notes"] = notes
    if series2: d["series2"] = [{"label": a, "value": b} for a, b in series2]
    if seriesLabels: d["seriesLabels"] = seriesLabels
    S.append(d)

def shot(id, narr, sourceId, caption=None):
    d = {"id": id, "type": "screenshot", "narration": narr, "sourceId": sourceId}
    if caption: d["caption"] = caption
    S.append(d)

def timeline(id, narr, title, events, highlight=None):
    d = {"id": id, "type": "timeline", "narration": narr, "title": title,
         "events": [{"year": y, "label": l, "icon": ic} for y, l, ic in events]}
    if highlight is not None: d["highlight"] = highlight
    S.append(d)

# ============================ COLD OPEN ============================
ch("s1", "You remember the famous ones. 1929. The dot-com bust. 2008. The crashes that got documentaries and movies.", pose="present",
   props=[("newspaper", "1929"), ("ticker", "dot-com"), ("chartdown", "2008")])
ch("s2", "But there's one enormous crash that almost nobody talks about anymore — and it might be the most important one for right now.", pose="explain",
   props=[("calendar", "a forgotten crash"), ("warning", "…the big one")])
ch("s2b", "If you've ever been told to just buy stocks and hold for the long run, and you'll always come out ahead — this is the giant asterisk on that advice.", pose="explain",
   props=[("chartup", "'just hold long-term'"), ("warning", "…*read the fine print")])
callout("s3", "In 1973 and '74, the U.S. stock market lost nearly half of its entire value.",
        "–48%", sub="the S&P 500, 1973–1974", icon="chartdown")
ch("s4", "Nearly half the market, just gone. And yet that isn't even the scary part.", pose="surprised", expr="surprised",
   props=[("ticker", "half the market…"), ("warning", "…gone")])
callout("s5", "Here's the scary part. In real, inflation-adjusted terms, it took about twenty years to recover.",
        "~20 years", sub="to get your money back — in real terms", icon="clock")
ch("s6", "A dollar invested at the 1973 top didn't fully recover its buying power until the 1990s. That's an entire investing lifetime, erased.", pose="explain",
   props=[("coins", "$1 in 1973"), ("clock", "…whole again in the 1990s")])
ch("s6b", "We're taught crashes are loud — a chaotic trading floor, a red screen, a panicked headline. 1973 was the exact opposite.", pose="explain",
   props=[("ticker", "we expect loud"), ("newspaper", "…a panic")])
ch("s6c", "It was so slow and so quiet that most people didn't even realize they were living through one of the worst bear markets in history.", pose="explain",
   props=[("clock", "slow & quiet"), ("chartdown", "…worst in history")])
ch("s7", "So two questions. Why does nobody remember this one? And why does 2026 look so eerily like 1973?", pose="think",
   bubble="Why does 2026 look like 1973?", props=[("calendar", "1973"), ("gauge", "…2026?")])
ch("s8", "Because this isn't a history lesson. It's a mirror. Four things that broke the market in 1973 are all back, right now.", pose="point",
   props=[("bubble", "a mirror"), ("warning", "…four rhymes")])
title("s9", "So let's put the two eras side by side, and follow the money all the way down.", "The 1973 Crash Nobody Remembers", kicker="…and why it looks like 2026", sub="History doesn't repeat. It rhymes.")
timeline("s10", "First, how 1973 actually came apart — step by step.", "How 1973 came apart",
         [("1971", "Nixon ends the gold standard", "capitol"), ("1972", "the Nifty Fifty peak", "bubble"),
          ("Oct '73", "OPEC oil embargo", "gaspump"), ("1974", "market bottoms, −48%", "chartdown")], highlight=3)

# ============================ RHYME 1 — GLAMOUR STOCKS ============================
ch("s11", "Rhyme one: the glamour stocks. In the early seventies, investors crowded into a handful of 'can't-lose' companies.", pose="present",
   bubble="Rhyme 1: glamour stocks.", props=[("bubble", "can't-lose stocks"), ("crowd", "everyone piled in")])
ch("s12", "They were called the Nifty Fifty. 'One-decision stocks' — you decide once to buy, and you simply never sell.", pose="explain",
   props=[("ticker", "the Nifty Fifty"), ("coins", "buy & never sell")])
ch("s13", "The quality felt so obvious that the price was treated as irrelevant. Pay anything — they'll always go up.", pose="explain",
   props=[("gauge", "price? irrelevant"), ("chartup", "…they only go up")])
shot("s14", "And these really were great companies — it's all documented. The mistake was believing no price was ever too high.", "wiki-nifty")
callout("s15", "At the peak, the Nifty Fifty traded at forty-two times earnings — more than double the rest of the market.",
        "42× earnings", sub="vs ~19× for the S&P 500", icon="gauge")
ch("s16", "Polaroid alone traded at ninety-one times earnings. For a camera company. The business was real; the price was fantasy.", pose="explain",
   props=[("officetower", "Polaroid"), ("gauge", "91× earnings"), ("bubble", "…fantasy price")])
ch("s17", "Then gravity showed up. From their highs, Polaroid fell ninety-one percent. Avon, eighty-six. Xerox, seventy-one.", pose="surprised", expr="surprised",
   props=[("chartdown", "Polaroid −91%"), ("chartdown", "Avon −86%"), ("chartdown", "Xerox −71%")])
compare("s18", "Now swap the names and keep the setup. Does this look familiar?",
        "1972 · Nifty Fifty", "~42× P/E", "2026 · Magnificent 7", "~45× P/E", licon="bubble", ricon="bubble")
shot("s19", "Because today, seven companies make up around a third of the entire S&P 500 — a concentration we haven't seen since… you guessed it.", "fred-sp500")
ch("s20", "And to be clear: the Magnificent Seven are phenomenal businesses. So were the Nifty Fifty. That was never the question.", pose="explain",
   props=[("officetower", "Mag 7: real giants"), ("bubble", "…but the same bet")])

ch("s20b", "Sound crazy? It's the exact logic you hear today. 'Just buy the best companies and hold forever — valuation doesn't matter.'", pose="explain",
   props=[("crowd", "'just buy & hold'"), ("gauge", "…'price doesn't matter'")])
ch("s20c", "To translate forty-two times earnings: you were paying forty-two dollars for every one dollar the company made in a year.", pose="explain",
   props=[("coins", "$42 paid"), ("ticker", "…for $1 earned")])
ch("s20d", "At that price, the business has to grow flawlessly for years just for you to break even. One stumble, and the stock craters.", pose="explain",
   props=[("chartup", "flawless growth needed"), ("chartdown", "…one stumble = crash")])
ch("s20e", "And here's the gut-punch: many of those companies kept growing just fine. The businesses were healthy. The stocks still got cut in half.", pose="surprised", expr="surprised",
   props=[("officetower", "business grew"), ("chartdown", "…stock still halved")])
ch("s20f", "When a handful of names carry the whole index, your 'diversified' fund quietly becomes a concentrated bet on just a few companies.", pose="explain",
   props=[("ticker", "your index fund"), ("officetower", "…secretly 7 stocks")])
ch("s20h", "And it really is a tiny club — seven companies that have quietly grown to dominate the entire index.", pose="explain",
   props=[("officetower", "seven giants"), ("ticker", "…dominate the index")])
ch("s20i", "In 1972 that same bet looked unbeatable. By 1974, the glamour stocks had dragged the entire market down with them.", pose="explain",
   props=[("bubble", "unbeatable, '72"), ("chartdown", "…down together, '74")])
ch("s20j", "That's the hidden danger of concentration. When the giants fall, there's nothing left to hold the index up.", pose="explain",
   props=[("officetower", "the giants"), ("chartdown", "…nothing holds it up")])
ch("s20k", "And the feeling driving it is the same in every era. Everyone's getting rich but you. So you buy — at the top, for the most money, with the least caution.", pose="explain",
   props=[("crowd", "everyone's getting rich"), ("coins", "…so you buy the top")])
ch("s20l", "The four most expensive words in investing are, reliably, 'this time is different.' In 1972, they cost people half their savings.", pose="explain",
   props=[("bubble", "'this time's different'"), ("warning", "…half their savings")])

# ============================ RHYME 2 — INFLATION SHOCK ============================
ch("s20g", "To understand that inflation, rewind to 1971. Nixon cut the dollar's last tie to gold — and money could now be printed far more freely.", pose="explain",
   props=[("capitol", "Nixon, 1971"), ("coins", "gold tie cut"), ("printer", "…print freely")])
ch("s21", "Rhyme two: the inflation shock. In 1973, inflation arrived in a form you could see from your car window.", pose="present",
   bubble="Rhyme 2: the inflation shock.", props=[("gaspump", "1973"), ("warning", "…at the pump")])
ch("s22", "OPEC cut off the oil. The price quadrupled almost overnight, and gas lines stretched around the block.", pose="explain",
   props=[("oilbarrel", "oil ×4"), ("gaspump", "gas lines"), ("crowd", "…around the block")])
shot("s23", "This is the embargo that lit the fuse — a geopolitical shock that slammed straight into everyday prices.", "wiki-oil73")
ch("s24", "And inflation didn't just tick up. It exploded into double digits — north of twelve percent.", pose="surprised", expr="surprised",
   props=[("pricetag", "inflation"), ("chartup", "12%+")])
ch("s25", "2022 had a totally different trigger — a pandemic, a war — but the exact same result: the worst inflation in forty years.", pose="explain",
   props=[("warning", "2022: new trigger"), ("pricetag", "…worst in 40 yrs")])
ch("s25b", "And once it starts, it feeds itself. Prices rise, so workers demand raises, so costs rise, so prices rise again — a spiral that's brutal to stop.", pose="explain",
   props=[("pricetag", "prices up"), ("paystub", "→ wages up"), ("pricetag", "→ prices up again")])
chart("s26", "Different decade. Different cause. The exact same fever chart.",
      "Inflation rate (%)", [("yr 1", 3.3), ("yr 2", 6.2), ("yr 3", 11.0), ("peak", 12.3), ("after", 7.0)],
      series2=[("yr 1", 1.4), ("yr 2", 4.7), ("yr 3", 8.0), ("peak", 9.1), ("after", 3.2)], seriesLabels=["1970s", "2020s"])
shot("s27", "And that's not me massaging the numbers — here's the Fed's own inflation data, with the 1970s spike and the 2020s spike on one chart.", "fred-cpi")

ch("s27b", "And just like the seventies, the people in charge first reassured everyone it was 'transitory.' It was not.", pose="explain",
   props=[("newspaper", "'transitory'"), ("warning", "…it wasn't")])
ch("s27c", "Prices for everything — food, rent, gas — climbed faster than paychecks. Your money quietly shrank while you held it.", pose="explain",
   props=[("pricetag", "everything up"), ("coins", "…money shrinks")])
ch("s27d", "Two totally different sparks — an oil embargo, then a pandemic — lighting the exact same fire. That's the rhyme.", pose="explain",
   props=[("gaspump", "oil, 1973"), ("warning", "pandemic, 2020"), ("pricetag", "…same fire")])
ch("s27e", "And inflation doesn't just hurt stocks. It torches bonds too — because a fixed payment is worth less when every dollar buys less.", pose="explain",
   props=[("iou", "bonds"), ("pricetag", "…quietly burned")])
ch("s27f", "That's the seventies nightmare: stocks AND bonds falling together. The one place everyone hides had no exits.", pose="explain",
   props=[("chartdown", "stocks down"), ("iou", "bonds down"), ("warning", "…nowhere to hide")])
ch("s27g", "It happened again in 2022 — the classic safe portfolio had one of its worst years in a century.", pose="explain",
   props=[("scale", "the 'safe' mix"), ("chartdown", "…worst in 100 yrs")])

# ============================ RHYME 3 — THE FED ============================
ch("s28", "Rhyme three: the Fed slams the brakes. To strangle 1970s inflation, the Fed cranked interest rates to brutal highs.", pose="present",
   bubble="Rhyme 3: the Fed brakes.", props=[("bank", "the Fed"), ("percent", "…rates way up")])
shot("s29", "Look familiar? Here are Fed interest rates across both eras — a wall of hikes in the seventies, and another wall just now.", "fred-fedfunds")
doodle("s30", "And here's the chain that actually breaks markets: high inflation forces high rates — and high rates crush the price of everything.",
       ["pricetag", "percent", "chartdown"], ["high inflation", "→ high rates", "→ assets fall"], flow=True)
ch("s31", "Because when money stops being free, the most expensive stocks fall the hardest. In 1973, that was the Nifty Fifty.", pose="explain",
   props=[("coins", "money isn't free"), ("gauge", "priciest = riskiest"), ("chartdown", "…fall hardest")])

ch("s31b", "In the seventies it took a legendary Fed chair, Paul Volcker, to finally break inflation — by hiking rates to nearly twenty percent.", pose="explain",
   props=[("bank", "Volcker"), ("percent", "~20%!")])
ch("s31c", "That cure triggered a brutal recession. Killing inflation is never free — someone always ends up paying the bill.", pose="explain",
   props=[("chartdown", "a recession"), ("warning", "…someone pays")])
ch("s31d", "Cheap money had inflated the glamour stocks for years. Expensive money is exactly what finally popped them.", pose="explain",
   props=[("coins", "cheap money inflated"), ("bubble", "…dear money popped")])
ch("s31e", "And rate hikes work on a delay. Economists call them 'long and variable lags' — the pain shows up months, even years, later.", pose="explain",
   props=[("clock", "long, variable lags"), ("warning", "…pain arrives late")])
ch("s31f", "Which is why a calm market today proves nothing. In 1973, the worst of the damage came well after the headlines moved on.", pose="explain",
   props=[("ticker", "calm today"), ("chartdown", "…worst comes later")])
ch("s31g", "Right now the hope is a 'soft landing' — inflation cools, nobody gets hurt. It's possible. It's also exactly what everyone hoped for in 1973.", pose="explain",
   props=[("bubble", "'soft landing'"), ("warning", "…they hoped that too")])

# ============================ RHYME 4 — STAGFLATION + VALUATIONS ============================
ch("s32", "Rhyme four: the ground underneath. Stagflation — a stalling economy and rising prices at the same time.", pose="present",
   bubble="Rhyme 4: stagflation.", props=[("chartdown", "stagnation"), ("pricetag", "+ inflation")])
ch("s33", "The textbooks said that combination couldn't even happen. In the seventies, it happened for a decade.", pose="explain",
   props=[("warning", "'impossible'"), ("clock", "…a whole decade")])
shot("s34", "It's a real, named thing — and it's exactly the corner an economy gets stuck in when prices rise but growth doesn't.", "wiki-stagflation")
ch("s35", "And sitting on top of all of it, one number: how expensive stocks are versus a decade of real earnings. The CAPE ratio.", pose="explain",
   props=[("gauge", "the CAPE ratio"), ("ticker", "price ÷ 10-yr earnings")])
chart("s36", "In 1966 it hit twenty-four — and then came a long, grinding bear market. Today it sits around forty.",
      "Shiller CAPE ratio", [("1966", 24), ("1974", 8), ("1982", 7), ("2000", 44), ("2009", 15), ("2026", 40)],
      notes=[{"at": 0, "text": "'66 peak → long bear"}, {"at": 3, "text": "dot-com top"}, {"at": 5, "text": "us, now"}])
shot("s37", "This one's live — the Shiller P/E today, near forty, a level beaten only once in history: the peak of the dot-com bubble.", "multpl-cape")
ch("s37b", "And history is blunt about what that tends to mean. From valuations this high, the next decade of market returns has usually been weak — low single digits, sometimes nothing.", pose="explain",
   props=[("gauge", "buy at ~40×"), ("chartdown", "…a weak decade ahead")])
ch("s37c", "The bulls say it's justified now — lower rates, fatter profits, buybacks. Maybe. But that's the same reassurance offered at every single top.", pose="explain",
   props=[("ticker", "'it's justified'"), ("bubble", "…said at every top")])
ch("s38", "High valuations don't cause a crash by themselves. But they're the dry wood. 1973 had a forest of it. So does 2026.", pose="explain",
   props=[("gauge", "dry wood"), ("bubble", "…waiting for a spark")])

ch("s38b", "Think of a high CAPE as a smoke detector, not a stopwatch. It can't tell you WHEN. It can tell you the room is full of gas.", pose="explain",
   props=[("gauge", "a smoke detector"), ("warning", "…not a timer")])
ch("s38c", "Here's why it matters. Historically, the higher the CAPE on the day you buy, the lower your returns over the next decade.", pose="explain",
   props=[("gauge", "buy at high CAPE"), ("chartdown", "…weak 10-yr returns")])
ch("s38d", "And every bubble sings the same anthem: 'this time is different' — because of railroads, radio, dot-coms, and now AI.", pose="explain",
   props=[("bubble", "'this time's different'"), ("ticker", "…every single time")])
ch("s38e", "Sometimes it genuinely is a little different. It's just never different enough to make a crazy price safe.", pose="explain",
   props=[("gauge", "a bit different?"), ("warning", "…price still bites")])
shot("s38f", "And CAPE isn't some fringe idea — it's the measure a Nobel-winning economist built specifically to spot exactly this.", "wiki-cape")
ch("s38g", "There's a second gauge that agrees: the total value of the stock market versus the whole economy. It's also near record highs.", pose="explain",
   props=[("gauge", "market vs. economy"), ("globe", "…near records too")])
ch("s38h", "And today's anthem is the AI boom — just as the 1960s had the 'go-go' tech of its day. Massive spending, sky-high hopes.", pose="explain",
   props=[("officetower", "the AI boom"), ("coins", "…huge spending"), ("bubble", "sky-high hopes")])

# ============================ THE PATTERN ============================
ch("s39", "Put the four rhymes side by side, and the picture gets uncomfortable.", pose="explain",
   props=[("bubble", "glamour stocks"), ("gaspump", "inflation shock"), ("bank", "Fed brakes"), ("gauge", "sky-high prices")])
ch("s40", "Glamour-stock mania. An inflation shock. A Fed slamming the brakes. And valuations near all-time highs. 1973 had all four. We have all four.", pose="explain",
   props=[("calendar", "1973: all four"), ("gauge", "2026: all four")])
ch("s41", "This is not a prediction. Nobody can time a market, and anyone who says they can is selling something.", pose="shrug",
   bubble="This is not a prediction.", props=[("scale", "no crystal ball"), ("warning", "…just a pattern")])
ch("s42", "It's a pattern. And patterns, in markets, are worth respecting — especially the ones everyone's decided to forget.", pose="explain",
   props=[("bubble", "a pattern"), ("calendar", "…the forgotten one")])
ch("s42b", "And to be fair to the other side: a setup can simmer for years before anything breaks. Being early can feel exactly like being wrong.", pose="explain",
   props=[("clock", "it can simmer for years"), ("warning", "…early feels wrong")])
ch("s42c", "The market can absolutely climb higher from here. The 1972 market did too — for months — right before it didn't.", pose="explain",
   props=[("chartup", "it can still climb"), ("chartdown", "…then 1974")])

# ============================ WHY NOBODY REMEMBERS ============================
ch("s43", "So why has 1973 vanished from memory, when 1929 and 2008 are practically legends?", pose="think",
   bubble="Why forgotten?", props=[("calendar", "1973 — who?"), ("newspaper", "no legend")])
ch("s44", "Because it didn't crash in a single day. There was no Black Tuesday, no one unforgettable photo. It was a slow, grinding, two-year bleed.", pose="explain",
   props=[("clock", "no crash DAY"), ("chartdown", "…a 2-year bleed")])
chart("s45", "No cliff to gasp at. Just a long, relentless slide — the kind that's easy to look away from.",
      "S&P 500 · 1973–74", [("Jan '73", 120), ("Jul '73", 106), ("Jan '74", 92), ("Jul '74", 78), ("Oct '74", 62)],
      notes=[{"at": 0, "text": "the 1973 peak"}, {"at": 4, "text": "−48% by Oct '74"}])
shot("s46", "The full record is right here — a forty-eight percent fall that took nearly two years to grind all the way down.", "wiki-crash73")
ch("s47", "And then the second trick: inflation hid the wound. On paper, prices clawed back to 1973 levels by 1980.", pose="explain",
   props=[("pricetag", "inflation hides it"), ("ticker", "…'recovered' by 1980")])
ch("s48", "But a 1980 dollar bought far less than a 1973 one. In real, spendable terms, investors waited until the 1990s to be whole.", pose="explain",
   props=[("coins", "a shrunken dollar"), ("clock", "…real recovery: 1990s")])
ch("s48b", "This is the trap in one line: the nominal number lies to you, and only the real, inflation-adjusted number tells the truth.", pose="explain",
   props=[("ticker", "nominal: 'fine!'"), ("coins", "…real: ruined")])
ch("s48c", "So the chart 'recovered.' Your actual buying power did not. For twenty years, you were poorer and the headline never said so.", pose="explain",
   props=[("chartup", "chart recovered"), ("coins", "…you didn't")])
callout("s49", "That's the kind nobody puts in a movie. The quiet crash — the one inflation quietly covers up.",
        "The quiet crash.", sub="the kind inflation hides", icon="warning")

ch("s49b", "Compare that to 2008 — a sudden, screaming panic packed into a few weeks. That's the kind of crash the brain files away and never forgets.", pose="explain",
   props=[("chartdown", "2008: sudden"), ("bomb", "…a loud panic")])
ch("s49c", "A slow bleed never trips that alarm. You adapt. You hope. You keep telling yourself it'll bounce back next quarter.", pose="explain",
   props=[("clock", "a slow bleed"), ("crowd", "…'it'll bounce back'")])
ch("s49d", "Japan learned the same lesson the hard way. Its 1989 market peak still hasn't fully recovered — decades later.", pose="explain",
   props=[("globe", "Japan, 1989"), ("chartdown", "…still not back")])
ch("s49e", "Even the U.S. had a quieter echo. From 2000 to roughly 2013, the market round-tripped to nowhere — a lost decade hiding in plain sight.", pose="explain",
   props=[("ticker", "2000 → 2013"), ("chartdown", "…a lost decade")])
ch("s49f", "So the comforting line that 'stocks always go up over the long run' comes with a giant asterisk: it can depend entirely on the price you paid to get in.", pose="explain",
   props=[("chartup", "'always goes up'*"), ("gauge", "…*at what price?")])

# ============================ THE LESSON ============================
ch("s50", "Which is the real lesson here, and it's bigger than 1973. The dangerous crash isn't the loud one. It's the quiet one you don't notice for years.", pose="explain",
   bubble="The quiet crash is the dangerous one.", props=[("bomb", "not the loud one"), ("chartdown", "…the quiet one")])
ch("s51", "And the Nifty Fifty taught the oldest rule in investing: a wonderful company, bought at a terrible price, is still a terrible investment.", pose="explain",
   props=[("officetower", "great company"), ("gauge", "terrible price"), ("warning", "…bad investment")])
ch("s52", "Price is what you pay. Value is what you get. Pay ninety times earnings, and even a great company can take decades to pay you back.", pose="explain",
   props=[("coins", "price you pay"), ("scale", "value you get")])
ch("s53", "So the Magnificent Seven can absolutely keep changing the world. Their stocks can still fall in half while they do it. Both things can be true.", pose="explain",
   props=[("officetower", "changing the world"), ("chartdown", "…stock still halves")])

ch("s53b", "So this isn't a reason to panic or dump everything. Trying to time the top is a loser's game in both directions.", pose="explain",
   props=[("scale", "don't panic-sell"), ("warning", "…timing loses")])
ch("s53c", "It's a reason to respect price. To ask not just 'is this a great company' but 'is this a great company at THIS price.'", pose="explain",
   props=[("officetower", "great company?"), ("gauge", "…at THIS price?")])
ch("s53d", "Spread your bets. Keep a little dry powder. And treat anyone who swears a price can't matter the way 1974 treated the Nifty Fifty.", pose="explain",
   props=[("scale", "spread your bets"), ("coins", "keep dry powder"), ("chartdown", "…price always matters")])
ch("s53e", "The old investors who survived 1973 had one habit in common: a margin of safety. They simply refused to overpay, even for greatness.", pose="explain",
   props=[("scale", "a margin of safety"), ("gauge", "…never overpay")])
ch("s53f", "That's the whole game. Not predicting the crash. Just making sure that if it comes, the price you paid gives you room to survive it.", pose="explain",
   props=[("warning", "can't predict it"), ("scale", "…survive it")])
ch("s53g", "Because the people wiped out in 1974 weren't reckless gamblers. They bought the best, most admired companies in America. They just paid too much.", pose="explain",
   props=[("officetower", "the best companies"), ("gauge", "…but paid too much")])

# ============================ CLOSE ============================
timeline("s54", "Lay it end to end and the rhyme is hard to miss.", "History rhymes",
         [("1972", "glamour-stock mania", "bubble"), ("1973", "inflation + Fed shock", "gaspump"),
          ("1974", "the quiet −48%", "chartdown"), ("2026", "…the same four rhymes", "gauge")], highlight=3)
ch("s55", "History doesn't repeat itself. But, as the line goes, it rhymes. And right now it is rhyming loudly.", pose="explain",
   props=[("calendar", "it rhymes"), ("ticker", "…listen closely")])
ch("s55b", "And maybe that's the real gift of a forgotten crash. The lessons nobody lived through are the ones a market gets to teach all over again.", pose="explain",
   props=[("calendar", "forgotten = repeated"), ("warning", "…taught again")])
ch("s55c", "You don't have to predict anything to protect yourself. You just have to remember that 1973 happened — and that it started like this.", pose="explain",
   props=[("newspaper", "just remember 1973"), ("ticker", "…it began quietly")])
ch("s56", "Nobody knows if the last verse lands the same way. But 1973 whispers one warning: when everyone agrees the price doesn't matter — the price is about to matter a lot.", pose="explain",
   props=[("gauge", "price matters"), ("warning", "…most when ignored")])
ch("s57", "If this made the past feel a little too familiar, hit subscribe — and tell me which forgotten crash you want me to dig up next.", pose="present",
   props=[("calendar", "which crash next?"), ("newspaper", "the next deep dive")])
ch("s58", "I do the reading. You get the parts that matter.", pose="celebrate", expr="happy",
   props=[("newspaper", "I do the reading"), ("coins", "you get what matters")])

# renumber ids
for i, s in enumerate(S, 1):
    s["id"] = f"s{i}"

SOURCES = [
    {"id": "wiki-nifty", "name": "Nifty Fifty (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Nifty_Fifty", "quote": "Nifty Fifty"},
    {"id": "fred-sp500", "name": "FRED — S&P 500", "url": "https://fred.stlouisfed.org/series/SP500", "quote": "S&P 500"},
    {"id": "wiki-oil73", "name": "1973 oil crisis (Wikipedia)", "url": "https://en.wikipedia.org/wiki/1973_oil_crisis", "quote": "embargo"},
    {"id": "fred-cpi", "name": "FRED — Consumer Price Index", "url": "https://fred.stlouisfed.org/series/CPIAUCSL", "quote": "Consumer Price Index"},
    {"id": "fred-fedfunds", "name": "FRED — Federal Funds Rate", "url": "https://fred.stlouisfed.org/series/FEDFUNDS", "quote": "Federal Funds Effective Rate"},
    {"id": "wiki-stagflation", "name": "Stagflation (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Stagflation", "quote": "stagflation"},
    {"id": "multpl-cape", "name": "Shiller PE (multpl.com)", "url": "https://www.multpl.com/shiller-pe", "quote": "Shiller PE"},
    {"id": "wiki-crash73", "name": "1973–74 crash (Wikipedia)", "url": "https://en.wikipedia.org/wiki/1973%E2%80%931974_stock_market_crash", "quote": "bear market"},
    {"id": "wiki-cape", "name": "CAPE ratio (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Cyclically_adjusted_price-to-earnings_ratio", "quote": "cyclically adjusted"},
]

YT = {
    "title": "The 1973 Crash Nobody Remembers (and Why It Looks Like 2026)",
    "alts": ["The Forgotten Crash That Looks Exactly Like 2026", "1973 vs 2026: The Crash Everyone Forgot"],
    "hook": "Everyone remembers 1929, the dot-com bust, and 2008. Almost nobody remembers 1973 — when the market fell 48% and took ~20 years to recover in real terms. And four things that broke the market in 1973 are all back in 2026: glamour-stock mania, an inflation shock, a Fed slamming the brakes, and valuations near all-time highs. Fully cited, with the FRED and Shiller data.",
    "bullets": [
        "Why the 1973–74 crash (−48%) is the one nobody talks about",
        "Rhyme 1: the Nifty Fifty (42× earnings) vs the Magnificent Seven (~45×)",
        "Rhyme 2: the 1973 oil shock vs the 2022 inflation shock (same fever chart)",
        "Rhyme 3: the Fed slamming the brakes — then and now",
        "Rhyme 4: stagflation and a Shiller CAPE near its all-time high",
        "Why inflation hid the crash — and the lesson that outlives 1973",
    ],
    "tags": [
        "1973 stock market crash", "1973 1974 bear market", "stock market crash history",
        "nifty fifty", "magnificent seven", "stock market bubble", "stagflation", "1973 oil crisis",
        "CAPE ratio", "shiller pe", "stock market 2026", "is the stock market a bubble",
        "inflation 1970s", "federal reserve", "market crash", "investing", "economics explained",
        "Napkin Numbers",
    ],
    "thumbnail": {"hookTop": "THE CRASH EVERYONE", "hookBot": "FORGOT", "napkinNumber": "–48%", "napkinSub": "…1973 = 2026?", "deco": "ticker"},
    "chapters": [
        ["You remember the famous ones", "The crash nobody remembers"],
        ["Rhyme one: the glamour stocks", "Rhyme 1 — Nifty Fifty vs Mag 7"],
        ["Rhyme two: the inflation shock", "Rhyme 2 — the inflation shock"],
        ["Rhyme three: the Fed slams", "Rhyme 3 — the Fed hits the brakes"],
        ["Rhyme four: the ground underneath", "Rhyme 4 — stagflation & valuations"],
        ["Put the four rhymes side by side", "The pattern"],
        ["why has 1973 vanished", "Why nobody remembers it"],
        ["the real lesson here", "The lesson"],
        ["History doesn't repeat", "History rhymes"],
    ],
}

ep = {
    "id": "EP013", "series": "Napkin Numbers", "title": "The 1973 Crash Nobody Remembers",
    "slug": "the-1973-crash-nobody-remembers", "market": "US", "language": "en",
    "voice": {"provider": "edge", "voiceId": "en-US-BrianNeural", "accent": "natural"},
    "note": "1973 crash vs 2026 parallels; timelines + overlay charts.",
    "scenes": S, "sources": SOURCES, "youtube": YT,
}
pathlib.Path("episodes/examples/EP013-1973-crash.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/scenes.json").write_text(json.dumps(S, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/thumb.json").write_text(json.dumps(YT["thumbnail"], indent=2))

words = sum(len(s["narration"].split()) for s in S)
from collections import Counter
print(f"scenes={len(S)} words={words} est={(words/171.3*60 + len(S)*0.5)/60:.2f} min")
print(Counter(s["type"] for s in S))
