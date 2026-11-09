#!/usr/bin/env python3
"""EP015 — "FTX: Where $8 Billion of Customer Money Went" in the full style:
mascot ~16% (short reactions), big full-frame metaphor stages + ANIMATED motifs
(rocketcrash, bankrun, towerfall, vaultdrain, crash, vanish, dominoes, stamp),
real photos (SBF, CZ), a few box-diagrams, LOTS of varied doodles + evidence."""
import json, pathlib

S = []

def ch(id, narr, pose="stand", props=None, bubble=None, expr=None, variant=None):
    d = {"id": id, "type": "character", "narration": narr, "pose": pose}
    if expr: d["expression"] = expr
    if variant: d["variant"] = variant
    if bubble: d["bubble"] = bubble
    if props: d["props"] = [{"name": n, "label": l} for n, l in props]
    S.append(d)

def callout(id, narr, text, sub=None, icon=None):
    d = {"id": id, "type": "callout", "narration": narr, "text": text}
    if sub: d["sub"] = sub
    if icon: d["icon"] = icon
    S.append(d)

def title(id, narr, heading, kicker=None, sub=None):
    d = {"id": id, "type": "title", "narration": narr, "heading": heading}
    if kicker: d["kicker"] = kicker
    if sub: d["sub"] = sub
    S.append(d)

def obj(id, narr, icons, caption=None):
    """Big full-frame metaphor doodle(s) — NO arrows. Use VARIED doodles."""
    d = {"id": id, "type": "stage", "narration": narr, "icons": icons}
    if caption: d["caption"] = caption
    S.append(d)

def stage(id, narr, motif, caption=None, kicker=None, stampText=None, accent=False):
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

def shot(id, narr, sourceId):
    S.append({"id": id, "type": "screenshot", "narration": narr, "sourceId": sourceId})

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
image("s1", "In 2022, this was the most trusted man in crypto.", "img/sbf.png", caption="The most trusted man in crypto", label="SBF")
obj("s2", "Sam Bankman-Fried. Thirty years old, running FTX — one of the biggest crypto exchanges on Earth.", ["laptop", "token"], caption="FTX — a crypto giant")
callout("s3", "At its peak, FTX was valued at thirty-two billion dollars. Sam himself was worth around twenty-six.", "$32 billion", sub="FTX at its peak", icon="rocket")
obj("s4", "And he looked nothing like a villain. Messy hair, cargo shorts, slept on a beanbag, played video games in meetings.", ["gauge", "laptop"], caption="…not your typical tycoon")
obj("s5", "He said he was only getting rich to give it all away. Effective altruism. The good billionaire.", ["coins", "handshake"], caption="\"the good billionaire\"")
shot("s6", "It wasn't just an image — he built a whole philanthropic brand around it.", "wiki-ea")
obj("s7", "He testified to Congress. Bailed out other crypto firms. People called him the J.P. Morgan of crypto.", ["capitol", "trophy"], caption="crypto's hero")
stage("s8", "And then, in about ten days, all of it came crashing down.", "rocketcrash", caption="…to the ground", accent=True)
callout("s9", "Eight billion dollars of customer money — just gone.", "$8 billion", sub="customer deposits, missing", icon="warning")
ch("s10", "So where did eight billion dollars of other people's money actually go?", pose="think", bubble="Where did $8B go?", props=[("token", "…$8B?")])
title("s11", "Let's follow eight billion dollars — right out the back door.", "Where $8 Billion of Customer Money Went", kicker="The FTX collapse", sub="It didn't vanish. It was gambled.")

