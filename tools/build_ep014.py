#!/usr/bin/env python3
"""EP014 v2 — "How Enron Made Its Money Disappear" in the PROPER Casual-Finance
style (from the full-video study): the mascot appears in only ~25% of shots; the
default frame is a DIAGRAM, a real PHOTO, an OBJECT metaphor, a SCREENSHOT, a
CHART, or a big CALLOUT. Fast beats. Lots of verified evidence."""
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

def obj(id, narr, items, labels=None, flow=False, caption=None):
    """Big full-frame metaphor doodle(s) — NO arrows (that was the over-used device)."""
    cap = caption or (" · ".join(labels) if labels else None)
    d = {"id": id, "type": "stage", "narration": narr, "icons": items}
    if cap: d["caption"] = cap
    S.append(d)

def stage(id, narr, motif, caption=None, kicker=None, stampText=None, accent=False):
    """A full-frame ANIMATED metaphor (collapse/drain/vanish/dominoes/crash/stamp)."""
    d = {"id": id, "type": "stage", "narration": narr, "motif": motif}
    if caption: d["caption"] = caption
    if kicker: d["kicker"] = kicker
    if stampText: d["stampText"] = stampText
    if accent: d["accent"] = True
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

def image(id, narr, src, caption=None, label=None, circle=False, mug=False):
    d = {"id": id, "type": "image", "narration": narr, "src": src}
    if caption: d["caption"] = caption
    if label: d["label"] = label
    if circle: d["circle"] = True
    if mug: d["mug"] = True
    S.append(d)

def diagram(id, narr, nodes, edges, title=None):
    d = {"id": id, "type": "diagram", "narration": narr,
         "nodes": [{"id": n[0], "label": n[1], "icon": n[2], "x": n[3], "y": n[4], **({"cross": True} if len(n) > 5 and n[5] else {})} for n in nodes],
         "edges": [{"from": e[0], "to": e[1], **({"label": e[2]} if len(e) > 2 else {})} for e in edges]}
    if title: d["title"] = title
    S.append(d)

# ============================ ACT 1 — THE GOLDEN BOY ============================
image("s1", "In the year 2000, this was the most admired company in America.", "img/enronhq.png", caption="The most admired company in America", label="ENRON")
callout("s2", "Fortune magazine named Enron the most innovative company in America — six years in a row.", "6 years running", sub="\"America's Most Innovative Company\"", icon="trophy")
obj("s3", "An energy company out of Houston that seemed to turn everything it touched into gold.", ["oilbarrel", "coins"], ["energy", "…into gold"], flow=True)
callout("s4", "Its stock hit ninety dollars. The company was worth seventy billion. The seventh biggest in the country.", "$70 billion", sub="Enron at its peak", icon="chartup")
obj("s4b", "To put that in perspective — Enron was worth more than Disney, more than Ford. A titan of the American economy.", ["officetower", "crookedE"], ["bigger than Disney", "…bigger than Ford"], flow=True)
obj("s4c", "Pension funds held it. Grandparents owned it. It was the definition of a safe, blue-chip, can't-lose stock.", ["piggybank", "crookedE"], ["in every pension", "…'can't lose'"], flow=True)
image("s5", "At the top sat the founder — Kenneth Lay. A preacher's son turned energy tycoon, with friends in the highest offices in Washington.", "img/lay.jpg", caption="Kenneth Lay — founder & chairman", label="KEN LAY")
image("s6", "And his protégé, Jeff Skilling. The true believer, the CEO who'd turn a boring energy firm into a financial magic act.", "img/skilling.jpg", caption="Jeffrey Skilling — CEO", label="SKILLING", mug=True)
ch("s7", "Wall Street loved them. Harvard taught them. Everyone wanted a piece.", pose="explain", props=[("bank", "Wall Street"), ("crowd", "everyone wanted in")])
callout("s8", "Then, in under a month, all of it simply vanished. The largest bankruptcy in American history.", "Largest ever", sub="Enron's bankruptcy, Dec 2001", icon="chartdown")
callout("s9", "Twenty thousand people lost their jobs — and their life savings.", "20,000 jobs", sub="gone, almost overnight", icon="crowd")
ch("s10", "So where did seventy billion dollars actually go? Here's the twist. It didn't go anywhere. It was never really there.", pose="think", bubble="Where did $70B go?", props=[("magichat", "…never there?")])
title("s11", "Let's follow money that never existed — all the way down.", "How Enron Made Its Money Disappear", kicker="The $70 billion magic trick", sub="It's not where the money went. It's that it was never there.")

