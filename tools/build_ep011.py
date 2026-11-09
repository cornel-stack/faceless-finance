#!/usr/bin/env python3
"""Builds EP011 (world debt) — 15-minute script with literal visual-narration sync.
Every scene's illustration depicts exactly what the narration says at that moment.
Writes episodes/examples/EP011-world-debt.json and render/src/data/scenes.json."""
import json, pathlib

S = []  # scenes


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
    l = {"title": lt, "value": lv}
    r = {"title": rt, "value": rv}
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
ch("s1", "Every country on Earth is in debt. Every single one.", pose="present",
   props=[("globe", "the whole planet"), ("chain", "…in debt")])
ch("s2", "The United States, China, Japan, Germany, Britain — every major economy on the planet owes more money than it actually has.", pose="explain",
   props=[("flagUS", "U.S."), ("flagCN", "China"), ("flagJP", "Japan"), ("flagGB", "Britain")])
callout("s3", "And not by a little. America alone just passed forty trillion dollars. That's a four, followed by thirteen zeros.",
        "$40,000,000,000,000", sub="the U.S. national debt")
shot("s3ev", "And this isn't me being dramatic — budget watchdogs sounded the alarm the day it crossed forty trillion.", "s-40t")
ch("s4", "It climbs by about a hundred thousand dollars every few seconds — faster than you can read this sentence.", pose="surprised", expr="surprised",
   props=[("debtclock", "+$100k / sec"), ("clock", "every few seconds")])
doodle("s5", "You've seen the debt clock spinning. You've seen the headlines. America's broke. The dollar is doomed. Your grandkids inherit the bill.",
       ["debtclock", "newspaper", "baby"], ["the debt clock", "the headlines", "“the kids inherit it”"])

ch("s5b", "Here's the thing almost no one tells you. That giant, scary number is only half the story.", pose="explain",
   props=[("debtclock", "the scary number"), ("scale", "…only half the story")])
shot("s5ev", "And it's not just America. The IMF says global government debt is about to blow past one hundred trillion dollars.", "s-global")

title("s6", "So here's the strange part almost nobody stops on.", "Who The World Actually Owes",
      kicker="The question nobody asks", sub="Follow the money — all the way down.")
ch("s7", "If every country is in debt… then who is all that money actually owed to?", pose="think",
   props=[("globe", "everyone owes…"), ("scale", "…owed to whom?")])
ch("s8", "Debt doesn't just float in the air. For every borrower, somewhere, there has to be a lender.", pose="explain",
   props=[("iou", "a borrower"), ("handshake", "a deal"), ("bank", "a lender")])
ch("s9", "Mars isn't lending us the money. So if the entire planet is in the red, who on Earth is holding the other side of the deal?", pose="shrug",
   props=[("globe", "the whole Earth"), ("chain", "in the red"), ("scale", "who holds it?")])
ch("s10", "The answer is weirder, and a lot more unsettling, than the scary number on the screen. So let's actually follow the money.", pose="point",
   props=[("moneybag", "follow the money")])

# ============================ WHAT IS DEBT ============================
ch("s11", "First — what even is a government debt? Because it is nothing like the credit card in your wallet.", pose="present",
   bubble="What IS a debt?", props=[("creditcard", "not this")])
ch("s12", "When you miss a credit card payment, a company comes after you. A government debt works almost the opposite way.", pose="explain",
   props=[("creditcard", "you owe a bank"), ("capitol", "a government owes… us")])
ch("s13", "When a government wants to spend more than it collects in taxes — which is basically always — it doesn't call a bank. It writes an IOU.", pose="explain",
   props=[("taxform", "taxes collected"), ("coins", "spending"), ("iou", "the gap → an IOU")])
ch("s14", "A fancy printed promise that says: lend me a hundred dollars today, and I'll pay you back a hundred and four in a year.", pose="present",
   props=[("dollar", "$100 today"), ("coins", "$104 in a year")])
callout("s15", "That promise has a name. It's called a bond. And that single piece of paper is the most important object in the entire global economy.",
        "A bond.", sub="a printed promise to repay — with interest", icon="bond")
