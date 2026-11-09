#!/usr/bin/env python3
"""EP012 — "Why Nobody Can Afford a House Anymore, in Four Charts".
15-min script, literal visual-narration sync, props accumulate, 4 charts +
cited evidence screenshots. Writes episodes/examples/EP012-housing.json and
render/src/data/scenes.json."""
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

def chart(id, narr, title, data, unit=None, highlight=None, ctype="line"):
    d = {"id": id, "type": "chart", "narration": narr, "chartType": ctype, "title": title,
         "data": [{"label": a, "value": b} for a, b in data]}
    if unit: d["unit"] = unit
    if highlight is not None: d["highlight"] = highlight
    S.append(d)

def shot(id, narr, sourceId, caption=None):
    d = {"id": id, "type": "screenshot", "narration": narr, "sourceId": sourceId}
    if caption: d["caption"] = caption
    S.append(d)

# ============================ COLD OPEN ============================
ch("s1", "Owning a home used to be the most ordinary thing in the world. Get a job, save for a few years, and the keys were yours.", pose="present",
   props=[("house", "a home"), ("keys", "…the keys")])
ch("s2", "Your parents probably did it in their twenties. Maybe on a single income — on a salary that today sounds like a typo.", pose="explain",
   props=[("couple", "your parents"), ("paystub", "one income"), ("house", "…a house")])
ch("s3", "For a whole generation, that deal is just gone. The house is still standing right there. The door just won't open for you.", pose="explain",
   props=[("house", "still standing"), ("forsale", "…out of reach")])
callout("s4", "The typical American home now costs more than four hundred thousand dollars. A brand-new record.",
        "$412,500", sub="the median U.S. home price", icon="house")
ch("s5", "To get a loan that size, a bank wants to see you earning around a hundred and twenty-seven thousand dollars a year.", pose="explain",
   props=[("mortgage", "to qualify…"), ("paystub", "~$127k / year")])
ch("s6", "The problem? The typical American household earns about eighty thousand. The math quietly stopped working.", pose="handtohead", expr="worried",
   props=[("paystub", "~$80k earned"), ("calculator", "…doesn't add up"), ("warning", "the gap")])
ch("s7", "And the starter home — the small, cheap, first place you actually buy — has basically gone extinct.", pose="explain",
   props=[("house", "the starter home"), ("warning", "…extinct")])
ch("s7b", "Here's the comparison that stings. In the nineteen-eighties, a typical home cost about two to three years of a typical salary.", pose="explain",
   props=[("house", "a 1980s home"), ("paystub", "~2–3 yrs' pay")])
ch("s7c", "Today, that same ordinary house costs the better part of a decade of income — before a single cent of interest.", pose="explain",
   props=[("house", "today's home"), ("clock", "~a decade of pay"), ("mortgage", "…plus interest")])
compare("s7d", "Same four walls. A completely different mountain to climb.",
        "A home in 1985", "~2.5× income", "A home today", "~5× income", licon="house", ricon="house")
ch("s7e", "And this isn't envy, and it isn't avocado toast. A whole generation is playing a game where the rules changed halfway through the round.", pose="explain",
   props=[("house", "the same goal"), ("warning", "…new rules")])
ch("s8", "So everyone reaches for a villain. Greedy landlords. Wall Street. Boomers. Foreigners. Airbnb. Take your pick.", pose="shrug",
   props=[("bank", "Wall Street?"), ("crowd", "landlords?"), ("apartment", "Airbnb?")])
ch("s9", "But blaming one villain is exactly why nothing ever gets fixed. The real story isn't a person. It's four charts.", pose="point",
   bubble="It's four charts.", props=[("chartup", "four charts"), ("house", "one broken market")])
ch("s10", "And once you've actually seen these four, you will never look at a 'For Sale' sign the same way again.", pose="explain",
   props=[("forsale", "every sign"), ("chartup", "…four charts")])
title("s11", "So let's follow the money — right up to the front door.", "Why Nobody Can Afford a House",
      kicker="In four charts", sub="The door didn't lock itself.")

