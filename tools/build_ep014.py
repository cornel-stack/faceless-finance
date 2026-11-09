#!/usr/bin/env python3
"""EP014 — "How Enron Actually Made Its Money Disappear".
Bespoke literal-scene style: MANY short staged beats, fast cuts, mascot acting
(villain variant for the fraudsters), animated callouts + arrow diagrams,
scroll/zoom evidence. Lots of verified Wikipedia sources."""
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

def shot(id, narr, sourceId, caption=None):
    d = {"id": id, "type": "screenshot", "narration": narr, "sourceId": sourceId}
    if caption: d["caption"] = caption
    S.append(d)

def timeline(id, narr, title, events, highlight=None):
    d = {"id": id, "type": "timeline", "narration": narr, "title": title,
         "events": [{"year": y, "label": l, "icon": ic} for y, l, ic in events]}
    if highlight is not None: d["highlight"] = highlight
    S.append(d)

# ============================ ACT 1 — THE GOLDEN BOY ============================
ch("s1", "In the year 2000, this was the most admired company in America.", pose="present", props=[("crookedE", "ENRON")])
callout("s2", "Fortune magazine named it the most innovative company in America — six years in a row.", "6 years running", sub="\"America's Most Innovative Company\"", icon="trophy")
ch("s2b", "At the top sat the founder, Ken Lay — a preacher's son turned energy tycoon, with friends in the highest offices in Washington.", pose="present", props=[("capitol", "Ken Lay"), ("crookedE", "…the founder")])
ch("s2c", "His protégé, Jeff Skilling, was the true believer — the man who'd turn a boring energy firm into a financial magic act.", pose="present", variant="villain", props=[("magichat", "Jeff Skilling"), ("crookedE", "…the believer")])
ch("s3", "Enron. An energy company from Houston that seemed to turn everything it touched into gold.", pose="explain", props=[("oilbarrel", "energy"), ("coins", "…into gold")])
callout("s4", "Its stock hit ninety dollars. The company was worth seventy billion. The seventh biggest in the country.", "$70 billion", sub="Enron at its peak", icon="chartup")
ch("s5", "Wall Street loved it. Harvard taught it. Everyone wanted a piece.", pose="explain", props=[("bank", "Wall Street"), ("crowd", "everyone wanted in")])
ch("s6", "And then, in under a month, all of it simply… vanished.", pose="surprised", expr="surprised", props=[("crookedE", "ENRON"), ("warning", "…gone")])
callout("s7", "Enron filed the largest bankruptcy in American history. Twenty thousand people lost their jobs — and their savings.", "20,000 jobs", sub="gone, almost overnight", icon="crowd")
ch("s8", "So where did seventy billion dollars actually go?", pose="think", bubble="Where did $70B go?", props=[("coins", "$70 billion"), ("warning", "…vanished?")])
ch("s9", "Here's the twist that still messes with people. The money didn't go anywhere. It was never really there.", pose="explain", props=[("magichat", "the money…"), ("bubble", "…was never real")])
title("s10", "Let's follow money that never existed — all the way down.", "How Enron Made Its Money Disappear", kicker="The $70 billion magic trick", sub="It's not where the money went. It's that it was never there.")