doodle("s16", "The government prints the bond, sells it for cash it spends today, and the buyer gets paid back later, with interest.",
       ["bond", "dollar", "coins"], ["issue a bond", "cash today", "repaid + interest"], flow=True)
ch("s17", "So the real question was never how much the government owes. It's who lined up to buy all of those promises. And the answer is going to surprise you.", pose="think",
   bubble="So who buys them?", props=[("bond", "who buys these?")])

# ---- Life of one bond ----
ch("s17a", "Let's make this real. Follow a single bond, from the day it's born to the day it comes due.", pose="present",
   bubble="Follow one bond.", props=[("bond", "one bond")])
ch("s17b", "A teacher pays into her pension fund every month. That fund needs somewhere safe to grow her money.", pose="explain",
   props=[("retiree", "a teacher's pension"), ("piggybank", "grow it safely")])
ch("s17c", "So it buys a ten-thousand-dollar government bond. That cash goes straight to the government — today.", pose="explain",
   props=[("bond", "a $10,000 bond"), ("capitol", "cash to the government")])
ch("s17d", "The government spends it now — on a bridge, a soldier's paycheck, a new hospital wing.", pose="point",
   props=[("bridge", "a bridge"), ("tank", "a soldier's pay"), ("hospital", "a hospital")])
ch("s17e", "Ten years later, the bond comes due. The government has to pay the teacher's fund back — with interest.", pose="explain",
   props=[("clock", "10 years later"), ("coins", "paid back + interest")])
ch("s17f", "But it doesn't have the cash. So it sells a brand-new bond to someone else, and uses that to pay her. The debt never dies. It just changes hands.", pose="explain",
   props=[("bond", "sell a NEW bond"), ("refinance", "to pay the old one"), ("handshake", "it just changes hands")])

# ============================ MOSTLY THEMSELVES ============================
callout("s18", "Because for almost every large, rich country, the single biggest lender is itself.",
        "Mostly themselves.", icon="crowd")
ch("s19", "Not a foreign rival. Not some shadowy bank. Its own people. Its own banks. Its own pension funds. And its own central bank.", pose="explain",
   props=[("crowd", "its own people"), ("bank", "its own banks"), ("retiree", "its pensions"), ("capitol", "its central bank")])
ch("s20", "Take America's forty trillion. Everyone pictures it owed to China, across the ocean, holding the receipt.", pose="present",
   props=[("flagCN", "China?"), ("iou", "holding the receipt?")])
shot("s21", "But the overwhelming majority of it never leaves the country.", "s-us")
compare("s22", "Of that forty trillion, only around eight trillion is held by foreigners. The other thirty-plus trillion is owed right here, at home.",
        "Owed at home", "~$32T", "Owed abroad", "~$8T", licon="house", ricon="globe")
ch("s23", "It's held by American banks. By insurance companies. By pension funds that pay retirees every month. By mutual funds.", pose="explain",
   props=[("bank", "banks"), ("officetower", "insurers"), ("retiree", "pensions"), ("dollar", "mutual funds")])
ch("s24", "And by you. If you own a bond fund, or a retirement fund, you are literally one of the people the government owes money to.", pose="point",
   props=[("piggybank", "your 401(k)"), ("bond", "holds the bonds"), ("crowd", "…that's you")])
ch("s25", "Think about how strange that is. A huge share of the national debt is the government owing money to its own citizens' savings.", pose="think",
   props=[("capitol", "the government"), ("refinance", "owes…"), ("piggybank", "your savings")])
ch("s25a", "And it gets stranger. A big slice of the debt is the government literally owing money to itself.", pose="explain",
   props=[("capitol", "the government"), ("refinance", "owes…"), ("capitol", "…itself")])
ch("s25b", "For years, Social Security collected more than it paid out, and parked the surplus in — what else — government bonds.", pose="explain",
   props=[("retiree", "Social Security surplus"), ("bond", "parked in bonds")])
shot("s25ev", "That's not a theory. By law, the trust fund's surplus is held entirely in special U.S. Treasury securities.", "s-ssa")
ch("s25c", "So on paper, one arm of the government owes trillions to another arm of the very same government.", pose="shrug",
   props=[("officetower", "one arm"), ("scale", "owes…"), ("capitol", "another arm")])