stage("s7b", "Crypto itself was on a rocket. Prices only went up, and everyone was sure this time was different.", "inflate", caption="crypto: to the moon")
obj("s7c", "FTX put its name on a twenty-thousand-seat NBA arena, and hired A-list celebrities to sell it to you.", ["officetower", "trophy"], caption="the FTX Arena · a Super Bowl ad")
callout("s7d", "It gave tens of millions to politicians, becoming one of the biggest donors in the country.", "$40M+", sub="in political donations", icon="capitol")
obj("s7e", "The smartest venture funds on Earth lined up to invest, barely checking the books.", ["bank", "handshake"], caption="top VCs piled in")
obj("s7f", "Millions of ordinary people trusted FTX with their savings. It felt as safe as a bank.", ["crowd", "piggybank"], caption="millions trusted it")
obj("s7g", "Every signal said: this is the responsible one. The grown-up in a reckless industry.", ["scale", "gauge"], caption="\"the safe one\"")
ch("s7h", "Which is exactly why what was happening underneath is so unsettling.", pose="explain", props=[("warning", "…underneath")])
obj("s7i", "Remember the backdrop. In 2021, crypto was a mania. Prices doubled, tripled, and 'number go up' felt like a law of physics.", ["chartup", "token"], caption="2021: the mania")
obj("s7j", "New coins launched every day. Teenagers became millionaires on paper. Nobody wanted to be the one asking boring questions.", ["coins", "rocket"], caption="…everyone was getting rich")
obj("s7k", "In a gold rush, the calm, trusted figure selling the shovels looks like the safest bet of all.", ["goldbar", "handshake"], caption="FTX sold the shovels")
shot("s7l", "And crypto's whole promise was to cut out the middlemen you have to trust — banks, brokers, gatekeepers.", "wiki-crypto")
obj("s7m", "The deep irony? FTX asked you to trust it completely — to be the exact middleman crypto was invented to avoid.", ["token", "bank"], caption="…the middleman crypto was meant to kill")

# ============================ ACT 2 — THE MACHINE ============================
obj("s12", "To understand it, you need two companies. First, FTX. A crypto exchange.", ["laptop"], caption="Company 1: FTX")
obj("s13", "You send it your money, it lets you buy and sell crypto. Simple. Like a bank, but for coins.", ["piggybank", "token"], caption="you deposit → you trade")
obj("s14", "Second company: Alameda Research. A trading firm, making risky bets with its own money.", ["chip", "ticker"], caption="Company 2: Alameda")
image("s15", "Both were quietly controlled by the same man. And Alameda was run by Caroline Ellison — Sam's on-and-off girlfriend.", "img/sbf.png", caption="…both his", label="ONE BOSS")
obj("s16", "Now, the single most sacred rule of running an exchange: customer money is untouchable. You never, ever gamble with it.", ["padlock", "piggybank"], caption="rule #1: NEVER touch customer funds")
stage("s17", "FTX touched it. Secretly, it funneled billions in customer deposits straight into Alameda.", "vaultdrain", caption="customer funds → Alameda", accent=True)
diagram("s18", "There was literally a backdoor in the code — a secret setting that let Alameda borrow unlimited customer money, invisibly.", [
    ("cust", "customer $", "piggybank", 0.16, 0.3), ("ftx", "FTX", "laptop", 0.5, 0.3),
    ("door", "secret backdoor", "padlock", 0.5, 0.72), ("ala", "Alameda", "chip", 0.84, 0.3)],
    [("cust", "ftx"), ("ftx", "door", "unlimited"), ("door", "ala")], title="The backdoor")
obj("s19", "And Alameda spent it. Risky bets. Venture investments. Mansions in the Bahamas. Political donations. Loans to the founders themselves.", ["yacht", "island", "capitol"], caption="…your money, their lifestyle")
callout("s20", "By the end, Alameda owed FTX's customers around eight billion dollars it did not have.", "$8 billion", sub="the hole in customer funds", icon="chip")