shot("s10a2", "And this isn't me being dramatic — the admiration is right there in the public record.", "wiki-enron")
ch("s10a3", "Enron threw the best parties, hired the top graduates, and bragged it had reinvented business itself.", pose="present", props=[("trophy", "the best & brightest"), ("crookedE", "…'reinvented business'")])
ch("s10a4", "The more untouchable a company feels, the fewer questions anyone dares to ask. That's lesson one.", pose="explain", props=[("crookedE", "untouchable"), ("warning", "…so nobody asks")])
callout("s10a5", "And it all rested on one magic number — the stock price. Keep it up, and the illusion holds.", "Keep the stock up.", sub="…or the whole thing falls", icon="chartup")
ch("s10b", "Enron didn't just sell oil and gas. It claimed it could trade anything — electricity, weather, even internet bandwidth.", pose="explain", props=[("oilbarrel", "energy"), ("ticker", "…trade anything"), ("globe", "even bandwidth")])
ch("s10c", "It called itself the company that would run the world's energy. And for a while, the whole world believed it.", pose="present", props=[("globe", "run the world's energy"), ("crookedE", "…and we believed")])
ch("s10d", "Inside, Jeff Skilling ran it like a pressure cooker. Every year, the bottom ten percent of staff were simply fired.", pose="explain", variant="villain", props=[("crowd", "rank the staff"), ("warning", "…bottom 10% fired")])
ch("s10e", "They called it rank and yank. It bred brilliant people and ruthless sharks in equal measure.", pose="explain", props=[("scale", "rank & yank"), ("warning", "…geniuses & sharks")])
ch("s10f", "And behind the genius image, Enron was quietly gaming an entire state.", pose="explain", variant="villain", props=[("globe", "a whole state"), ("warning", "…being gamed")])
ch("s10g", "In 2000 and 2001, its traders helped trigger blackouts across California — then bet on the chaos they caused.", pose="explain", variant="villain", props=[("warning", "California blackouts"), ("coins", "…bet on the chaos")])
ch("s10h", "On recorded calls, traders joked about taking money from 'Grandma Millie.' That was the culture under the trophies.", pose="explain", props=[("ticker", "'Grandma Millie'"), ("trophy", "…under the awards")])
ch("s10i", "But the stock kept climbing. So nobody looked too hard.", pose="explain", props=[("chartup", "stock climbs"), ("crowd", "…nobody looks")])

# ============================ ACT 2 — TRICK 1: MARK-TO-MARKET ============================
ch("s11", "To pull this off, Enron needed two magic tricks. Here's the first.", pose="present", bubble="Trick #1", props=[("magichat", "trick one")])
ch("s12", "Normally, a company earns money, then writes it down. Simple.", pose="explain", props=[("coins", "earn it"), ("paystub", "…then book it")])
ch("s13", "Enron's CEO, Jeff Skilling, had a better idea. Why wait for the money?", pose="present", variant="villain", props=[("magichat", "why wait?")])
ch("s14", "It's called mark-to-market accounting. Sign a twenty-year deal today…", pose="explain", variant="villain", props=[("iou", "a 20-year deal"), ("magichat", "mark-to-market")])
ch("s15", "…and book all twenty years of imagined profit, right now, as if it already happened.", pose="explain", variant="villain", props=[("magichat", "conjure the profit"), ("coins", "…today")])
shot("s16", "This is a real, legitimate method — for things that actually have a market price. Enron used it on deals that didn't.", "wiki-mtm")
ch("s17", "Guess at a future profit. Declare it real. Count it today. The cash? That part was optional.", pose="explain", variant="villain", props=[("magichat", "guess a profit"), ("coins", "cash: optional")])
callout("s18", "So on paper, Enron grew every single quarter. On paper.", "On paper.", sub="the profits were projections, not cash", icon="newspaper")
ch("s19", "If the real profit never showed up? Didn't matter. It was already counted.", pose="shrug", variant="villain", props=[("chartup", "booked already"), ("warning", "…never arrived")])
ch("s20", "Wall Street saw the growth and cheered. The stock climbed. And the trap was set.", pose="explain", props=[("bank", "Wall St. cheers"), ("chartup", "stock climbs")])