obj("s10b", "Enron didn't just sell oil and gas. It claimed it could trade anything — electricity, weather, even internet bandwidth.", ["oilbarrel", "ticker", "globe"], ["energy", "trade anything", "even bandwidth"], flow=True)
shot("s10c", "And this isn't hype I'm adding — the admiration is right there in the public record.", "wiki-enron")
obj("s10d", "Inside, Skilling ran it like a pressure cooker. Every year, the bottom ten percent of staff were simply fired.", ["crowd", "warning"], ["rank & yank", "…bottom 10% cut"], flow=True)
shot("s10e", "And behind the genius image, Enron was quietly gaming an entire state. In 2000 and 2001, its traders helped trigger blackouts across California.", "wiki-calcrisis")
obj("s10f", "Then they bet on the chaos they'd caused. On tape, traders joked about taking money from 'Grandma Millie.'", ["ticker", "coins"], ["bet on the blackouts", "…'Grandma Millie'"], flow=True)
callout("s10g", "But the stock kept climbing. So nobody looked too hard. It all rested on one magic number — the stock price.", "Keep the stock up.", sub="…or the whole illusion falls", icon="chartup")
obj("s10h", "Its trading floor looked like NASA mission control. Its name was on a baseball stadium. It felt untouchable.", ["officetower", "trophy"], ["a NASA trading floor", "…name on a stadium"], flow=True)
callout("s10i", "And the more untouchable a company feels, the fewer questions anyone dares to ask.", "Untouchable.", sub="…so nobody asks", icon="crookedE")
obj("s10j", "Enron even won awards for managing risk. Read that again, knowing how this story ends.", ["trophy", "warning"], ["'best at risk'", "…knowing how it ends"], flow=True)
obj("s10k", "Because underneath, Lay and Skilling had made one radical decision. Enron would stop being a company that owns things…", ["crookedE", "oilbarrel"], ["not 'owns things'…"], flow=True)
obj("s10l", "…and become a company that mostly trades promises. And promises, it turns out, are very easy to fake.", ["iou", "magichat"], ["…'trades promises'", "…easy to fake"], flow=True)

# ============================ ACT 2 — TRICK 1: MARK-TO-MARKET ============================
obj("s12", "Pulling this off took two magic tricks. Here's the first.", ["magichat"], ["Trick #1"])
compare("s13", "Normally, a company earns the money first, then writes it down. Simple.", "Normal company", "earn → then book", "Enron", "book → then… maybe earn?", licon="coins", ricon="magichat")
diagram("s14", "Skilling's idea: mark-to-market. Sign a twenty-year deal today, and book all twenty years of imagined profit right now — the cash was optional.", [
    ("deal", "a 20-year deal", "iou", 0.14, 0.5), ("book", "book ALL the profit\nTODAY", "magichat", 0.5, 0.28),
    ("cash", "the actual cash", "coins", 0.85, 0.62, True)], [("deal", "book"), ("book", "cash", "…someday?")], title="Mark-to-market accounting")
shot("s15", "It's a real, legitimate method — for things with an actual market price. Enron used it on deals that had none.", "wiki-mtm")
callout("s16", "So on paper, Enron grew every single quarter. On paper.", "On paper.", sub="the profits were projections, not cash", icon="newspaper")
ch("s17", "Guess a future profit. Declare it real. Count it today. If it never showed up? Didn't matter. Already booked.", pose="shrug", variant="villain", props=[("magichat", "guess a profit"), ("warning", "…cash optional")])
obj("s18", "To see how insane this gets, one real deal. Enron teamed up with Blockbuster to stream movies to your home.", ["officetower", "ticker"], ["Blockbuster", "…'stream movies'"], flow=True)
callout("s19", "This was years before streaming even worked. The service barely launched. Enron still booked over a hundred million in profit.", "$110 million", sub="\"profit\" from a deal that flopped", icon="magichat")
obj("s20", "The movies never streamed. The profit was already counted. That is mark-to-market in one story.", ["magichat", "warning"], ["profit booked", "…product never came"], flow=True)
callout("s21", "And Wall Street expected Enron to beat its number every quarter, forever. Miss once, and the magic breaks.", "Beat it. Forever.", sub="…or the whole trick is exposed", icon="chartup")
ch("s22", "So they never missed. They simply couldn't afford to. Every quarter, the imagined profits just got bigger.", pose="explain", variant="villain", props=[("magichat", "invent more"), ("chartup", "…every quarter")])