# ============================ FOREIGN HOLDERS ============================
ch("s26", "Now, the foreign piece — the eight trillion — isn't who you'd guess either.", pose="explain",
   props=[("globe", "the foreign 8T"), ("scale", "not who you think")])
shot("s27", "The biggest foreign lenders to America aren't enemies plotting its downfall. For years, the top two have been Japan and China.", "s-foreign")
callout("s28", "Japan holds over a trillion dollars of American debt. China, under a trillion — and it's been selling for years.",
        "Japan #1", sub="~$1.1 trillion in U.S. debt", icon="flagJP")
ch("s29", "These are trading partners. They hold US bonds because bonds are where you park trillions of dollars safely. It's a parking lot, not a weapon.", pose="explain",
   props=[("bond", "a safe place to park $"), ("goldbar", "like a reserve"), ("bomb", "not a weapon")])

# ============================ RESERVE CURRENCY ============================
ch("s29b", "So why does the whole world keep lining up to lend America money — almost for free?", pose="think",
   props=[("globe", "the whole world"), ("flagUS", "…lends to America")])
ch("s29c", "Because the dollar is the world's reserve currency. Global trade runs on it.", pose="present",
   props=[("dollar", "the dollar"), ("globe", "runs world trade")])
ch("s29d", "Oil, ships, contracts all over the planet are priced in dollars. So almost everyone needs a pile of them.", pose="explain",
   props=[("oilbarrel", "oil priced in $"), ("globe", "contracts in $"), ("moneybag", "everyone needs dollars")])
ch("s29e", "And the safest place to keep dollars is US government bonds. So the world parks its savings inside America's debt.", pose="explain",
   props=[("goldbar", "safest store of $"), ("bond", "U.S. bonds"), ("globe", "the world parks here")])
callout("s29f", "Economists call it America's exorbitant privilege. It gets to borrow in the one currency everyone else is desperate to hold.",
        "Exorbitant privilege", sub="borrow in the money the world craves", icon="dollar")
ch("s29g", "But that privilege is not a law of nature. It lasts exactly as long as the rest of the world believes in it — and not one day longer.", pose="explain",
   props=[("dollar", "the privilege"), ("scale", "lasts while trust lasts")])

# ============================ THE CENTRAL BANK ============================
ch("s30", "But here's where it gets genuinely strange. There's one more lender — and it might be the most important of all.", pose="present",
   bubble="Now the strange part.", props=[("bank", "one more lender")])
ch("s31", "The government's own central bank. In America, the Federal Reserve.", pose="explain",
   props=[("bank", "the central bank"), ("flagUS", "the Federal Reserve")])
ch("s32", "In a crisis — 2008, and then the pandemic — central banks did something that honestly sounds made up.", pose="explain",
   props=[("chartdown", "2008 crash"), ("warning", "the pandemic")])
ch("s33", "They created brand-new money, out of thin air, and used it to buy their own government's debt.", pose="surprised", expr="surprised",
   props=[("printer", "print new money"), ("bond", "buy its own debt")])
doodle("s34", "Read that again. The Federal Reserve prints the dollars, and then lends them to the government by buying its bonds.",
       ["printer", "bank", "capitol"], ["prints the money", "lends it to…", "…the government"], flow=True)
callout("s35", "The government owes money to the institution that makes the money. At one point, the Fed alone held over five trillion dollars of US debt.",
        "$5,000,000,000,000", sub="held by the Fed itself", icon="bank")
ch("s36", "It's a little like writing yourself a check, cashing it, and calling it a loan.", pose="explain",
   props=[("cheque", "write yourself a check"), ("refinance", "…call it a loan")])
ch("s36a", "There's a catch, of course. Print too much, and the money in everyone's pocket buys less. That's inflation — and we'll come right back to it.", pose="explain",
   props=[("printer", "print too much"), ("pricetag", "money buys less"), ("warning", "…inflation")])

# ============================ JAPAN CASE STUDY ============================
ch("s37", "If that sounds unstable, look at the country that's taken it further than anyone. Japan.", pose="present",
   props=[("flagJP", "Japan")])