ch("s20b", "To see how insane this gets, take one real deal. Enron teamed up with Blockbuster to stream movies to your home.", pose="explain", props=[("newspaper", "the Blockbuster deal"), ("officetower", "…stream movies")])
ch("s20c", "This was years before streaming even worked. The service barely launched.", pose="explain", props=[("warning", "streaming? not yet"), ("chartdown", "…it flopped")])
callout("s20d", "Enron still booked over a hundred million dollars of profit from it. The project delivered almost nothing.", "$110 million", sub="\"profit\" from a deal that flopped", icon="magichat")
ch("s20e", "The movies never streamed. The profit was already counted. That is mark-to-market in one story.", pose="explain", props=[("magichat", "profit booked"), ("warning", "…product never came")])
ch("s20f", "And regulators had actually blessed the method back in 1992. A legitimate tool…", pose="explain", props=[("capitol", "SEC blessed it, '92"), ("scale", "a real tool…")])
ch("s20g", "…handed to people who decided that imagination counted as income.", pose="explain", variant="villain", props=[("magichat", "…imagination"), ("coins", "= income")])
ch("s20h", "Every quarter, Skilling needed a bigger number. So every quarter, the imagined profits grew.", pose="explain", variant="villain", props=[("chartup", "bigger each quarter"), ("magichat", "…invent more")])
ch("s20i", "It was a treadmill, speeding up, with no off switch.", pose="explain", props=[("refinance", "a treadmill"), ("warning", "…no off switch")])
ch("s20j", "And there was no room to miss. Wall Street expected Enron to beat its targets every single quarter, forever.", pose="explain", props=[("bank", "beat EVERY quarter"), ("warning", "…forever")])
ch("s20k", "Miss once, and the stock drops, the shells wobble, the trick is exposed. So they never missed. They simply couldn't afford to.", pose="explain", variant="villain", props=[("chartdown", "miss = exposed"), ("magichat", "…so they faked it")])

# ============================ ACT 3 — TRICK 2: HIDING THE DEBT ============================
ch("s21", "But fake profits plus real spending equals a very real problem. Debt. Mountains of it.", pose="explain", props=[("coins", "fake profit"), ("iou", "+ real debt"), ("warning", "…a problem")])
ch("s22", "And debt scares investors. If the debt shows, the magic stops. So Enron had to hide it.", pose="explain", props=[("iou", "the debt"), ("crowd", "investors panic"), ("warning", "…hide it")])
ch("s23", "Enter the second magician. The CFO, Andrew Fastow.", pose="present", variant="villain", props=[("shellbox", "the CFO, Fastow")])
ch("s24", "His solution? Invent companies. Fake ones. Hundreds, then thousands of them.", pose="explain", variant="villain", props=[("shellbox", "shell companies"), ("shellbox", "…thousands")])
callout("s25", "Enron built around three thousand of these shell entities. With names like LJM, Chewco, and Raptor.", "~3,000 shells", sub="LJM · Chewco · Raptor", icon="shellbox")
shot("s26", "They're called special-purpose entities — real tools, bent into a hiding place.", "wiki-spe")
doodle("s27", "Here's the move. Enron shoves its debt and its worst assets into a shell company…", ["crookedE", "shellbox", "iou"], ["ENRON", "→ a shell", "→ debt hidden"], flow=True)
ch("s28", "…and poof — the debt is off Enron's books. The company looks clean. Healthy. Unstoppable.", pose="explain", props=[("shellbox", "debt vanishes"), ("crookedE", "…Enron looks clean")])
ch("s29", "It's like opening a credit card in a fake friend's name, buying everything, then telling the bank you owe nothing.", pose="explain", variant="villain", props=[("creditcard", "fake friend's card"), ("bank", "…'I owe zero'")])
ch("s30", "Technically true. Completely insane. And for a while, completely legal-looking.", pose="shrug", variant="villain", props=[("scale", "'technically true'"), ("warning", "…insane")])