obj("s20b", "Think about what that means. When a normal exchange holds your money, it's supposed to just sit there, like cash in a safe-deposit box.", ["bank", "padlock"], caption="your money should just… sit there")
obj("s20c", "You can take it out whenever you want, because it never moved. That's the entire promise.", ["keys", "coins"], caption="…always there when you want it")
obj("s20d", "FTX broke that promise in secret. Your deposit didn't sit in a vault. It was wired to the gambling desk next door.", ["chip", "warning"], caption="…instead it went to the casino")
obj("s20e", "And Alameda wasn't betting carefully. It was making huge, leveraged, often terrible bets.", ["chip", "chartdown"], caption="…huge, reckless bets")
obj("s20f", "When those bets lost, there was no safety net. Just a growing hole where the customer money used to be.", ["warning", "iou"], caption="…a growing hole")
shot("s20g", "This wasn't a grey area. Prosecutors would later call it exactly what it was — fraud, on a massive scale.", "wiki-ftx")
obj("s20h", "The founders even took personal loans — hundreds of millions — from the very funds their customers had deposited.", ["coins", "handcuffs"], caption="…loans to themselves")
obj("s20i", "A real exchange keeps your money in a separate account it cannot spend. It's a basic, legally-required wall.", ["bank", "padlock"], caption="the rule: a wall between the two")
stage("s20j", "FTX quietly knocked that wall down — and let the money pour through to Alameda.", "vaultdrain", caption="…the wall came down", accent=True)
obj("s20k", "There was even a special exemption in the code so Alameda's account could go billions into the red without ever being shut off.", ["laptop", "warning"], caption="…a secret 'never shut off' setting")
obj("s20l", "Everyone else playing on FTX would be auto-liquidated in seconds. Alameda alone could lose forever, on your dime.", ["chip", "scale"], caption="one set of rules for Alameda")
obj("s20m", "You might ask: how did nobody catch this? Simple. FTX had no proper auditor, no real board, and almost no oversight.", ["officetower", "warning"], caption="no auditor · no board")
obj("s20n", "The people who were supposed to check the books were, essentially, Sam and his roommates.", ["crowd", "laptop"], caption="…the 'checkers' were his friends")
obj("s20o", "So the deposits flowed one way — out of your account, into the bets — and nobody with power ever said stop.", ["piggybank", "chip"], caption="…and nobody said stop")
obj("s20p", "For a while, it worked perfectly. The bets were winning, crypto was booming, and no one asked for all their money at once.", ["chartup", "coins"], caption="…while the music played")
obj("s20q", "A machine like that only has to survive one thing: the day everybody wants out together.", ["crowd", "padlock"], caption="…until everyone wants out")

# ============================ ACT 3 — THE FTT TOKEN ============================
obj("s21", "But here's the Enron-style trick that held it all together. FTX printed its own money.", ["printer", "token"], caption="FTX invents a coin: FTT")
obj("s22", "A token called FTT. FTX created it out of thin air, and it was worth whatever the market said — which FTX could nudge.", ["token", "bubble"], caption="FTT — conjured from nothing")
diagram("s23", "Now watch the loop. Alameda held billions in FTT as 'collateral.' So the whole empire was propped up by a coin its own sister company invented.", [
    ("ftx", "FTX prints FTT", "printer", 0.5, 0.14), ("ala", "Alameda holds it\nas 'collateral'", "token", 0.84, 0.52),
    ("value", "makes them look\nrich & solvent", "trophy", 0.5, 0.88), ("back", "which props up FTX", "laptop", 0.16, 0.52)],
    [("ftx", "ala"), ("ala", "value"), ("value", "back"), ("back", "ftx")], title="The circular trick")
obj("s24", "It's the oldest magic trick in finance. Invent an asset, call it collateral, borrow real money against your own made-up coin.", ["magichat", "token"], caption="collateral… from nothing")
obj("s25", "As long as FTT held its value, the machine kept spinning. It looked like a tower of gold. It was a tower of FTT.", ["token", "houseofcards"], caption="a tower of its own token")

obj("s25b", "Imagine a casino that pays its debts using chips it prints itself. As long as nobody cashes out, it looks infinitely rich.", ["chip", "printer"], caption="a casino paying with its own chips")
obj("s25c", "But those chips are only worth something because everyone agrees they are. Agreement is a very fragile kind of collateral.", ["token", "bubble"], caption="…value by agreement only")
obj("s25d", "If people ever doubt the chip, its price falls, and suddenly the 'collateral' propping everything up is worth almost nothing.", ["token", "chartdown"], caption="doubt → the collateral vanishes")
obj("s25e", "FTX and Alameda were now bound together by this coin. If one fell, both fell.", ["handshake", "domino"], caption="…tied together by FTT")