obj("s22b", "To translate 'mark-to-market': you book the dream today, and hope reality shows up later. It rarely did.", ["magichat", "warning"], ["book the dream now", "…reality? later"], flow=True)
callout("s22c", "Regulators had actually blessed the method back in 1992. A legitimate tool, handed to people who treated imagination as income.", "Blessed in 1992", sub="a real tool, badly abused", icon="scale")
obj("s22d", "Every quarter, Skilling needed a bigger number. So every quarter, the imagined profits grew. A treadmill with no off switch.", ["refinance", "chartup"], ["a treadmill", "…speeding up"], flow=True)
obj("s22e", "Or take a giant power plant Enron built in India. Booked as a triumph. In reality, a money pit that barely ran.", ["officetower", "chartdown"], ["a 'triumph'…", "…a money pit"], flow=True)
diagram("s22f", "That's the whole con of trick one. The profit is loud and immediate. The loss is quiet and arrives years later — long after everyone's been paid.", [
    ("profit", "profit: booked NOW", "magichat", 0.22, 0.4), ("loss", "loss: years later", "chartdown", 0.78, 0.4),
    ("paid", "…bonuses already paid", "coins", 0.5, 0.82)], [("profit", "paid"), ("loss", "paid")], title="Heads I win, tails… later")
callout("s22g", "By 2001, Enron reported a hundred billion dollars in revenue. One of the biggest companies alive — on paper.", "$100 billion", sub="Enron's reported revenue", icon="crookedE")
stage("s22h", "But cash — real, spendable cash — kept not showing up. A company earning billions on paper was somehow always draining money.", "vaultdrain", caption="billions 'earned'… but no cash")
obj("s22i", "Which raised an obvious, dangerous question. If you're so profitable, why do you keep needing to borrow?", ["chartup", "iou"], ["'so profitable!'", "…so why borrow?"], flow=True)

# ============================ ACT 3 — TRICK 2: HIDING THE DEBT ============================
obj("s23", "But fake profits plus real spending equals a very real problem. Debt. Mountains of it.", ["magichat", "iou"], ["fake profit", "+ real debt"], flow=True)
ch("s24", "Debt scares investors. If it shows, the magic stops. So Enron had to hide it. Enter the second magician.", pose="present", variant="villain", bubble="Trick #2", props=[("shellbox", "the CFO, Fastow")])
shot("s25", "The CFO, Andrew Fastow. His solution: invent companies. Fake ones. Hundreds, then thousands.", "wiki-fastow")
callout("s26", "Enron built around three thousand of these shell entities. With names like LJM, Chewco, and Raptor.", "~3,000 shells", sub="LJM · Chewco · Raptor", icon="shellbox")
shot("s27", "They're called special-purpose entities — real tools, bent into a hiding place.", "wiki-spe")
diagram("s28", "Here's the move. Enron shoves its debt into a shell company — and poof, the debt is off Enron's books. The company looks spotless.", [
    ("enron", "ENRON", "crookedE", 0.18, 0.30), ("shell", "a shell co.\n(LJM)", "shellbox", 0.5, 0.56),
    ("debt", "the debt", "iou", 0.82, 0.30, True), ("clean", "Enron looks\nspotless", "trophy", 0.5, 0.85)],
    [("enron", "shell", "dump the debt"), ("shell", "debt"), ("shell", "clean")], title="The hiding place")