# ============================ CHART 1 — THE PRICE GAP ============================
ch("s12", "Chart one. The gap between what a house costs and what a human being actually earns.", pose="present",
   bubble="Chart 1: the gap.", props=[("house", "home prices"), ("paystub", "vs. your paycheck")])
ch("s13", "For most of modern history, a typical home cost about three times a year's income. Expensive — but reachable.", pose="explain",
   props=[("house", "a home"), ("paystub", "~3× income"), ("keys", "…reachable")])
ch("s14", "You could save a down payment in a few years and grow into the mortgage. The ladder actually had rungs.", pose="explain",
   props=[("piggybank", "save a few years"), ("house", "grow into it"), ("keys", "…climb in")])
chart("s15", "Today, the typical home costs five times income — tying the most expensive level ever recorded.",
      "U.S. home price ÷ household income", [("1990", 3.2), ("2000", 3.4), ("2006", 4.7), ("2012", 3.3), ("2019", 4.1), ("2024", 5.0)], highlight=5)
shot("s16", "And this isn't a vibe. Harvard's housing center clocked the national price-to-income ratio at a record five-point-zero.", "s-jchs")
ch("s17", "Here's the engine behind that line. Two things that were supposed to move together — and completely came apart.", pose="explain",
   props=[("chartup", "home prices"), ("paystub", "paychecks")])
ch("s18", "Home prices went nearly vertical. And wages? Wages basically crawled along the floor.", pose="surprised", expr="surprised",
   props=[("chartup", "prices: vertical"), ("paystub", "wages: flat")])
ch("s19", "When the thing you're buying triples while your paycheck barely moves, that's not a budgeting problem. It's a math problem.", pose="explain",
   props=[("calculator", "triple the price"), ("paystub", "flat pay"), ("warning", "…impossible")])
ch("s19b", "So why did prices run away like this? A few fires, all lit at once.", pose="think",
   props=[("house", "prices soared"), ("warning", "…but why?")])
ch("s19c", "A giant generation — millennials — all hit home-buying age at the same moment, flooding the market with buyers.", pose="explain",
   props=[("couple", "millennials"), ("crowd", "all at once"), ("house", "…chasing homes")])
ch("s19d", "A decade of ultra-cheap borrowing let every one of them bid higher without feeling it — until the bill finally came due.", pose="explain",
   props=[("percent", "near-zero rates"), ("coins", "bid higher"), ("house", "…prices climb")])
ch("s19e", "And a home quietly became a savings account. If prices only ever go up, buying early stops feeling like a purchase and starts feeling like a bet you can't lose.", pose="explain",
   props=[("house", "a home"), ("piggybank", "…a savings account"), ("chartup", "a sure bet?")])
ch("s20", "Zillow's own index tells the same story — the typical home value roughly doubled in well under a decade.", pose="explain",
   props=[("house", "typical home value"), ("chartup", "…doubled in <10 yrs")])
callout("s21", "In 2021, one in three renters could still afford the typical home. Two years later, it was one in seven.",
        "1 in 7", sub="renters who can afford a median home", icon="couple")
ch("s22", "The ladder didn't just get taller. Somebody came along and sawed off the bottom rungs.", pose="explain",
   props=[("house", "the ladder"), ("couple", "first-time buyers"), ("warning", "rungs gone")])
ch("s23", "And the cruel twist: people who bought in early watched their house out-earn their actual job.", pose="explain",
   props=[("house", "bought early"), ("chartup", "home > salary"), ("coins", "…for doing nothing")])
ch("s23b", "And it compounds against you. Every year you can't buy, prices climb again — and the down payment you were chasing sprints further away.", pose="explain",
   props=[("piggybank", "chasing the down payment"), ("chartup", "…it runs away")])

# ============================ CHART 2 — THE RATE SHOCK ============================
ch("s24", "But the sticker price hides half the story. Almost nobody pays cash. You don't buy the price — you buy the monthly payment.", pose="explain",
   bubble="You buy the payment.", props=[("mortgage", "a 30-year loan"), ("calculator", "…the monthly payment")])