# ============================ ACT 4 — THE COLLAPSE ============================
obj("s26", "And every tower built on one block has the same flaw. Pull that block, and it all comes down.", ["gauge", "warning"], caption="…one block holds it up")
shot("s27", "On November second, a news site, CoinDesk, leaked Alameda's balance sheet. It was mostly FTT — its own partner's invented coin.", "wiki-alameda")
image("s28", "Then a rival stepped in. Changpeng Zhao — 'CZ' — the founder of Binance, the biggest exchange of all.", "img/cz.jpg", caption="CZ — founder of Binance", label="THE RIVAL")
obj("s29", "On November sixth, CZ tweeted that Binance would dump its entire pile of FTT. One tweet.", ["ticker", "token"], caption="\"we're selling our FTT\"")
stage("s30", "FTT crashed. And the instant it did, Alameda's collateral evaporated into nothing.", "crash", caption="FTT → worthless", accent=True)
stage("s31", "The tower came down.", "towerfall", caption="the FTT tower falls")
obj("s31b", "Suddenly the balance sheet everyone trusted was mostly a coin that was now in free-fall.", ["token", "chartdown"], caption="…the 'assets' were evaporating")
obj("s31c", "Alameda couldn't repay. FTX couldn't cover it. The eight-billion-dollar hole was finally visible to everyone.", ["warning", "iou"], caption="…the hole, exposed")
obj("s32", "And every customer had the same thought at the same second. Get my money out. Now.", ["crowd", "warning"], caption="…get my money OUT")
obj("s32b", "A bank run is the one thing no exchange can survive if the money isn't really there. And FTX's money wasn't.", ["bank", "warning"], caption="the one thing it couldn't survive")
stage("s33", "It became the fastest bank run in modern history.", "bankrun", caption="the run on FTX")
obj("s33b", "As it unraveled, Sam went on posting that everything was fine. 'FTX is fine. Assets are fine.' They were not.", ["ticker", "warning"], caption="\"FTX is fine.\" (it wasn't)")
obj("s33c", "For a few hours, CZ's Binance offered to swoop in and buy FTX — to save it.", ["handshake", "laptop"], caption="a rescue offer…")
shot("s33d", "Then Binance looked at the books, saw the size of the hole, and walked away within a day.", "wiki-binance")
obj("s33e", "Because there was nothing to rescue. The customer money that should have been there simply wasn't.", ["piggybank", "warning"], caption="…nothing left to save")
callout("s34", "Five billion dollars of withdrawals in seventy-two hours. FTX couldn't pay — the money was gone, gambled away at Alameda.", "$5 billion", sub="withdrawn in 72 hours", icon="padlock")
timeline("s35", "From leak to bankruptcy took nine days.", "November 2022", [("Nov 2", "CoinDesk leak", "newspaper"), ("Nov 6", "CZ dumps FTT", "ticker"), ("Nov 8", "withdrawals frozen", "padlock"), ("Nov 11", "FTX bankrupt", "warning")], highlight=3)
stage("s36", "On November eleventh, FTX filed for bankruptcy. Eight billion dollars — gone.", "vanish", caption="…$8 billion", accent=True)
obj("s36b", "And the damage didn't stop at FTX. Its collapse knocked over other crypto firms like dominoes.", ["domino", "chartdown"], caption="…the contagion spread")
obj("s36c", "People called it crypto's Lehman moment. The trust that held the whole industry together cracked overnight.", ["globe", "warning"], caption="crypto's \"Lehman moment\"")
obj("s36d", "On the way down, hundreds of millions more mysteriously drained out in a hack nobody has fully explained.", ["laptop", "warning"], caption="…and then it got hacked")
obj("s36e", "The man brought in to clean up the wreckage was John Ray — the same expert who untangled Enron.", ["officetower", "scale"], caption="the cleanup expert: John Ray")
shot("s36f", "His verdict was damning: in forty years, he'd never seen such a complete failure of corporate controls.", "wiki-bankruptcy")
obj("s36g", "No proper books. No board. Company funds tracked on casual group chats. A thirty-billion-dollar company run like a dorm room.", ["crowd", "warning"], caption="…run like a dorm room")
stage("s36h", "So when the withdrawals hit, there was nothing underneath. The whole thing came down in a single week.", "housecollapse", caption="nothing underneath")
obj("s36i", "Thirty billion dollars of value, gone — faster than it takes most people to notice their bank app updated.", ["phone", "chartdown"], caption="$30B → zero in a week")