ch("s29", "It's like opening a credit card in a fake friend's name, buying everything, then telling the bank you owe nothing.", pose="explain", variant="villain", props=[("creditcard", "fake friend's card"), ("bank", "…'I owe zero'")])
callout("s30", "And Fastow didn't only hide Enron's debt. He secretly pocketed around forty-five million dollars for himself.", "$45 million", sub="Fastow's personal cut", icon="coins")
ch("s31", "The board knew. They voted to waive their own ethics rules — twice — to let him do it.", pose="explain", props=[("capitol", "the board knew"), ("scale", "…waived ethics, twice")])

obj("s31b", "Think of each shell as a closet. Enron stuffed its debt and its failures inside, then shut the doors.", ["shellbox", "iou"], ["a closet", "…shove the debt in"], flow=True)
obj("s31c", "Then it photographed only the tidy rooms, and showed Wall Street the pictures.", ["newspaper", "bank"], ["show the tidy rooms", "…Wall Street applauds"], flow=True)
obj("s31d", "The shells got cartoon-villain names. Chewco, after Chewbacca. Raptor, after Jurassic Park. An inside joke.", ["shellbox", "bubble"], ["Chewco · Raptor", "…an inside joke"], flow=True)
obj("s31e", "A labyrinth of three thousand shells, built specifically so that nobody could ever follow the money.", ["shellbox", "warning"], ["×3,000", "…a labyrinth"], flow=True)
ch("s31f", "And here's the part that should've ended careers. Fastow personally ran some of the very shells that were doing deals with Enron.", pose="explain", variant="villain", props=[("shellbox", "he RAN the shells"), ("scale", "…both sides of the table")])
obj("s31g", "He sat on both sides of the table — Enron's CFO, and the man Enron was paying. A conflict of interest you could see from space.", ["scale", "warning"], ["CFO…", "…and counterparty"], flow=True)
obj("s31h", "None of this works alone, either. It takes lawyers to bless it, bankers to fund it, and auditors to sign it.", ["scale", "bank", "officetower"], ["lawyers", "bankers", "auditors"], flow=True)
obj("s31i", "Enron had all three — richly paid, and very carefully not looking.", ["coins", "warning"], ["paid richly", "…eyes shut"], flow=True)

# ============================ ACT 4 — THE HOUSE OF CARDS ============================
diagram("s32", "But every shell was propped up by one thing: Enron's own stock. Which created a perfect, circular loop.", [
    ("stock", "stock HIGH", "chartup", 0.5, 0.12), ("shells", "shells hold", "shellbox", 0.84, 0.5),
    ("hide", "debt hidden", "magichat", 0.5, 0.88), ("profit", "profits reported", "newspaper", 0.16, 0.5)],
    [("stock", "shells"), ("shells", "hide"), ("hide", "profit"), ("profit", "stock")], title="The loop")
stage("s33", "Round and round. It looked like a money machine. But it was a house of cards.", "housecollapse", caption="…a house of cards", accent=True)
obj("s34", "And it all depended on one thing never happening. The stock could never, ever fall.", ["crookedE", "warning"], ["the stock", "…can never drop"])
shot("s35", "Someone was supposed to catch this. The auditor — Arthur Andersen, one of the five biggest accounting firms on Earth.", "wiki-andersen")
callout("s36", "Enron paid Andersen around a million dollars a week. For that price, the books always looked fine.", "$1M / week", sub="what Enron paid its auditor", icon="coins")
ch("s37", "A watchdog that's being fed doesn't bark. Analysts kept screaming 'buy,' all the way down.", pose="explain", props=[("bank", "analysts: BUY!"), ("chartdown", "…all the way down")])
callout("s38", "Strip out the make-believe profits and the hidden-debt shells, and the hundred-billion-dollar giant was hollow.", "$100B → hollow", sub="behind the reported revenue", icon="houseofcards")
obj("s38f", "A hundred-billion-dollar skyscraper, built on a foundation of absolutely nothing. And the ground was starting to shift.", ["officetower", "houseofcards"], ["a $100B tower", "…on nothing"], flow=True)
obj("s38g", "Because rate hikes and a cooling market meant the stock couldn't keep levitating forever. And the one forbidden thing was about to happen.", ["chartup", "warning"], ["it can't rise forever", "…the forbidden thing"], flow=True)
diagram("s38h", "Remember the loop? It only spins one way. The moment the stock turns down, every arrow reverses — and the machine starts eating itself.", [
    ("down", "stock FALLS", "chartdown", 0.5, 0.14), ("fail", "shells fail", "shellbox", 0.84, 0.5),
    ("show", "debt appears", "iou", 0.5, 0.88), ("sell", "investors sell", "crowd", 0.16, 0.5)],
    [("down", "fail"), ("fail", "show"), ("show", "sell"), ("sell", "down")], title="The loop, in reverse")