ch("s24b", "And here's the part the brochure never explains. In the early years of a thirty-year loan, almost every dollar you pay is pure interest.", pose="explain",
   props=[("mortgage", "year one"), ("coins", "…mostly interest")])
ch("s24c", "You're not really buying the house yet. You're renting the bank's money — and the rent on money is the interest rate.", pose="explain",
   props=[("bank", "renting money"), ("percent", "…that's the rent")])
ch("s25", "And that payment is ruled by one number that has nothing to do with the house itself. Chart two: the interest rate.", pose="present",
   bubble="Chart 2: the rate.", props=[("percent", "the interest rate"), ("mortgage", "…rules the payment")])
ch("s26", "In the pandemic, the Fed pinned rates to the floor. Mortgages dropped below three percent. Borrowing was almost free.", pose="explain",
   props=[("percent", "under 3%"), ("house", "borrowing: free")])
ch("s27", "Sounds great. But when everyone can suddenly borrow more, they all bid more — and prices leap up to swallow the cheap money.", pose="explain",
   props=[("coins", "cheap money"), ("forsale", "everyone bids"), ("chartup", "…prices jump")])
chart("s28", "Then inflation hit, and in barely eighteen months, mortgage rates nearly touched eight percent — the fastest spike in forty years.",
      "30-year mortgage rate (%)", [("2021", 2.7), ("2022", 5.3), ("2023", 7.8), ("2024", 6.8), ("2026", 6.5)], highlight=2)
ch("s29", "Same house. Same price tag. But the monthly check you write for it roughly doubled.", pose="surprised", expr="surprised",
   props=[("house", "same house"), ("mortgage", "payment…"), ("chartup", "…DOUBLED")])
compare("s30", "A payment that was around seventeen hundred a month became nearly three thousand — for the exact same four walls.",
        "Payment at 3%", "~$1,700/mo", "Payment at 7%", "~$2,900/mo", licon="keys", ricon="padlock")
ch("s31", "That's an extra fifteen thousand dollars a year — forever — for literally nothing new. Same house, same street, same paint.", pose="explain",
   props=[("mortgage", "+$15k / year"), ("pricetag", "nothing new"), ("warning", "…forever")])
ch("s31b", "And before any of that, you need the down payment. Tens of thousands in cash — saved while rent quietly eats a third of every paycheck.", pose="explain",
   props=[("piggybank", "the down payment"), ("apartment", "rent eats it"), ("warning", "…save what?")])
ch("s31c", "So you're asked to save faster than ever, for a bigger number than ever, out of the paycheck that grew the slowest of all.", pose="handtohead", expr="worried",
   props=[("calculator", "save faster"), ("house", "bigger number"), ("paystub", "…flattest pay")])
shot("s32", "And you don't set that rate — the market and the Fed do. This is Freddie Mac's own weekly record of the spike.", "s-rates")
ch("s32b", "Why did rates explode? To fight the worst inflation in forty years, the Fed hiked its own rate hard — and mortgages followed it straight up.", pose="explain",
   props=[("pricetag", "40-year inflation"), ("bank", "the Fed hikes"), ("percent", "…mortgages follow")])
ch("s32c", "Here's the cruel irony. Cheap rates never really made homes affordable. They just let sellers charge more. The price quietly absorbs every drop in the rate.", pose="explain",
   props=[("percent", "low rate"), ("pricetag", "…higher price"), ("house", "same home")])
ch("s33", "So even if prices had frozen solid, the cost of carrying a home still exploded. Two locks on the same front door.", pose="explain",
   props=[("house", "price frozen"), ("percent", "rate jumped"), ("padlock", "…two locks")])

# ============================ CHART 3 — THE MISSING HOMES ============================
ch("s34", "By now you're yelling the obvious fix. Just build more houses. Supply and demand. Chart three.", pose="present",
   bubble="Chart 3: we stopped building.", props=[("crane", "just build more?"), ("blueprint", "supply & demand")])