# ============================ ACT 5 — THE AFTERMATH ============================
image("s37", "Sam was arrested in the Bahamas, and extradited to New York to face trial.", "img/sbf.png", caption="arrested in the Bahamas", label="UNDER ARREST", mug=True)
obj("s38", "And one by one, his inner circle turned on him. Caroline Ellison, Gary Wang, Nishad Singh — all pleaded guilty and testified.", ["crowd", "scale"], caption="his inner circle flips")
shot("s38b", "The same genius-founder the magazines had put on their covers was now defendant number one.", "wiki-sbf")
shot("s39", "His own ex-girlfriend, who ran Alameda, became the star witness against him.", "wiki-ellison")
stage("s40", "In November 2023, a jury found him guilty on all seven counts.", "stamp", stampText="GUILTY")
callout("s41", "Sam Bankman-Fried was sentenced to twenty-five years in prison.", "25 years", sub="Sam Bankman-Fried's sentence", icon="prison")
shot("s42", "The judge said plainly what had happened: he stole about eight billion dollars from FTX's customers.", "wiki-bankruptcy")
obj("s43", "The good billionaire, the effective altruist, the J.P. Morgan of crypto — was running the biggest fraud since Enron.", ["handcuffs", "magichat"], caption="…the biggest fraud since Enron")
obj("s43b", "In court, the charitable image fell apart. The 'give it all away' story had been part of the sales pitch.", ["coins", "mask"] if False else ["coins", "gauge"], caption="…the halo was marketing")
obj("s43c", "The celebrities who'd advertised FTX got sued. The investors who'd skipped their homework lost billions.", ["trophy", "chartdown"], caption="everyone who vouched for it paid")
obj("s43d", "And the real victims — millions of ordinary users — were left fighting for scraps in bankruptcy court.", ["crowd", "scale"], caption="…ordinary users left in the cold")
obj("s43e", "At trial, the lifestyle came out. A thirty-million-dollar penthouse. Private jets. All quietly funded by customer deposits.", ["yacht", "island"], caption="…paid for with your money")
image("s43f", "His defense was that he was just a disorganized founder who made mistakes. The jury didn't buy it.", "img/sbf.png", caption="\"just a founder who messed up\"?", label="THE DEFENSE", mug=True)
obj("s43g", "Because the backdoor wasn't a mistake. Someone wrote that code on purpose.", ["laptop", "warning"], caption="…the backdoor was deliberate")
callout("s43h", "Prosecutors argued he hadn't lost track of the money. He'd stolen it — one deliberate line of code at a time.", "Not a mistake.", sub="…a deliberate theft", icon="handcuffs")
obj("s43i", "Twenty-five years. From the cover of every magazine to a prison cell, in roughly a year.", ["trophy", "prison"], caption="…magazine cover to prison cell")
obj("s43j", "His inner circle, who cooperated early, got far lighter sentences. In fraud, the first one to talk usually wins.", ["crowd", "scale"], caption="…the first to flip wins")