obj("s38b", "The conflict ran deeper than fees. Andersen also sold Enron lucrative consulting — the referee was playing for one team.", ["officetower", "scale"], ["audit + consulting", "…referee on the team"], flow=True)
ch("s38c", "One analyst dared to ask Skilling a simple question on a public call. Where's the actual cash flow?", pose="explain", props=[("ticker", "'where's the cash?'")])
ch("s38d", "Skilling called him a word we can't say here — live, on the earnings call. Questioning the magic was dangerous.", pose="explain", variant="villain", props=[("warning", "'how DARE you'"), ("bubble", "…on a live call")])
callout("s38e", "Auditors, analysts, the board — almost everyone who could have stopped it was paid to look the other way.", "Look away.", sub="everyone who could've stopped it", icon="warning")

# ============================ ACT 5 — THE COLLAPSE ============================
image("s39", "Then, in August 2001, the mastermind did something bizarre. Skilling abruptly resigned, for 'personal reasons.'", "img/skilling.jpg", caption="Skilling quits — August 2001", label="…RESIGNS?", mug=True)
ch("s40", "The captain stepped off the ship months before it sank. The questions got louder.", pose="explain", props=[("warning", "captain jumps ship"), ("crowd", "…questions grow")])
image("s41", "And inside the company, one executive had already seen it coming. Sherron Watkins.", "img/watkins.jpg", caption="Sherron Watkins — the whistleblower", label="WATKINS")
shot("s42", "She warned chairman Ken Lay that Enron might implode in a wave of accounting scandals. She was right.", "wiki-watkins")
callout("s43", "In October 2001, Enron admitted it had overstated profits by hundreds of millions — and hidden a mountain of debt.", "$600 million", sub="in \"profit\" that wasn't real", icon="magichat")
timeline("s44", "From here, the fall took just weeks.", "The collapse of 2001", [("Aug", "Skilling quits", "handcuffs"), ("Oct", "profits restated, SEC probe", "warning"), ("Nov", "rescue deal collapses", "chartdown"), ("Dec 2", "largest bankruptcy ever", "crookedE")], highlight=3)
stage("s44b", "The stock went from ninety dollars to under one dollar in a matter of weeks.", "crash", caption="$90 → $0.26", accent=True)
callout("s45", "Ninety dollars. To twenty-six cents. In weeks.", "$90 → $0.26", sub="Enron's stock, 2001", icon="chartdown")
obj("s46", "And as the walls closed in, Arthur Andersen did something unforgivable. It started shredding.", ["shredder"], ["the auditor shreds the evidence"])
obj("s46b", "The real trigger was boring and technical. Enron's credit rating got cut to junk — forcing billions of the hidden debt suddenly due.", ["chartdown", "iou"], ["cut to junk", "…hidden debt now DUE"], flow=True)
shot("s46c", "A rival, Dynegy, offered to buy Enron and save it — then opened the books and ran.", "wiki-dynegy")
obj("s46d", "Because once you read the fine print, there was nothing to buy. Just debt wearing a company costume.", ["iou", "crookedE"], ["just debt", "…in a costume"], flow=True)
obj("s46e", "When the truth finally leaked, it didn't trickle. It poured. Each disclosure forced the next.", ["chartdown", "shellbox"], ["the dam breaks", "…one lie, then ten"], flow=True)
stage("s46f", "A company that took sixteen years to build unraveled in about sixteen days. One domino, then all of them.", "dominoes", caption="16 years to build… 16 days to fall")
shot("s47", "Andersen was convicted of obstruction. A firm with eighty-five thousand employees worldwide — gone.", "wiki-scandal")