ch("s35", "Right instinct. One problem. For about fifteen years, America quietly stopped building enough of them.", pose="explain",
   props=[("crane", "the fix"), ("hardhat", "…we stopped"), ("chartdown", "too few built")])
chart("s36", "After the 2008 crash, homebuilding fell off a cliff — and unlike the stock market, it never fully climbed back.",
      "New homes built (million / year)", [("2005", 2.1), ("2009", 0.55), ("2015", 1.1), ("2020", 1.4), ("2024", 1.4)], highlight=1)
ch("s37", "A whole decade of building too little, while the population kept growing. The hole just got deeper every single year.", pose="explain",
   props=[("hardhat", "too little built"), ("crowd", "more people"), ("chartdown", "…a growing hole")])
callout("s38", "Add it all up, and the country is short by nearly four million homes.",
        "~3.8 million", sub="the U.S. housing shortage", icon="house")
shot("s39", "And Freddie Mac doesn't treat that as a footnote. It calls the shortage the root cause of the entire affordability crisis.", "s-shortage")
ch("s40", "So why can't we just build? Because a new home hits a wall of rules before a single brick is ever laid.", pose="explain",
   props=[("blueprint", "the rules"), ("crane", "…before you build")])
ch("s41", "Zoning that bans anything but big single houses. Expensive land. Pricey labor and materials. Years of permits.", pose="explain",
   props=[("blueprint", "zoning bans"), ("coins", "costly land"), ("hardhat", "labor & permits")])
ch("s41b", "There's also a quieter reason. When building anything is this hard, builders only bother with the homes that earn the fattest margin.", pose="explain",
   props=[("crane", "so hard to build"), ("house", "…big & pricey only"), ("coins", "fat margin")])
ch("s41c", "So they build the five-bedroom, not the starter. The cheap first home is the exact one almost nobody builds anymore.", pose="explain",
   props=[("house", "the mansion"), ("forsale", "…not the starter")])
ch("s41d", "And the 2008 crash wiped out thousands of small local builders. The ones left standing are big, cautious, and slow.", pose="explain",
   props=[("hardhat", "small builders gone"), ("chartdown", "…since 2008")])
ch("s42", "And then the neighbors. The people who already own show up to every meeting to block anything new nearby.", pose="explain",
   props=[("crowd", "the neighbors"), ("apartment", "block new homes"), ("warning", "…not here")])
ch("s43", "They vote to protect their view and their home value over your chance to ever have one. Quietly, it works.", pose="explain",
   props=[("house", "protect my value"), ("crowd", "…vote no")])
ch("s43b", "We also quietly outlawed the in-between. Duplexes, townhouses, small apartment blocks — the 'missing middle' that used to be the affordable rung.", pose="explain",
   props=[("apartment", "the missing middle"), ("blueprint", "…zoned out of existence")])
ch("s43c", "In the hottest cities the result is brutal: the nurse and the teacher can no longer afford to live anywhere near the people they serve.", pose="explain",
   props=[("crowd", "nurses & teachers"), ("house", "priced out"), ("warning", "…can't live there")])
ch("s44", "So we took the one fix that genuinely works — more homes — and made it the single hardest thing in America to do.", pose="handtohead", expr="worried",
   props=[("house", "the real fix"), ("crane", "…blocked"), ("warning", "impossible")])
ch("s44b", "And every missing home is a bidding war that never had to happen — a family that could've just had a key, fighting over scraps instead.", pose="explain",
   props=[("house", "a missing home"), ("couple", "…no key"), ("forsale", "fighting for scraps")])

# ============================ CHART 4 — THE LOCK-IN TRAP ============================
ch("s45", "And here's the twist that quietly makes all of it worse. Chart four. Even the homes that already exist aren't for sale.", pose="present",
   bubble="Chart 4: the freeze.", props=[("lockhouse", "already built"), ("forsale", "…but not for sale")])