shot("s38", "Japan owes more than two hundred percent of everything the entire country produces in a year. By far the most of any major economy.", "s-japan")
callout("s39", "On paper, Japan should have collapsed decades ago. It hasn't. Why?",
        "234%", sub="Japan's debt vs its entire economy", icon="flagJP")
callout("s40", "Because almost all of that debt — over eighty-eight percent — is owed to the Japanese themselves.",
        "88% owed at home", sub="Japan's debt", icon="flagJP")
ch("s41", "Their own savers. Their own banks. And a central bank that owns nearly half of the entire national debt.", pose="explain",
   props=[("piggybank", "Japanese savers"), ("bank", "Japanese banks"), ("printer", "central bank owns ~half")])
ch("s42", "So Japan owes a staggering fortune, mostly to itself — and pays the interest on that fortune, mostly to itself.", pose="explain",
   props=[("flagJP", "Japan"), ("refinance", "owes itself"), ("coins", "pays itself")])
ch("s43", "Which is exactly why the scary headline number, on its own, tells you almost nothing.", pose="point",
   props=[("newspaper", "the scary headline"), ("scale", "tells you little")])
ch("s43a", "Traders have bet against Japanese debt for decades. They nicknamed it the widow-maker — because it has bankrupted almost everyone who tried.", pose="explain",
   props=[("flagJP", "Japan's debt"), ("chartdown", "the 'widow-maker'"), ("bomb", "it ruined the doubters")])

# ============================ SO WHAT'S THE PROBLEM ============================
ch("s44", "Which raises a very fair question. If the debt is mostly owed to ourselves, and the central bank can just buy it, and it never really gets paid off…", pose="shrug",
   props=[("scale", "owed to ourselves"), ("printer", "just buy it?"), ("refinance", "never paid off?")])
ch("s45", "then what, exactly, is the problem? Why does any of this matter?", pose="think",
   bubble="So what's the problem?", props=[("warning", "the catch…")])
callout("s46", "Two things. And this is where the comfortable story quietly starts to crack.",
        "Two problems.", icon="warning")

# ---- Problem one: interest ----
ch("s47", "Problem one is the interest. You can roll a debt over forever. But every single year, you still have to pay interest on it.", pose="explain",
   props=[("refinance", "roll it over"), ("clock", "every year"), ("coins", "pay interest")])
ch("s48", "For years, rates were near zero, so the bill was tiny. Then inflation hit, rates shot up — and that bill absolutely exploded.", pose="surprised", expr="surprised",
   props=[("pricetag", "inflation hit"), ("chartup", "rates shot up"), ("bomb", "…it exploded")])
ch("s48a", "Here's why that matters to you — not just the Treasury. The government doesn't borrow in a vacuum.", pose="explain",
   props=[("capitol", "the government"), ("percent", "the same rates"), ("crowd", "…reach you")])
ch("s48b", "When its borrowing costs jump, so do yours. The exact same rates ripple straight into mortgages, car loans, and credit cards.", pose="point",
   props=[("house", "your mortgage"), ("creditcard", "your credit card"), ("percent", "higher rates")])
chart("s49", "America now spends around a trillion dollars a year, just on interest. Not paying the debt down. Just renting it.",
      "U.S. interest on the debt ($ billions / year)",
      [("2015", 220), ("2018", 320), ("2020", 345), ("2022", 475), ("2024", 880), ("2025", 1000)], highlight=5)
compare("s50", "That is more than the United States spends on its entire military.",
        "Interest on the debt", "~$1T", "The entire military", "~$850B", licon="coins", ricon="tank")
shot("s50ev", "And you don't have to trust me on that — budget analysts put interest payments above national defense itself.", "s-interest")
callout("s50a", "To picture a trillion a year — that's roughly thirty thousand dollars of interest, every single second.",
        "$30,000 / second", sub="just the interest — around the clock", icon="clock")
ch("s51", "The fastest-growing line in the whole federal budget isn't defense, or healthcare. It's interest on money already spent.", pose="explain",
   props=[("tank", "defense"), ("hospital", "healthcare"), ("coins", "interest — fastest growing")])
ch("s52", "Every dollar going to interest is a dollar not going to a hospital, a school, or back in your pocket.", pose="point",
   props=[("hospital", "a hospital"), ("school", "a school"), ("piggybank", "your pocket")])