# ============================ ACT 6 — WHO PAID, WHO WALKED ============================
ch("s48", "So who actually paid for all of it? Start with the employees.", pose="think", bubble="Who paid?", props=[("crowd", "the employees")])
callout("s49", "They'd been urged to stuff their retirement savings full of Enron stock. Around two billion dollars in pensions — gone.", "$2 billion", sub="employee retirement savings, erased", icon="piggybank")
ch("s50", "Worse: as the stock crashed, many were locked and forbidden from selling. They watched their futures burn in real time.", pose="handtohead", expr="worried", props=[("padlock", "locked from selling"), ("chartdown", "…watching it burn")])
callout("s51", "The executives? They had already cashed out more than a billion dollars in stock before the collapse.", "$1 billion+", sub="insider stock sales before the crash", icon="coins")
image("s52", "But this time, the story ended in a courtroom. CEO Jeff Skilling went to federal prison — over a decade.", "img/skilling.jpg", caption="Jeff Skilling — guilty. Prison.", label="GUILTY", circle=True, mug=True)
obj("s53", "CFO Andrew Fastow got six years — after cutting a deal and turning on the others.", ["handcuffs", "shellbox"], ["Fastow: 6 years", "…he built the shells"], flow=True)
image("s54", "The founder, Ken Lay, was convicted on every count — then died before he could be sentenced.", "img/lay.jpg", caption="Ken Lay — guilty on all counts", label="GUILTY", circle=True)
obj("s52b", "Picture a janitor who did everything right. Saved for thirty years — all in Enron stock, because the company said to.", ["crowd", "piggybank"], ["did it right", "…all Enron stock"], flow=True)
obj("s52c", "In a few weeks, thirty years of savings became nothing. While the people who knew had already cashed out.", ["chartdown", "coins"], ["30 yrs → $0", "…they cashed out"], flow=True)
obj("s52d", "And remember California? Ordinary families paid higher power bills so a few traders could win a bet. The human cost never fits on a balance sheet.", ["crowd", "scale"], ["Californians paid", "…for the bet"], flow=True)
image("s52e", "Justice came, slowly. The whistleblower, Sherron Watkins, became the face of doing the right thing.", "img/watkins.jpg", caption="Sherron Watkins — she told the truth", label="THE TRUTH")
obj("s52f", "And eighty-five thousand people at Arthur Andersen — most of whom did nothing wrong — lost their jobs when the firm collapsed too.", ["officetower", "crowd"], ["Andersen", "…85,000 jobs gone"], flow=True)
obj("s52g", "The fraud didn't just erase a company. It erased two — and took a whole profession's trust down with it.", ["crookedE", "scale"], ["two firms gone", "…and all the trust"], flow=True)
stage("s54b", "After the biggest corporate fraud America had ever seen, the verdict was blunt.", "stamp", stampText="FRAUD")
shot("s55", "The scandal was so severe it rewrote the law — the Sarbanes-Oxley Act, passed to stop the next Enron.", "wiki-sox")
obj("s55b", "There's a famous name for the whole saga: 'The Smartest Guys in the Room.' And that's what makes it scary.", ["officetower", "warning"], ["'the smartest guys…'", "…built the fraud"], flow=True)
ch("s55c", "Smart people didn't prevent this fraud. Smart people built it. Brilliance pointed at deception is still deception.", pose="explain", variant="villain", props=[("shredder", "the smart ones"), ("warning", "…deceiving")])

# ============================ ACT 7 — THE LESSON ============================
ch("s56", "So, back to the question. Where did the seventy billion go? It didn't go anywhere.", pose="think", bubble="So… where'd it go?", props=[("magichat", "$70B…")])
diagram("s57", "The profit was invented. The debt was hidden. Both tricks did the same thing — they made reality disappear on paper.", [
    ("profit", "invent profit", "magichat", 0.22, 0.4), ("debt", "hide the debt", "shellbox", 0.78, 0.4),
    ("gone", "reality 'disappears'", "houseofcards", 0.5, 0.82)], [("profit", "gone"), ("debt", "gone")], title="The whole trick")