ch("s30b", "And Fastow didn't only build the shells to help Enron. He built them to help himself.", pose="explain", variant="villain", props=[("shellbox", "the shells"), ("coins", "…help himself")])
ch("s30c", "He personally ran some of the funds that were doing deals with Enron. He sat on both sides of the table.", pose="explain", variant="villain", props=[("scale", "both sides"), ("shellbox", "…he ran LJM")])
callout("s30d", "Fastow secretly pocketed around forty-five million dollars for himself off these deals.", "$45 million", sub="Fastow's personal cut", icon="coins")
ch("s30e", "And the board knew. They voted to waive their own ethics rules — twice — to let him do it.", pose="explain", props=[("capitol", "the board knew"), ("scale", "…waived ethics, twice")])
ch("s30f", "The shells got cartoon-villain names. Chewco, after Chewbacca. Raptor, after Jurassic Park. An inside joke.", pose="explain", props=[("shellbox", "Chewco · Raptor"), ("bubble", "…an inside joke")])
doodle("s30g", "The pattern, three thousand times: a bad asset goes in, the debt disappears, and Enron keeps smiling.", ["iou", "shellbox", "crookedE"], ["bad asset in", "→ debt hidden", "→ Enron 'clean'"], flow=True)
ch("s30h", "A labyrinth of three thousand shells, built specifically so nobody could ever follow the money.", pose="explain", props=[("shellbox", "×3,000"), ("warning", "…a labyrinth")])
ch("s30i", "Think of each shell as a closet. Enron stuffed its debt and its failures inside, and shut the doors.", pose="explain", props=[("shellbox", "a closet"), ("iou", "…shove the debt in")])
ch("s30j", "Then it photographed only the tidy rooms, and showed Wall Street the pictures.", pose="explain", props=[("newspaper", "show the tidy rooms"), ("bank", "…Wall Street applauds")])
ch("s30k", "But every closet was real debt that still had to be paid. Someone, someday, would open a door.", pose="explain", props=[("shellbox", "still real debt"), ("warning", "…someone opens it")])
ch("s30l", "As long as the stock kept rising, the doors stayed shut and the music kept playing.", pose="explain", props=[("chartup", "stock rises"), ("padlock", "…doors stay shut")])

# ============================ ACT 4 — THE HOUSE OF CARDS ============================
ch("s31", "But every shell had one fatal flaw. What was holding them up?", pose="think", bubble="What holds it up?", props=[("shellbox", "the shells"), ("warning", "…propped by what?")])
ch("s32", "Enron's own stock. The shells were backed by Enron shares.", pose="explain", props=[("shellbox", "the shells"), ("crookedE", "…backed by Enron stock")])
doodle("s33", "Which created a perfect loop. High stock props up the shells, the shells hide the debt, the clean books push the stock higher.", ["chartup", "shellbox", "crookedE"], ["stock high", "→ shells hold", "→ stock higher"], flow=True)
ch("s34", "Round and round. It looked like a money machine. It was a house of cards.", pose="explain", props=[("refinance", "the loop"), ("houseofcards", "…a house of cards")])
ch("s35", "And it all depended on one thing never happening: the stock could never fall.", pose="explain", props=[("crookedE", "the stock"), ("warning", "…can never drop")])
ch("s36", "Someone was supposed to catch this. The auditor. Arthur Andersen — one of the five biggest accounting firms on Earth.", pose="explain", props=[("officetower", "Arthur Andersen"), ("scale", "the auditor")])
callout("s37", "Enron paid Andersen around a million dollars a week. For that price, the books always looked fine.", "$1M / week", sub="what Enron paid its auditor", icon="coins")
shot("s38", "The watchdog was on the payroll. And a watchdog that's being fed doesn't bark.", "wiki-andersen")

ch("s38b", "And the conflict ran deeper than fees. Andersen also sold Enron lucrative consulting on the side.", pose="explain", props=[("officetower", "Andersen"), ("coins", "audit + consulting")])
ch("s38c", "So the referee checking the books was also being paid to help build them.", pose="explain", props=[("scale", "the referee…"), ("warning", "…playing for the team")])
ch("s38d", "Wall Street analysts mostly kept screaming 'buy' — all the way down.", pose="explain", props=[("bank", "analysts: BUY!"), ("chartdown", "…all the way down")])
ch("s38e", "One analyst dared to ask Skilling a simple question on a public call. Where's the actual cash flow?", pose="explain", props=[("ticker", "'where's the cash?'")])
ch("s38f", "Skilling called him a word we can't say here — live, on the earnings call. That was the attitude.", pose="explain", variant="villain", props=[("warning", "'how DARE you'"), ("bubble", "…on a live call")])
ch("s38g", "Questioning the magic wasn't just unwelcome. It was dangerous to your career.", pose="explain", props=[("warning", "don't question it"), ("crookedE", "…or else")])
callout("s38h", "Auditors, analysts, the board — almost everyone was paid to look the other way. And almost everyone did.", "Look away.", sub="everyone who could've stopped it", icon="warning")
callout("s38i", "By 2001, Enron reported a hundred billion dollars in revenue. On paper, one of the biggest companies alive.", "$100 billion", sub="Enron's reported revenue", icon="crookedE")
ch("s38j", "But strip out the make-believe profits and the hidden-debt shells, and the real company was hollow.", pose="explain", props=[("magichat", "remove the illusions"), ("houseofcards", "…hollow inside")])
ch("s38k", "A hundred-billion-dollar skyscraper, built on a foundation of absolutely nothing.", pose="explain", props=[("officetower", "a $100B tower"), ("houseofcards", "…on nothing")])