# ---- Problem two: currency ----
ch("s53", "Problem two is subtler — and it's the one that actually sinks countries. It is not how much you owe. It is what you owe it in.", pose="explain",
   bubble="It's what you owe it IN.", props=[("dollar", "which currency?")])
ch("s54", "If you borrow in a currency you print yourself — dollars, yen, pounds — you can always, technically, create more of it to pay.", pose="explain",
   props=[("printer", "print your own"), ("dollar", "dollars · yen · pounds")])
ch("s55", "You might cause inflation. You might make everyone poorer. But you can never be forced to default. You can always print.", pose="shrug",
   props=[("pricetag", "inflation, maybe"), ("printer", "but never forced to default")])
ch("s56", "But if you borrow in a currency you don't control — dollars or euros you cannot print — you can genuinely run out.", pose="handtohead", expr="worried",
   props=[("flagEU", "someone else's money"), ("printer", "can't print it"), ("warning", "it runs out")])
ch("s57", "And then one day, the lenders simply… say no.", pose="handtohead", expr="worried",
   props=[("crowd", "the lenders"), ("chartdown", "…say no")])
ch("s57b", "It even shows up in the interest rate. America borrows at around four percent. A shakier country might pay ten, fifteen, twenty.", pose="explain",
   props=[("percent", "U.S. ~4%"), ("flagAR", "others 10–20%")])
ch("s57c", "Same promise — pay you back later. But lenders charge far more when they're less sure they'll ever see the money again.", pose="explain",
   props=[("bond", "same promise"), ("percent", "higher rate = less trust")])

# ---- Defaults ----
ch("s58", "That is the line between a scary headline and a real catastrophe.", pose="explain",
   props=[("newspaper", "scary headline"), ("bomb", "real catastrophe")])
doodle("s59", "Greece. Argentina, which has defaulted nine separate times. Sri Lanka, in 2022, where people stormed the presidential palace.",
       ["flagGR", "flagAR", "flagLK"], ["Greece", "Argentina — 9 defaults", "Sri Lanka, 2022"])
ch("s60", "These are the countries that actually went bust — because they owed money they could not simply print.", pose="explain",
   props=[("flagGR", "went bust"), ("printer", "couldn't print it"), ("chain", "owed foreign money")])
ch("s60a", "And for poorer countries, this isn't a history lesson. It's happening right now.", pose="explain",
   props=[("globe", "poorer countries"), ("warning", "happening now")])
ch("s60b", "When a developing country can't pay, it goes to the IMF — the world's lender of last resort — hat in hand.", pose="explain",
   props=[("officetower", "the IMF"), ("iou", "lender of last resort")])
ch("s60c", "The rescue comes with brutal conditions. Cut spending. Raise taxes. Usually while people are already hurting.", pose="explain",
   props=[("scale", "cut spending"), ("taxform", "raise taxes"), ("warning", "people hurting")])
ch("s60d", "Zambia, Ghana, Sri Lanka — a quiet wave of defaults the headlines in rich countries barely mention.", pose="explain",
   props=[("flagLK", "Sri Lanka"), ("domino", "a wave of defaults")])
ch("s60e", "For them, the debt isn't a number on a clock. It's hospitals that close, and fuel that simply runs out.", pose="explain", expr="worried",
   props=[("hospital", "hospitals close"), ("oilbarrel", "fuel runs out")])
ch("s61", "Even a rich country can get a warning shot. In 2022, Britain announced a budget markets didn't trust — and the price of its bonds collapsed in days.", pose="surprised", expr="surprised",
   props=[("flagGB", "Britain, 2022"), ("bond", "bond prices…"), ("chartdown", "collapsed in days")])
ch("s62", "Pension funds nearly broke. The Prime Minister was gone in weeks. Not because Britain ran out of money — but because lenders briefly lost confidence.", pose="explain",
   props=[("domino", "pensions nearly broke"), ("capitol", "PM gone in weeks"), ("warning", "lost confidence")])