ch("s46", "Remember those below-three-percent pandemic mortgages? Roughly half of all homeowners are still holding one.", pose="explain",
   props=[("mortgage", "a 3% mortgage"), ("crowd", "~half of owners")])
ch("s47", "Now picture their choice. Sell this house, and your next mortgage is at seven percent — often on a smaller place.", pose="explain",
   props=[("sold", "sell this one?"), ("percent", "re-buy at 7%"), ("house", "…something smaller")])
ch("s48", "Your payment could actually go UP just to downsize. So rational people do the only sane thing. They stay put.", pose="explain",
   props=[("padlock", "so they stay"), ("lockhouse", "…locked in place")])
ch("s48b", "There's a name for it. Golden handcuffs. Your old rate is so good it quietly traps you in a house you've already outgrown.", pose="explain",
   props=[("padlock", "golden handcuffs"), ("lockhouse", "…trapped by a good deal")])
ch("s48c", "A family with a three-percent loan would pay thousands more a year to buy the identical house next door at seven. So nobody moves.", pose="explain",
   props=[("couple", "a 3% family"), ("percent", "vs. 7% next door"), ("padlock", "…nobody moves")])
chart("s49", "The result shows up instantly in the data. The number of homes for sale dried up — frozen near record lows.",
      "Homes for sale (million)", [("2019", 1.6), ("2021", 1.02), ("2022", 0.9), ("2024", 1.1)], highlight=2)
callout("s50", "Economists estimate this lock-in froze roughly one-point-seven million home sales in just two years.",
        "1.7 million", sub="home sales frozen by lock-in", icon="lockhouse")
shot("s51", "And here's the sting. By choking supply even further, the FHFA found lock-in pushed prices up by about another seven percent.", "s-lockin")
ch("s52", "It's a doom loop. Nothing's for sale, so the few buyers left fight over scraps — and bid each other up.", pose="explain",
   props=[("forsale", "nothing for sale"), ("crowd", "buyers fight"), ("chartup", "…prices up again")])
ch("s52b", "With resale frozen, brand-new homes became almost the only ones for sale — and builders know it, so they almost never have to cut the price.", pose="explain",
   props=[("crane", "new homes only"), ("forsale", "…the only option"), ("pricetag", "no need to discount")])
ch("s52c", "It's the cruelest kind of trap. The people most stuck are the ones who did everything right and locked in a great rate.", pose="explain",
   props=[("couple", "did it right"), ("padlock", "…now trapped"), ("lockhouse", "by a good deal")])

# ============================ WHO WINS ============================
ch("s53", "So with almost nothing on the market, ask the real question. Who actually wins a bidding war?", pose="think",
   bubble="So who wins?", props=[("forsale", "a bidding war"), ("scale", "…who wins?")])
ch("s54", "Not the family with a mortgage and a home inspection. The winner is whoever can skip all of that — and pay cash.", pose="explain",
   props=[("mortgage", "a normal buyer"), ("coins", "…vs. all cash")])
ch("s55", "Which is increasingly Wall Street. In recent years, investors bought roughly one in four of the cheapest homes in America.", pose="explain", variant="villain",
   props=[("bank", "Wall Street"), ("house", "1 in 4 cheap homes")])
ch("s56", "And this isn't a conspiracy — the purchase data is public. Big investors simply became the buyer nobody could outbid.", pose="explain",
   props=[("bank", "big investors"), ("sold", "…the buyer to beat")])
ch("s57", "They don't need a loan, an inspection, or a good night's sleep. They offer cash, today, over asking.", pose="explain",
   props=[("sold", "cash, today"), ("coins", "over asking")])
ch("s57b", "Some firms stopped waiting entirely. They now build whole neighborhoods designed never to be sold — only rented, forever.", pose="explain",
   props=[("crane", "build-to-rent"), ("apartment", "whole streets"), ("forsale", "…never for sale")])
ch("s57c", "So the starter home didn't just get expensive. For a lot of families, it quietly turned into a rental they'll pay on for life.", pose="explain",
   props=[("house", "the starter home"), ("apartment", "…now a rental")])