# ============================ ACT 5 — THE COLLAPSE ============================
ch("s38l", "Then, in August 2001, the mastermind did something bizarre. Skilling abruptly resigned, citing 'personal reasons.'", pose="explain", variant="villain", props=[("handcuffs", "Skilling quits"), ("warning", "'personal reasons'")])
ch("s38m", "The captain stepped off the ship months before it sank. People noticed. The questions got louder.", pose="explain", props=[("warning", "captain jumps ship"), ("crowd", "…questions grow")])
ch("s39", "Then, in 2001, the one forbidden thing happened. The stock started to slip.", pose="explain", props=[("chartdown", "2001: it slips"), ("warning", "…the forbidden thing")])
ch("s40", "And the loop ran in reverse. Lower stock meant the shells needed propping, which meant selling more stock, which pushed it lower.", pose="explain", props=[("chartdown", "stock down"), ("shellbox", "shells wobble"), ("chartdown", "…down more")])
ch("s41", "Inside the company, one executive saw it coming. Her name was Sherron Watkins.", pose="present", props=[("warning", "a whistleblower"), ("newspaper", "Sherron Watkins")])
ch("s42", "She warned the chairman, Ken Lay, that Enron might implode in a wave of accounting scandals.", pose="explain", props=[("warning", "'we'll implode'"), ("crookedE", "…accounting scandals")])
shot("s43", "She was right. And the clock was already running out.", "wiki-watkins")
callout("s44", "In October 2001, Enron admitted it had overstated profits by hundreds of millions — and hidden a mountain of debt.", "$600 million", sub="in \"profit\" that wasn't real", icon="magichat")
timeline("s45", "From here, the fall took just weeks.", "The collapse of 2001", [("Aug", "Skilling abruptly quits", "handcuffs"), ("Oct", "profits restated, SEC probe", "warning"), ("Nov", "rescue deal collapses", "chartdown"), ("Dec 2", "largest bankruptcy ever", "crookedE")], highlight=3)
callout("s46", "The stock went from ninety dollars to under one dollar in a matter of weeks.", "$90 → $0.26", sub="Enron's stock, 2001", icon="chartdown")
ch("s47", "And as the walls closed in, Arthur Andersen did something unforgivable. It started shredding.", pose="explain", props=[("shredder", "the auditor shreds"), ("warning", "…the evidence")])
callout("s48", "Tons of Enron documents, fed through the shredders. The cover-up of the cover-up.", "The shredding.", sub="Arthur Andersen destroys evidence", icon="shredder")
shot("s49", "Andersen was convicted of obstruction. A firm with eighty-five thousand employees worldwide — gone.", "wiki-scandal")

ch("s49b", "The real trigger was boring and technical. Enron's credit rating got cut to junk.", pose="explain", props=[("chartdown", "cut to junk"), ("warning", "…the trigger")])
ch("s49c", "That one downgrade forced billions of the hidden debt to suddenly come due.", pose="explain", props=[("iou", "hidden debt"), ("warning", "…now DUE")])
ch("s49d", "A rival, Dynegy, offered to buy Enron and save it — then opened the books and ran.", pose="explain", props=[("officetower", "a rescue offer"), ("warning", "…then ran")])
ch("s49e", "Because once you read the fine print, there was nothing to buy. Just debt wearing a company costume.", pose="explain", props=[("iou", "just debt"), ("crookedE", "…in a costume")])
callout("s49f", "Sixty-three billion dollars in assets — filed into the largest bankruptcy America had ever seen.", "$63 billion", sub="Enron's assets at bankruptcy", icon="crookedE")
ch("s49g", "The most innovative company in America turned out to be innovative at exactly one thing. Hiding the truth.", pose="explain", props=[("trophy", "'most innovative'"), ("magichat", "…at hiding")])
ch("s49h", "When the truth finally leaked, it didn't trickle. It poured. Each disclosure forced the next.", pose="explain", props=[("chartdown", "the dam breaks"), ("shellbox", "…one lie, then ten")])
ch("s49i", "Investors who worshipped Enron on Monday were dumping it by Friday.", pose="explain", props=[("crowd", "worship → dump"), ("chartdown", "…in days")])
ch("s49j", "A company that took sixteen years to build unraveled in about sixteen days.", pose="explain", props=[("calendar", "16 years to build"), ("chartdown", "…16 days to fall")])