# ============================ ACT 6 — THE LESSON ============================
ch("s44", "So let's go back to the question. Where did the eight billion actually go?", pose="think", bubble="So… where'd it go?", props=[("token", "$8B…")])
obj("s45", "Unlike Enron, this money was real — at first. It just got gambled and lost on bad bets and a lavish lifestyle.", ["chip", "yacht"], caption="…gambled and lost")
obj("s46", "The rest was a mirage. Billions in 'value' that only existed because of a coin FTX printed itself.", ["magichat", "token"], caption="…the rest was never real")
obj("s47", "And here's the lesson that outlives FTX. On an exchange, the money in your account isn't really yours. It's an IOU.", ["laptop", "iou"], caption="your balance is an IOU")
obj("s48", "There's a saying in crypto. 'Not your keys, not your coins.' If someone else holds it, you're trusting them not to touch it.", ["keys", "padlock"], caption="\"not your keys, not your coins\"")
obj("s49", "The red flags were everywhere. No real board. No chief financial officer. Customer money mixed with the gambling fund.", ["warning", "scale"], caption="no board · no CFO · no limits")
obj("s50", "But the charm covered it all. The hair, the beanbag, the promise to save the world — that was the real magic trick.", ["gauge", "magichat"], caption="charisma = the misdirection")
obj("s51", "It made smart people, big investors, and regular users all stop asking one simple question. Where exactly is my money?", ["crowd", "bubble"], caption="…'where is my money?'")
obj("s52", "Same as Enron, a new costume. Invent the value, hide the hole, and smile while everyone looks the other way.", ["magichat", "houseofcards"], caption="same trick, new costume")
obj("s52b", "There was no regulator checking FTX's books, because most of it sat offshore, beyond anyone's rules.", ["island", "warning"], caption="…offshore, beyond the rules")
obj("s52c", "So the only thing standing between your savings and a trading desk was one man's word. And his word was worth nothing.", ["handshake", "warning"], caption="…secured only by a promise")
obj("s52d", "The deepest lesson isn't about crypto at all. It's that trust, by itself, is not a safeguard.", ["scale", "gauge"], caption="trust is not a safeguard")
obj("s52e", "Every giant fraud runs on the same fuel — a story good enough that people stop verifying it.", ["newspaper", "magichat"], caption="…a story too good to check")
callout("s53", "If you can't see where your money is held, assume someone else can spend it.", "Where is it?", sub="…if you can't see it, be careful", icon="padlock")
obj("s53b", "Not your keys, not your coins. Not your receipts, not your money. The form changes. The rule never does.", ["keys", "iou"], caption="verify. don't just trust.")
obj("s53c", "And to be fair, crypto wasn't the villain here. The technology didn't commit fraud. A person did.", ["token", "scale"], caption="the tech didn't do this — a person did")
obj("s53d", "You can run the exact same scam with dollars, with stocks, with gold. FTX just did it faster, with fewer rules.", ["coins", "goldbar"], caption="…an old scam, new wrapper")
obj("s53e", "The pattern is always the same. A trusted face. A story too good to question. And money quietly moving where you can't see it.", ["handshake", "magichat"], caption="the eternal recipe for fraud")
obj("s53f", "So whenever something feels too safe, too generous, too good — that's exactly when to ask the boring question.", ["gauge", "bubble"], caption="\"…where, exactly, is my money?\"")
callout("s53g", "The eight billion dollars didn't vanish into the blockchain. It was gambled, spent, and lost — by people you were told to trust.", "Gambled away.", sub="where the $8 billion actually went", icon="chip")
obj("s53h", "There is a simple fix, and crypto people love to repeat it. Hold your own money. Be your own bank.", ["keys", "piggybank"], caption="self-custody: hold your own keys")
obj("s53i", "But most people won't. It's hard, it's scary, and a friendly app is just so much easier to trust.", ["laptop", "handshake"], caption="…but trust is just easier")
obj("s53j", "Which is why this will happen again, in some new form, with some new charming face promising it's different.", ["calendar", "magichat"], caption="…so it'll happen again")
obj("s53k", "The names change — Enron, FTX, the next one. The trick is identical. Make the money invisible, and the story loud.", ["crookedE", "token"], caption="same trick, new name")
obj("s53l", "The best protection isn't a law or an app. It's one stubborn habit. Follow the money until you can actually see it.", ["calculator", "gauge"], caption="follow it till you can SEE it")
obj("s53n", "So the next time an app shows you a glowing number and a famous face telling you it's safe — ask one boring question.", ["phone", "trophy"], caption="ask the boring question")
obj("s53o", "Where is the actual money right now, and who can move it without asking me?", ["vault", "keys"], caption="where is it — and who holds the keys?")
obj("s53p", "If nobody can answer that in a sentence, you're not an investor. You're the collateral.", ["calculator", "warning"], caption="…then you're the collateral")
obj("s53m", "Because in the end, a balance on a screen is just a promise. And a promise is only ever as good as the person making it.", ["ticker", "handshake"], caption="…a balance is just a promise")
ch("s54", "If this made the smartest guys in crypto look a little less smart, hit subscribe — and tell me which collapse to break down next.", pose="present", props=[("token", "which collapse next?")])
ch("s55", "I do the reading. You get the parts that matter.", pose="celebrate", expr="happy", props=[("newspaper", "…what matters")])

# Shorten mascot + renumber
for s in S:
    if s["type"] == "character" and s.get("props"):
        s["props"] = s["props"][:1]
for i, s in enumerate(S, 1):
    s["id"] = f"s{i}"

SOURCES = [
    {"id": "wiki-ftx", "name": "FTX (Wikipedia)", "url": "https://en.wikipedia.org/wiki/FTX", "quote": "customer"},
    {"id": "wiki-sbf", "name": "Sam Bankman-Fried (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Sam_Bankman-Fried", "quote": "Bankman-Fried"},
    {"id": "wiki-alameda", "name": "Alameda Research (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Alameda_Research", "quote": "Alameda"},
    {"id": "wiki-ellison", "name": "Caroline Ellison (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Caroline_Ellison", "quote": "Ellison"},
    {"id": "wiki-bankruptcy", "name": "Bankruptcy of FTX (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Bankruptcy_of_FTX", "quote": "customer funds"},
    {"id": "wiki-cz", "name": "Changpeng Zhao (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Changpeng_Zhao", "quote": "Binance"},
    {"id": "wiki-ea", "name": "Effective altruism (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Effective_altruism", "quote": "effective altruism"},
    {"id": "wiki-binance", "name": "Binance (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Binance", "quote": "Binance"},
    {"id": "wiki-crypto", "name": "Cryptocurrency (Wikipedia)", "url": "https://en.wikipedia.org/wiki/Cryptocurrency", "quote": "cryptocurrency"},
]