obj("s58", "Enron's real product was never energy. It was a story — of endless growth that Wall Street desperately wanted to believe.", ["newspaper", "crowd"], ["the real product: a story", "…everyone believed it"], flow=True)
ch("s59", "And it worked for years because almost nobody could explain how Enron actually made money. That was the entire point.", pose="explain", props=[("crookedE", "too complex"), ("warning", "…nobody understood it")])
callout("s60", "The complexity wasn't a side effect. It was the hiding place. If a company is too complicated to explain, maybe that's the strategy.", "Too complex?", sub="…maybe that's the point", icon="warning")
obj("s60c", "And the scariest part? The paperwork was all signed. Lawyers approved it. Auditors certified it. On paper, it was 'by the book.'", ["scale", "officetower"], ["all signed off", "…'by the book'"], flow=True)
obj("s60d", "Fraud this big is rarely one evil genius in a basement. It's a thousand small 'yeses' from people who should have said no.", ["crowd", "warning"], ["not one villain", "…a thousand small yeses"], flow=True)
obj("s60b", "And this twenty-year-old story still matters, because the trick never retired. 2008 did it with mortgages sliced so fine nobody could price them.", ["house", "shellbox"], ["2008", "…too complex to price"], flow=True)
obj("s61", "Two decades later, a crypto exchange called FTX did almost the identical dance. Same trick, new costume.", ["ticker", "magichat"], ["FTX, 2022", "…same trick"], flow=True)
callout("s61b", "Every era gets its own Enron. The red flag is always the same — dazzling complexity, and profits nobody can quite explain.", "The red flag.", sub="complexity + unexplained profit", icon="warning")
obj("s61c", "Sometimes the people selling it are the smartest in the room. That's not reassuring. It's the opposite.", ["officetower", "warning"], ["'the experts say…'", "…be more careful, not less"], flow=True)
diagram("s61d", "So here's your Enron test. If you can't draw how the money is made in a few boxes, and nobody will explain it simply — walk away.", [
    ("simple", "draw it simply?", "paystub", 0.25, 0.45), ("maze", "or a 3,000-box maze?", "shellbox", 0.75, 0.45, True)],
    [], title="The napkin test")
ch("s62", "A real business can be explained on a napkin. Enron needed a maze of three thousand shells. That was the tell.", pose="explain", props=[("paystub", "napkin-simple?"), ("shellbox", "…or a maze of 3,000?")])
obj("s63", "The magic trick was never making money appear. It was making you stop asking where it came from.", ["magichat", "bubble"], ["the real trick", "…stop asking"], flow=True)
obj("s63b", "The numbers on a screen can lie. What those lies cost — the pensions, the jobs, the trust — is always painfully real.", ["ticker", "scale"], ["numbers can lie", "…the cost is real"], flow=True)
stage("s63c", "So where did the seventy billion go? Nowhere. Watch closely…", "vanish", caption="…it was never there", accent=True)
callout("s64", "Enron didn't lose seventy billion dollars. It proved seventy billion was never really there to begin with.", "$0", sub="where the money actually was", icon="magichat")
ch("s65", "If this made the smartest guys in the room look a little less smart, hit subscribe — and tell me which collapse to pull apart next.", pose="present", props=[("crookedE", "which fraud next?"), ("newspaper", "the next deep dive")])
ch("s66", "I do the reading. You get the parts that matter.", pose="celebrate", expr="happy", props=[("newspaper", "I do the reading"), ("coins", "you get what matters")])

# Shorten the mascot: keep character beats to a single prop so they're quick
# reactions, not long presenter shots (demotes the stickman's screen time further).
for s in S:
    if s["type"] == "character" and s.get("props"):
        s["props"] = s["props"][:1]

# renumber
for i, s in enumerate(S, 1):
    s["id"] = f"s{i}"