# ============================ ACT 6 — WHO PAID, WHO WALKED ============================
ch("s50", "So who actually paid for all of it? Start with the employees.", pose="think", bubble="Who paid?", props=[("crowd", "the employees")])
ch("s51", "They'd been encouraged to stuff their retirement savings full of Enron stock.", pose="explain", props=[("piggybank", "their 401(k)s"), ("crookedE", "…all Enron stock")])
callout("s52", "When it collapsed, around two billion dollars in employee pensions evaporated.", "$2 billion", sub="in employee retirement savings — gone", icon="piggybank")
ch("s53", "Worse, as the stock crashed, many were locked and forbidden from selling. They watched their futures burn in real time.", pose="handtohead", expr="worried", props=[("padlock", "locked from selling"), ("chartdown", "…watching it burn")])
ch("s54", "The executives? They had sold near the top.", pose="explain", variant="villain", props=[("coins", "they sold at the top")])
callout("s55", "Enron insiders cashed out more than a billion dollars in stock before the collapse.", "$1 billion+", sub="executive stock sales before the crash", icon="coins")
ch("s56", "But this time, the story didn't end in a corner office. It ended in a courtroom.", pose="explain", props=[("scale", "a courtroom"), ("handcuffs", "…for once")])
shot("s57", "CEO Jeff Skilling went to federal prison. He'd ultimately serve over a decade.", "wiki-skilling")
ch("s58", "CFO Andrew Fastow got six years — after cutting a deal and turning on the others.", pose="explain", props=[("handcuffs", "Fastow: 6 years"), ("shellbox", "…he built the shells")])
callout("s59", "The founder, Ken Lay, was convicted on every count he faced — then died before he could be sentenced.", "Guilty.", sub="Ken Lay, founder & chairman", icon="prison")
shot("s60", "The scandal was so severe it rewrote the law — the Sarbanes-Oxley Act, passed to stop the next Enron.", "wiki-sox")

ch("s60b", "Picture a janitor or an engineer who did everything right. Saved for thirty years — all in Enron stock, because the company said to.", pose="explain", props=[("crowd", "did it right"), ("piggybank", "…all Enron stock")])
ch("s60c", "In a few weeks, thirty years of savings became nothing. While the people who knew had already cashed out.", pose="handtohead", expr="worried", props=[("chartdown", "30 yrs → $0"), ("coins", "…they cashed out")])
ch("s60d", "And remember California? Ordinary families paid higher power bills so traders could win a bet.", pose="explain", props=[("crowd", "Californians paid"), ("coins", "…for the bet")])
ch("s60e", "The human cost never fits on a balance sheet. But it was the realest number in the whole story.", pose="explain", props=[("scale", "the human cost"), ("crowd", "…the realest number")])
ch("s60f", "And a workforce of eighty-five thousand at Andersen — most of whom did nothing wrong — lost their jobs too.", pose="explain", props=[("officetower", "Andersen"), ("crowd", "85,000 jobs gone")])
ch("s60g", "There's a famous name for the whole saga: 'The Smartest Guys in the Room.'", pose="present", props=[("officetower", "'smartest guys…'"), ("bubble", "…in the room")])
ch("s60h", "They really were brilliant. That's what makes it scary. Brilliance pointed at deception is still deception.", pose="explain", props=[("scale", "brilliant…"), ("warning", "…but deceiving")])
ch("s60i", "Smart people didn't prevent this fraud. Smart people built it.", pose="explain", variant="villain", props=[("shredder", "the smart ones"), ("crookedE", "…built the fraud")])