ch("s57d", "And once a few big players own enough rentals, they can lean on the same software to set the rent — nudging prices up in lockstep.", pose="explain",
   props=[("apartment", "big landlords"), ("calculator", "…set the rent"), ("chartup", "all rise together")])
ch("s58", "A young couple finally saves a down payment, finds the one, writes the offer — and loses before lunch to a company they'll never meet.", pose="explain",
   props=[("couple", "a young couple"), ("mortgage", "their one shot"), ("coins", "…beaten by cash")])

# ============================ HUMAN COST ============================
ch("s59", "And the people locked out of buying don't vanish. They rent. And rents climbed right alongside the prices.", pose="explain",
   props=[("apartment", "they rent"), ("pricetag", "rents rose too")])
callout("s60", "A record twenty-two million renter households now spend more than a third of their income just to keep a roof overhead.",
        "22 million", sub="renters stretched thin by housing costs", icon="apartment")
shot("s61", "Harvard tracks that number too, and it keeps breaking its own record — more renters stretched thinner every year.", "s-renters")
ch("s62", "So life goes on hold. People move back in with parents. They delay the move, the wedding, the kid.", pose="explain",
   props=[("movingbox", "back to parents"), ("couple", "delay the wedding"), ("clock", "…life on hold")])
ch("s62b", "And it splits a whole generation in two — not by income, but by timing. Did you buy before the door shut, or after?", pose="explain",
   props=[("house", "bought before"), ("forsale", "…or after?"), ("scale", "pure timing")])
ch("s62c", "For the first time in modern memory, young adults are statistically less likely to own a home than their parents were at the same age.", pose="explain",
   props=[("couple", "young adults"), ("house", "own less"), ("chartdown", "…than their parents")])
ch("s63", "And the gap compounds every year. Owners watched their equity balloon while they slept.", pose="explain",
   props=[("house", "owners"), ("chartup", "equity balloons")])
compare("s64", "Renters paid an entire mortgage every month — just somebody else's. One side quietly builds wealth. The other builds it for a landlord.",
        "Homeowners", "+ equity", "Renters", "+ nothing", licon="house", ricon="apartment")
ch("s64b", "And rent isn't building you anything. Thirty years of rent checks, and you end with exactly what you started with — a stack of receipts.", pose="explain",
   props=[("apartment", "30 years of rent"), ("iou", "…just receipts")])
ch("s64c", "Picture it. You did everything right — a degree, a steady job, no debt. And the cheapest home near work still needs an income you just don't have.", pose="explain",
   props=[("paystub", "did everything right"), ("house", "…still can't buy"), ("warning", "the gap")])
ch("s65", "That's how a housing market quietly turns into a wealth-sorting machine — before you've even bought a thing.", pose="explain",
   props=[("house", "the haves"), ("apartment", "the have-nots"), ("scale", "…sorted")])

# ============================ REFRAME ============================
ch("s65b", "None of this fell from the sky. After World War Two, America bet its whole middle class on one idea: a house, and a thirty-year mortgage.", pose="explain",
   props=[("flagUS", "post-war America"), ("house", "a home"), ("mortgage", "…the 30-year loan")])
ch("s65c", "It worked beautifully — for the people who got in. The home became the family's retirement plan, its inheritance, its everything.", pose="explain",
   props=[("house", "the home"), ("piggybank", "retirement plan"), ("baby", "…the inheritance")])
ch("s65d", "Which is the trap. Once a country stores its wealth inside home prices, letting those prices fall becomes politically unthinkable.", pose="explain",
   props=[("house", "wealth stored here"), ("padlock", "…can never fall"), ("capitol", "politically off-limits")])
ch("s66", "So, the villain. Here's the uncomfortable answer. There isn't one. It's the whole machine, working exactly as designed.", pose="explain",
   bubble="There's no single villain.", props=[("blueprint", "the machine"), ("house", "working as built")])