shot("s62ev", "The record is right there: in 2022, UK borrowing costs saw their largest single-day jump ever recorded.", "s-uk")
ch("s62b", "Here's the uncomfortable truth hiding under all of it. The real limit on a government's debt was never a law. It's confidence.", pose="explain",
   bubble="The real limit is confidence.", props=[("scale", "not a law"), ("handshake", "…it's trust")])
ch("s62c", "There's even a name for the investors who punish a reckless government by dumping its bonds: the bond vigilantes.", pose="present",
   props=[("crowd", "the bond vigilantes"), ("bond", "dump the bonds"), ("chartdown", "price crashes")])
ch("s62d", "No politician sets the ceiling. The bond market does — the day it decides it no longer believes you.", pose="point",
   props=[("capitol", "not politicians"), ("chartdown", "the market decides")])
compare("s63", "So the US and Japan, in debt they owe to themselves in money they control, live in a different universe from a country that borrowed dollars it can never make.",
        "Borrow your OWN money", "US · Japan · UK", "Borrow someone else's", "Greece · Argentina", licon="printer", ricon="warning")

# ============================ DOES IT GET PAID BACK ============================
ch("s64", "Which leaves the last question — the one everyone really means when they panic about the debt. Does any of it ever actually get paid back?", pose="think",
   bubble="Does it get paid back?", props=[("iou", "the debt"), ("scale", "ever repaid?")])
callout("s65", "The honest answer is: not really. Governments do not pay off their debt the way you pay off a loan.",
        "No.", sub="it gets rolled over — forever", icon="refinance")
ch("s66", "They refinance it endlessly — issuing brand-new bonds to cover the old ones, for as long as people keep buying them.", pose="explain",
   props=[("bond", "new bonds"), ("refinance", "cover the old ones"), ("crowd", "as long as people buy")])
ch("s66b", "Every so often, America even stages a crisis with itself. Politicians threaten not to raise the debt ceiling — not to pay bills they already approved.", pose="explain",
   props=[("capitol", "the debt ceiling"), ("warning", "threaten not to pay")])
ch("s66c", "It's theater. A US default wouldn't be because the money ran out. It would be a choice — a self-inflicted wound on the one thing holding it all up. Trust.", pose="explain",
   props=[("bomb", "self-inflicted"), ("handshake", "…breaks the trust")])
ch("s67", "Historically, they don't shrink the debt. They grow the economy around it, and let inflation quietly shrink what's owed.", pose="explain",
   props=[("factory", "grow the economy"), ("pricetag", "inflation shrinks the debt")])
ch("s67a", "And if this all feels unprecedented, it isn't. We've been here before — much, much deeper.", pose="explain",
   props=[("clock", "we've been here"), ("newspaper", "much deeper before")])
ch("s67b", "In World War Two, governments begged ordinary citizens to buy war bonds to fund the fight. People lined up to lend their savings to the state.", pose="present",
   props=[("bond", "war bonds"), ("crowd", "citizens lined up")])
ch("s67c", "America came out of that war owing more than its entire economy made in a year — more, relative to its size, than it does today.", pose="explain",
   props=[("tank", "post-war debt"), ("chartup", "bigger than today")])
ch("s67d", "It never paid that off with a big check. It grew. It inflated. And over thirty years, the mountain quietly shrank.", pose="explain",
   props=[("factory", "it grew"), ("pricetag", "it inflated"), ("refinance", "the mountain shrank")])
compare("s68", "After World War Two, America's debt was even bigger than today, compared to its economy. It never paid it off. It grew, and inflated, its way out over decades.",
        "U.S. debt after WWII", "~106% of GDP", "U.S. debt today", "~120% of GDP", licon="tank", ricon="chartup")

# ============================ THE REFRAME ============================
ch("s69", "So the debt isn't a bill from some outside villain that comes due on a Tuesday.", pose="explain",
   props=[("bomb", "not an outside villain"), ("iou", "coming due Tuesday?")])
ch("s70", "It's a giant web of promises — owed mostly to ourselves. To our pension funds. To our savings accounts. To our own future.", pose="present",
   props=[("retiree", "our pensions"), ("piggybank", "our savings"), ("baby", "our own future")])
ch("s70a", "Remember who's really on the other side of every one of these bonds. It isn't a villain in a vault.", pose="explain",
   props=[("bond", "the other side"), ("bank", "not a villain in a vault")])