# ============================ ACT 7 — THE LESSON ============================
ch("s61", "So let's go back to the question. Where did the seventy billion dollars go?", pose="think", bubble="So… where'd it go?", props=[("coins", "$70 billion"), ("magichat", "…?")])
ch("s62", "It didn't go anywhere. There was no vault, no secret island. The profit was invented, and the debt was hidden.", pose="explain", props=[("magichat", "invented profit"), ("shellbox", "hidden debt")])
ch("s63", "Enron's real product was never energy. It was a story. A story of endless growth that Wall Street desperately wanted to believe.", pose="explain", props=[("newspaper", "the real product: a story"), ("crowd", "…everyone believed it")])
ch("s64", "And the story worked for years because almost nobody could understand how Enron actually made money.", pose="explain", props=[("crookedE", "too complex"), ("warning", "…nobody understood it")])
ch("s65", "Which, it turns out, was the entire point. The complexity wasn't a side effect. It was the hiding place.", pose="explain", props=[("shellbox", "complexity"), ("magichat", "…was the trick")])
callout("s66", "That's the lesson that outlives Enron. If a company is too complicated to explain, maybe that's the strategy.", "Too complex?", sub="…maybe that's the point", icon="warning")
ch("s67", "If nobody can tell you in one plain sentence how the money is made, be very, very careful. Enron couldn't. And it was the most admired company in America.", pose="explain", props=[("crookedE", "'most admired'"), ("houseofcards", "…a house of cards")])
ch("s67b", "And this twenty-year-old story still matters, because the trick never retired. It just changes costume.", pose="explain", props=[("calendar", "20 years on"), ("magichat", "…same trick")])
ch("s67c", "2008 did it with mortgages sliced so fine that nobody could price them.", pose="explain", props=[("house", "2008"), ("shellbox", "…too complex to price")])
ch("s67d", "Crypto did it with tokens and exchanges almost no one truly understood.", pose="explain", props=[("ticker", "crypto"), ("bubble", "…who understood it?")])
ch("s67d2", "Two decades later, a crypto exchange called FTX did almost the identical dance — and vanished just as fast.", pose="explain", props=[("ticker", "FTX, 2022"), ("bubble", "…the same dance")])
ch("s67d3", "Different industry, identical pattern: a genius founder, dazzling complexity, and customer money that quietly wasn't there.", pose="explain", props=[("magichat", "same pattern"), ("warning", "…money gone")])
ch("s67e", "Every era gets its own Enron. The red flag is always the same: dazzling complexity, and profits nobody can quite explain.", pose="explain", props=[("warning", "complexity"), ("magichat", "…unexplained profit")])
ch("s67f", "A real business can be explained on a napkin. Enron needed a maze of three thousand shells. That was the tell.", pose="explain", props=[("paystub", "napkin-simple?"), ("shellbox", "…or a maze of 3,000?")])
ch("s67g", "So next time a company is 'too complex to explain,' picture a crooked letter E.", pose="explain", props=[("crookedE", "too complex?"), ("warning", "…remember Enron")])
ch("s67h", "Picture three thousand shell companies, a hat full of pretend profit, and twenty thousand ruined lives.", pose="explain", props=[("shellbox", "3,000 shells"), ("magichat", "pretend profit"), ("crowd", "20,000 lives")])
ch("s68", "The magic trick isn't making money appear. It's making you stop asking where it came from.", pose="explain", props=[("magichat", "the real trick"), ("bubble", "…stop asking")])
ch("s68b", "Enron didn't lose seventy billion dollars. It proved seventy billion was never really there to begin with.", pose="explain", props=[("coins", "$70 billion"), ("magichat", "…never there")])
ch("s69", "If this made the smartest guys in the room look a little less smart, hit subscribe — and tell me which collapse you want me to pull apart next.", pose="present", props=[("crookedE", "which fraud next?"), ("newspaper", "the next deep dive")])
ch("s70", "I do the reading. You get the parts that matter.", pose="celebrate", expr="happy", props=[("newspaper", "I do the reading"), ("coins", "you get what matters")])