ch("s67", "Because somewhere along the way, a house stopped being a place to live. It quietly became an investment.", pose="explain",
   props=[("house", "a place to live"), ("chartup", "…became an asset")])
ch("s68", "And an investment has exactly one job. Go up. Every rate cut, every tax break, every rule quietly serves that one job.", pose="explain",
   props=[("chartup", "it must go up"), ("capitol", "…policy protects it")])
ch("s68b", "Economists even have a word for the force behind it. Homevoters — people who, above all else, vote to protect the value of their home.", pose="explain",
   props=[("crowd", "homevoters"), ("house", "…protect the price")])
ch("s68c", "So the real fight over housing isn't left versus right. It's the people who already own versus everyone who hasn't bought in yet.", pose="explain",
   props=[("house", "owners"), ("couple", "…everyone else"), ("scale", "the real divide")])
ch("s68d", "It doesn't have to be this way. A few countries treat housing first as shelter, and build relentlessly to keep it cheap — on purpose.", pose="explain",
   props=[("globe", "other countries"), ("crane", "build on purpose"), ("house", "…shelter first")])
ch("s69", "Which is why every honest fix has a loser. Build four million homes, and you dent the biggest asset most families own.", pose="explain",
   props=[("crane", "build millions"), ("house", "…prices soften"), ("warning", "owners lose")])
ch("s70", "Cut rates to help buyers, and you just hand everyone a bigger loan — and the price floats right back up.", pose="explain",
   props=[("percent", "cut rates"), ("mortgage", "bigger loan"), ("pricetag", "…price rises")])
callout("s71", "For the two-thirds of Americans who already own, the system isn't broken at all. It's working perfectly.",
        "It's working.", sub="…for the people who already own", icon="lockhouse")
ch("s72", "And they vote. Which is exactly why the one thing that would help most is the thing that almost never happens.", pose="explain",
   props=[("crowd", "they vote"), ("capitol", "…so nothing changes")])

# ============================ CLOSE ============================
ch("s73", "So no — you are not crazy, and you are not bad with money. The door really did move. The math really did change.", pose="explain",
   props=[("house", "the door moved"), ("keys", "…not just you")])
ch("s74", "A home became the one thing we all need to live in… and the one thing we quietly decided must never be allowed to get cheaper.", pose="explain",
   props=[("house", "a place to live"), ("padlock", "…never cheaper")])
doodle("s74b", "Four charts. Prices up. Rates up. Building down. The market frozen. Stack them together, and the locked door isn't a mystery anymore.",
       ["chartup", "percent", "crane", "padlock"], ["prices up", "rates up", "building down", "frozen"])
ch("s75", "Four charts. Prices up, rates up, building down, and the whole market frozen in place. That's the lock on the door.", pose="point",
   props=[("chartup", "prices up"), ("percent", "rates up"), ("crane", "building down"), ("padlock", "…frozen")])
ch("s75b", "And the painful part? A lot of the people with the power to fix it are the exact people the broken version quietly made rich.", pose="explain",
   props=[("capitol", "the power to fix it"), ("lockhouse", "…made them rich")])
ch("s76", "If this finally made the numbers click, hit subscribe — and tell me which impossible price you want me to pull apart next.", pose="present",
   props=[("calculator", "which number next?"), ("house", "the next deep dive")])
ch("s77", "I do the reading. You get the parts that matter.", pose="celebrate", expr="happy",
   props=[("paystub", "I do the reading"), ("keys", "you get what matters")])

# renumber ids sequentially (keeps side-alternation + clean chapters)
for i, s in enumerate(S, 1):
    s["id"] = f"s{i}"