ch("s70b", "It's a retired teacher's pension. A town's insurance pool. The safe corner of your own savings.", pose="explain",
   props=[("retiree", "a teacher's pension"), ("officetower", "a town's insurer"), ("piggybank", "your savings")])
ch("s70c", "Every bond is somebody's asset. Wipe out the debt overnight, and you wipe out their savings right along with it.", pose="explain",
   props=[("bond", "somebody's asset"), ("domino", "wipe it out → wipe them out")])
ch("s71", "Which means paying it down was never really the plan. And every way out has a victim.", pose="explain",
   bubble="Every exit has a victim.", props=[("scale", "who pays?")])
ch("s72", "Taxing it away takes it from someone. Inflating it away quietly shrinks everyone's savings. Defaulting on it blows up the very pensions holding the bonds.", pose="explain",
   props=[("taxform", "tax it away"), ("pricetag", "inflate it away"), ("domino", "default blows up pensions")])
ch("s72b", "And here's the quiet favorite. Inflation is a tax nobody votes for.", pose="explain",
   bubble="A tax nobody votes for.", props=[("pricetag", "inflation")])
ch("s72c", "When prices rise, the dollars the government owes are worth less. The debt quietly shrinks — and you pay the difference at the checkout.", pose="explain",
   props=[("refinance", "the debt shrinks"), ("pricetag", "prices rise"), ("piggybank", "you pay at the till")])
callout("s73", "There is no clean exit. There is only a quiet choice about who absorbs the loss.",
        "Who absorbs the loss?", icon="scale")
ch("s74", "So the real question was never whether the world can repay forty, or ninety, or a hundred trillion dollars. It can't, and it won't.", pose="explain",
   props=[("globe", "$100T owed"), ("refinance", "never repaid")])
ch("s74a", "None of this means the debt doesn't matter. It means it doesn't end with a bang. It ends with a slow, quiet transfer — from the many, to whoever's left holding the paper.", pose="explain",
   props=[("crowd", "from the many"), ("bond", "to whoever holds the paper")])
callout("s75", "The real question is who's left holding the bonds when the interest finally eats everything else.",
        "Who's holding the bond?", icon="bond")
ch("s76", "And more and more, quietly — through your pension, your bank, your retirement fund — the answer is turning out to be you.", pose="point",
   bubble="…it's you.", props=[("retiree", "your pension"), ("bank", "your bank"), ("piggybank", "your fund")])

# ============================ CTA ============================
ch("s77", "If you want more of the stuff hiding in plain sight inside the numbers, hit subscribe — and tell me which country's debt you want me to pull apart next.", pose="present",
   props=[("globe", "which country next?"), ("bond", "the next deep dive")])
ch("s78", "I do the reading. You get the parts that matter.", pose="celebrate", expr="happy",
   props=[("newspaper", "I do the reading"), ("coins", "you get what matters")])

# renumber ids sequentially (keeps side-alternation parity + clean chapters)
for i, s in enumerate(S, 1):
    s["id"] = f"s{i}"

# ============================ WRITE ============================
ep_path = pathlib.Path("episodes/examples/EP011-world-debt.json")
ep = json.loads(ep_path.read_text())
ep["voice"] = {"provider": "edge", "voiceId": "en-US-BrianNeural", "accent": "natural"}
ep["title"] = "Who The World Actually Owes"
ep["scenes"] = S
ep_path.write_text(json.dumps(ep, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/scenes.json").write_text(json.dumps(S, indent=2, ensure_ascii=False))

words = sum(len(s["narration"].split()) for s in S)
print(f"scenes={len(S)}  words={words}  est_minutes@155wpm={words/155:.1f}")
from collections import Counter
print(Counter(s["type"] for s in S))
# collect doodle names used
used = set()
for s in S:
    for p in s.get("props", []): used.add(p["name"])
    for it in s.get("items", []): used.add(it)
    if s.get("icon"): used.add(s["icon"])
    for side in ("left", "right"):
        if isinstance(s.get(side), dict) and s[side].get("icon"): used.add(s[side]["icon"])
print("doodles used:", sorted(used))