# renumber
for i, s in enumerate(S, 1):
    s["id"] = f"s{i}"

SOURCES = [
    {"id": "wiki-enron", "name": "Enron (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Enron", "quote": "most innovative"},
    {"id": "wiki-mtm", "name": "Mark-to-market accounting (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Mark-to-market_accounting", "quote": "mark-to-market"},
    {"id": "wiki-spe", "name": "Special-purpose entity (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Special-purpose_entity", "quote": "special-purpose"},
    {"id": "wiki-andersen", "name": "Arthur Andersen (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Arthur_Andersen", "quote": "shredding"},
    {"id": "wiki-watkins", "name": "Sherron Watkins (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Sherron_Watkins", "quote": "Watkins"},
    {"id": "wiki-scandal", "name": "Enron scandal (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Enron_scandal", "quote": "mark-to-market"},
    {"id": "wiki-skilling", "name": "Jeffrey Skilling (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Jeffrey_Skilling", "quote": "Skilling"},
    {"id": "wiki-sox", "name": "Sarbanes–Oxley Act (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Sarbanes%E2%80%93Oxley_Act", "quote": "Sarbanes"},
]

YT = {
    "title": "How Enron Actually Made Its Money Disappear",
    "alts": ["Enron: The $70 Billion Magic Trick", "How Enron Faked $70 Billion (and Nobody Noticed)"],
    "hook": "In 2000, Enron was the most admired company in America — $90 stock, $70 billion, \"most innovative\" six years running. A year later it was the biggest bankruptcy in US history. So where did $70 billion go? The unsettling answer: nowhere. It was never there. Here's exactly how two accounting tricks — inventing profit and hiding debt — made the money disappear, fully cited.",
    "bullets": [
        "Trick 1: mark-to-market accounting — booking imaginary future profits today",
        "Trick 2: ~3,000 shell companies (LJM, Chewco, Raptor) to hide the debt",
        "Why the whole thing was a house of cards propped up by Enron's own stock",
        "Arthur Andersen, the $1M-a-week auditor that shredded the evidence",
        "Who paid ($2B in employee pensions) and who walked ($1B in insider sales)",
        "The lesson that outlives Enron: when it's too complex to explain, that's the point",
    ],
    "tags": [
        "enron", "enron scandal", "how enron collapsed", "enron explained", "mark to market",
        "special purpose entity", "arthur andersen", "jeff skilling", "andrew fastow", "ken lay",
        "accounting fraud", "corporate fraud", "largest bankruptcy", "sarbanes oxley",
        "house of cards", "wall street fraud", "economics explained", "finance documentary",
        "Napkin Numbers",
    ],
    "thumbnail": {"hookTop": "HOW ENRON HID", "hookBot": "$70 BILLION", "napkinNumber": "$0", "napkinSub": "…where'd it go?", "deco": "crookedE"},
    "chapters": [
        ["the most admired company", "The golden boy"],
        ["two magic tricks", "Trick 1 — inventing profit"],
        ["fake profits plus real spending", "Trick 2 — hiding the debt"],
        ["every shell had one fatal flaw", "The house of cards"],
        ["the one forbidden thing happened", "The collapse"],
        ["who actually paid", "Who paid, who walked"],
        ["back to the question", "The lesson"],
    ],
}

ep = {
    "id": "EP014", "series": "Napkin Numbers", "title": "How Enron Made Its Money Disappear",
    "slug": "how-enron-made-money-disappear", "market": "US", "language": "en",
    "voice": {"provider": "edge", "voiceId": "en-US-BrianNeural", "accent": "natural"},
    "note": "Enron — literal-scene style, fast cuts, scroll/zoom evidence.",
    "scenes": S, "sources": SOURCES, "youtube": YT,
}
pathlib.Path("episodes/examples/EP014-enron.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/scenes.json").write_text(json.dumps(S, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/thumb.json").write_text(json.dumps(YT["thumbnail"], indent=2))

words = sum(len(s["narration"].split()) for s in S)
from collections import Counter
print(f"scenes={len(S)} words={words} est={(words/171.3*60 + len(S)*0.5)/60:.2f} min")
print(Counter(s["type"] for s in S))