SOURCES = [
    {"id": "s-jchs", "name": "Harvard JCHS — price-to-income",
     "url": "https://www.jchs.harvard.edu/blog/home-prices-surge-five-times-median-income-nearing-historic-highs", "quote": "price-to-income"},
    {"id": "s-rates", "name": "Freddie Mac PMMS",
     "url": "https://www.freddiemac.com/pmms", "quote": "30-year fixed-rate mortgage"},
    {"id": "s-shortage", "name": "Freddie Mac shortage",
     "url": "https://www.housingwire.com/articles/u-s-housing-market-is-missing-3-3-million-homes-freddie-mac-says/", "quote": "housing shortage"},
    {"id": "s-lockin", "name": "Mortgage lock-in effect",
     "url": "https://en.wikipedia.org/wiki/Lock-in_effect_(mortgages)", "quote": "lock-in effect"},
    {"id": "s-renters", "name": "Harvard JCHS — cost-burdened renters",
     "url": "https://en.wikipedia.org/wiki/Housing_crisis_in_the_United_States", "quote": "46% of American renters are cost burdened"},
]

YT = {
    "title": "Why Nobody Can Afford a House Anymore (in 4 Charts)",
    "alts": [
        "The Real Reason Houses Are So Expensive (4 Charts)",
        "Why Houses Got So Expensive — And Nobody Can Fix It",
    ],
    "hook": "The typical American home now costs over $400,000 — about five times what a typical household earns, and you'd need to make $127,000 a year to qualify. So what actually happened? Not one villain — four charts. Prices pulled away from paychecks, mortgage rates doubled the monthly payment, we stopped building, and the whole market froze. Here's the math, fully cited.",
    "bullets": [
        "Chart 1 — how home prices pulled away from paychecks (price-to-income hit a record 5×)",
        "Chart 2 — how a jump in mortgage rates roughly doubled the monthly payment",
        "Chart 3 — the ~4 million-home shortage Freddie Mac calls the \"root cause\"",
        "Chart 4 — the \"lock-in\" trap freezing the market and pushing prices even higher",
        "Who actually wins the bidding wars — and who gets locked out",
        "Why every real fix has a loser, and a house stopped being a place to live",
    ],
    "tags": [
        "why nobody can afford a house", "housing crisis", "housing affordability",
        "why are houses so expensive", "home prices", "mortgage rates", "housing shortage",
        "lock-in effect", "price to income ratio", "first time home buyer", "rent vs buy",
        "real estate explained", "housing market 2026", "Case-Shiller", "Zillow", "FRED",
        "Harvard JCHS", "Freddie Mac", "economics explained", "Napkin Numbers",
    ],
    "thumbnail": {"hookTop": "NOBODY CAN AFFORD", "hookBot": "A HOUSE", "napkinNumber": "$412K", "napkinSub": "…on $80k pay?", "deco": "forsale"},
    "chapters": [
        ["Owning a home used to be", "The vanishing starter home"],
        ["Chart one. The gap", "Chart 1 — prices vs. paychecks"],
        ["you buy the monthly payment", "Chart 2 — the rate shock"],
        ["just build more houses", "Chart 3 — the missing homes"],
        ["even the homes that already exist", "Chart 4 — the lock-in trap"],
        ["who actually wins a bidding war", "Who wins the bidding war"],
        ["locked out of buying don't vanish", "The human cost"],
        ["the villain. Here's the uncomfortable", "Why there's no single villain"],
        ["you are not crazy", "So what now"],
    ],
}

ep = {
    "id": "EP012", "series": "Napkin Numbers", "title": "Why Nobody Can Afford a House Anymore",
    "slug": "why-nobody-can-afford-a-house", "market": "US", "language": "en",
    "voice": {"provider": "edge", "voiceId": "en-US-BrianNeural", "accent": "natural"},
    "note": "Four-charts housing affordability explainer.",
    "scenes": S, "sources": SOURCES, "youtube": YT,
}
pathlib.Path("render/src/data/thumb.json").write_text(json.dumps(YT["thumbnail"], indent=2))
pathlib.Path("episodes/examples/EP012-housing.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/scenes.json").write_text(json.dumps(S, indent=2, ensure_ascii=False))

words = sum(len(s["narration"].split()) for s in S)
from collections import Counter
print(f"scenes={len(S)} words={words} est={(words/171.3*60 + len(S)*0.5)/60:.2f} min")
print(Counter(s["type"] for s in S))