YT = {
    "title": "FTX: Where $8 Billion of Customer Money Went",
    "alts": ["How FTX Lost $8 Billion of Customer Money", "FTX & Sam Bankman-Fried: The $8 Billion Fraud, Explained"],
    "hook": "In 2022, Sam Bankman-Fried was the most trusted man in crypto — FTX was worth $32 billion and he was the 'good billionaire' giving it all to charity. Then, in about 10 days, $8 billion of customer money vanished. The unsettling answer to where it went: it was secretly funneled to his trading firm Alameda through a backdoor in the code, propped up by a coin FTX printed itself. Here's exactly how it worked — fully cited.",
    "bullets": [
        "The two companies — FTX (the exchange) and Alameda (the gambling fund)",
        "The backdoor in the code that let Alameda borrow unlimited customer money",
        "FTT: the token FTX printed and used as its own collateral (the Enron trick)",
        "The CoinDesk leak + CZ's tweet that triggered the fastest bank run in history",
        "The 9-day collapse, the arrest, and the 25-year sentence",
        "The lesson: 'not your keys, not your coins' — your exchange balance is an IOU",
    ],
    "tags": [
        "ftx", "ftx collapse", "sam bankman-fried", "sbf", "how ftx collapsed", "alameda research",
        "caroline ellison", "changpeng zhao", "binance", "ftt token", "crypto crash", "crypto fraud",
        "crypto explained", "bank run", "effective altruism", "sbf trial", "economics explained",
        "Napkin Numbers",
    ],
    "thumbnail": {"hookTop": "WHERE DID FTX'S", "hookBot": "$8 BILLION GO?", "napkinNumber": "$8B", "napkinSub": "…gone in 10 days", "deco": "token"},
    "chapters": [
        ["the most trusted man in crypto", "The golden boy"],
        ["you need two companies", "The two companies"],
        ["printed its own money", "The FTT trick"],
        ["every tower built on one block", "The collapse"],
        ["Sam was arrested", "The aftermath"],
        ["back to the question", "The lesson"],
    ],
}

ep = {
    "id": "EP015", "series": "Napkin Numbers", "title": "FTX: Where $8 Billion Went",
    "slug": "ftx-where-8-billion-went", "market": "US", "language": "en",
    "voice": {"provider": "edge", "voiceId": "en-US-BrianNeural", "accent": "natural"},
    "note": "FTX — full style: animated metaphors, varied doodles, real photos, mascot ~16%.",
    "scenes": S, "sources": SOURCES, "youtube": YT,
}
pathlib.Path("episodes/examples/EP015-ftx.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/scenes.json").write_text(json.dumps(S, indent=2, ensure_ascii=False))
pathlib.Path("render/src/data/thumb.json").write_text(json.dumps(YT["thumbnail"], indent=2))

words = sum(len(s["narration"].split()) for s in S)
from collections import Counter
cnt = Counter(s["type"] for s in S)
used_doodles = set()
for s in S:
    for p in s.get("props", []): used_doodles.add(p["name"])
    for ic in s.get("icons", []): used_doodles.add(ic)
    if s.get("icon"): used_doodles.add(s["icon"])
    for n in s.get("nodes", []):
        if n.get("icon"): used_doodles.add(n["icon"])
    for ev in s.get("events", []):
        if ev.get("icon"): used_doodles.add(ev["icon"])
print(f"scenes={len(S)} words={words} est={(words/171.3*60 + len(S)*0.5)/60:.2f} min  mascot={100*cnt['character']//len(S)}%")
print(cnt)
print(f"distinct doodles used: {len(used_doodles)}")
motifs = Counter(s.get("motif") for s in S if s["type"] == "stage" and s.get("motif"))
print("animated motifs:", dict(motifs))