SOURCES = [
    {"id": "wiki-enron", "name": "Enron (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Enron", "quote": "most innovative"},
    {"id": "wiki-mtm", "name": "Mark-to-market accounting (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Mark-to-market_accounting", "quote": "mark-to-market"},
    {"id": "wiki-fastow", "name": "Andrew Fastow (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Andrew_Fastow", "quote": "Fastow"},
    {"id": "wiki-spe", "name": "Special-purpose entity (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Special-purpose_entity", "quote": "special-purpose"},
    {"id": "wiki-andersen", "name": "Arthur Andersen (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Arthur_Andersen", "quote": "shredding"},
    {"id": "wiki-watkins", "name": "Sherron Watkins (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Sherron_Watkins", "quote": "Watkins"},
    {"id": "wiki-scandal", "name": "Enron scandal (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Enron_scandal", "quote": "mark-to-market"},
    {"id": "wiki-sox", "name": "Sarbanes–Oxley Act (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Sarbanes%E2%80%93Oxley_Act", "quote": "Sarbanes"},
    {"id": "wiki-lay", "name": "Kenneth Lay (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Kenneth_Lay", "quote": "Lay"},
    {"id": "wiki-calcrisis", "name": "California electricity crisis (Wikipedia)", "url": "https://en.wikipedia.org/wiki/2000%E2%80%932001_California_electricity_crisis", "quote": "Enron"},
    {"id": "wiki-dynegy", "name": "Dynegy (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Dynegy", "quote": "Enron"},
    {"id": "wiki-skilling", "name": "Jeffrey Skilling (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Jeffrey_Skilling", "quote": "Skilling"},
]

YT = {
    "title": "How Enron Actually Made Its Money Disappear",
    "alts": ["Enron: The $70 Billion Magic Trick", "How Enron Faked $70 Billion (and Nobody Noticed)"],
    "hook": "In 2000, Enron was the most admired company in America — $90 stock, $70 billion, \"most innovative\" six years running. A year later it was the biggest bankruptcy in US history. So where did $70 billion go? The unsettling answer: nowhere. It was never there. Here's exactly how two accounting tricks — inventing profit and hiding debt — made the money disappear, fully cited.",
    "bullets": [
        "Trick 1: mark-to-market accounting — booking imaginary future profits today",
        "Trick 2: ~3,000 shell companies (LJM, Chewco, Raptor) to hide the debt",
        "Why it was a house of cards propped up by Enron's own stock",
        "Arthur Andersen, the $1M-a-week auditor that shredded the evidence",
        "Who paid ($2B in pensions) and who walked ($1B in insider sales)",
        "The lesson that outlives Enron: when it's too complex to explain, that's the point",
    ],
    "tags": [
        "enron", "enron scandal", "how enron collapsed", "enron explained", "mark to market",
        "special purpose entity", "arthur andersen", "jeff skilling", "andrew fastow", "ken lay",
        "accounting fraud", "corporate fraud", "largest bankruptcy", "sarbanes oxley",
        "house of cards", "wall street fraud", "economics explained", "Napkin Numbers",
    ],
    "thumbnail": {"hookTop": "HOW ENRON HID", "hookBot": "$70 BILLION", "napkinNumber": "$0", "napkinSub": "…where'd it go?", "deco": "crookedE"},
    "chapters": [
        ["the most admired company", "The golden boy"],
        ["two magic tricks", "Trick 1 — inventing profit"],
        ["a very real problem", "Trick 2 — hiding the debt"],
        ["propped up by one thing", "The house of cards"],
        ["did something bizarre", "The collapse"],
        ["who actually paid", "Who paid, who walked"],
        ["back to the question", "The lesson"],
    ],
}

ep = {
    "id": "EP014", "series": "Napkin Numbers", "title": "How Enron Made Its Money Disappear",
    "slug": "how-enron-made-money-disappear", "market": "US", "language": "en",
    "voice": {"provider": "edge", "voiceId": "en-US-BrianNeural", "accent": "natural"},
    "note": "Enron — proper CF style: mascot ~25%, diagrams/photos/objects/screenshots default.",
    "scenes": S, "sources": SOURCES, "youtube": YT,
}
pathlib.Path("episodes/examples/EP014-enron.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/scenes.json").write_text(json.dumps(S, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/thumb.json").write_text(json.dumps(YT["thumbnail"], indent=2))

words = sum(len(s["narration"].split()) for s in S)
from collections import Counter
cnt = Counter(s["type"] for s in S)
mascot = cnt["character"]
print(f"scenes={len(S)} words={words} est={(words/171.3*60 + len(S)*0.5)/60:.2f} min")
print(cnt)
print(f"mascot share: {100*mascot/len(S):.0f}%")
