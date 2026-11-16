#!/usr/bin/env python3
"""Build thumbnails/manifest.json for all 100 Finance topics.

Each entry drives the ClickbaitThumb Remotion still. Topics 1-85 reuse the
youtube.thumbnail spec already authored in their episode JSON (EPID = topic+10);
topics 86-100 use authored fallbacks below. Real-face cutouts are added only where
the topic genuinely features those people (FACE_MAP), using portraits that exist in
render/public/img. Output filenames: "N.<Title>.png" (sanitised)."""
import json, glob, os, re

TOPICS = [
 (1,"Why Every Country Is in Debt (and Who They Actually Owe)"),
 (2,"Why Nobody Can Afford a House Anymore, in Four Charts"),
 (3,"The 1973 Crash Nobody Remembers (and Why It Looks Like 2026)"),
 (4,"How Enron Actually Made Its Money Disappear"),
 (5,"FTX: Where $8 Billion of Customer Money Went"),
 (6,"Why Different Currencies Have Different Values"),
 (7,"What Happens When a Country Goes Bankrupt"),
 (8,"Why the Middle Class Is Disappearing (the Data Nobody Shows)"),
 (9,"Living Paycheck to Paycheck on $300K: How It Happens"),
 (10,"How Banks Create Money From Nothing"),
 (11,"The Stock Market Is Being Used as a Dumping Ground (the IPO Data)"),
 (12,"The AI Bubble Survives on Hidden Debt"),
 (13,"If War Is Bad, Why Do Stocks Go Up?"),
 (14,"Why America Keeps Bailing Out Other Countries' Currencies"),
 (15,"Tariffs: Who Really Pays (the Receipts)"),
 (16,"What If Inflation Goes Negative?"),
 (17,"Why Prices Won't Stop Rising: Inflation by the Numbers"),
 (18,"Why Countries Want Weaker Currencies"),
 (19,"Crypto Is a Brilliant Scam and Here Is the Math"),
 (20,"Theranos: The $700M That Vanished"),
 (21,"Madoff by the Numbers: How $65 Billion Never Existed"),
 (22,"Why the Rich Pretend to Be Poor"),
 (23,"The Fastest Way to Get Poor (the Data)"),
 (24,"Why Markets Panic When Central Banks Speak"),
 (25,"Private Equity Keeps Killing Your Favorite Brands"),
 (26,"How Scammers Rig the Stock Market"),
 (27,"Why Japan Is Stuck (and Still Rich Anyway)"),
 (28,"The Petrodollar: America's Most Powerful Weapon"),
 (29,"Why the Dumbest Investors Win"),
 (30,"Wirecard: The $2 Billion That Never Existed"),
 (31,"Lehman Brothers: The 72 Hours That Broke the World"),
 (32,"The Dot-Com Bubble by the Numbers (and the 2026 Echo)"),
 (33,"How Credit Cards Actually Make Money Off You"),
 (34,"Every Type of Investor Explained (and Who Wins)"),
 (35,"Mutual Funds vs Index Funds vs ETFs vs Hedge Funds"),
 (36,"Why the Era of US Dominance Is (Mathematically) Ending"),
 (37,"What Happens If the Dollar Loses Reserve Status"),
 (38,"Why Gold Is Doing Something It Has Never Done"),
 (39,"How Debt Became the Most Profitable Product in History"),
 (40,"Why Fiat Money Has Value"),
 (41,"Your Money at Every Level: $0 to $100 Million (Real Fed Data)"),
 (42,"Net Worth by Age in 2026: Where Do You Rank?"),
 (43,"How Much You Should Have Saved by 25, 30, 40, 50"),
 (44,"How Banks Treat You at Every Level of Wealth"),
 (45,"How Much Money You Need to Retire at 40, 50, 55, 65"),
 (46,"What Happens If You Invest $100 a Month at Every Age"),
 (47,"What $1,000 Invested Became, Every Year Since 1950"),
 (48,"Every Level of Salary: What $30K to $1M Actually Buys"),
 (49,"How Much House You Can Afford at Every Salary"),
 (50,"Every Level of Debt: From $0 to $1 Million Owed"),
 (51,"Cost of Living at Every Level: Every US State Ranked"),
 (52,"Every Level of Rich: Comfortable, Wealthy, Rich, Ultra-Rich"),
 (53,"Your Retirement at Every Savings Rate: 5% to 50%"),
 (54,"Every Level of Passive Income: $100 to $10,000 a Month"),
 (55,"How the Average American's Money Changes Every Decade of Life"),
 (56,"Every Level of Millionaire: $1M to $1B and What Changes"),
 (57,"What Each Credit Score Costs You Over a Lifetime"),
 (58,"Every Level of Inheritance: $10K to $100M and What the Government Takes"),
 (59,"Every Level of Home Ownership: From First Rent to Paid-Off"),
 (60,"Every Level of the Stock Market Crash: -10% to -80%, What Happened Next"),
 (61,"Every Level of Interest Rate: 0% to 20% and Who Wins"),
 (62,"Every Level of Emergency Fund: $0 to 2 Years and Who Survives"),
 (63,"Your Life at Every Level of 401(k) Balance"),
 (64,"Every Level of Side Income: What $500 to $10K Extra a Month Does"),
 (65,"Every Level of Rent: $800 to $8,000 and What It Costs You by 65"),
 (66,"Every Level of Car Payment: What a $300 vs $1,200 Payment Costs You"),
 (67,"Every Level of Student Debt: $10K to $300K and the Payoff Math"),
 (68,"Every Level of Lottery Win: $1K to $1B and What's Left"),
 (69,"Every Level of Retirement Age: 40 to 70 and the Math"),
 (70,"Every Level of Compound Interest: 1% to 15% Over 40 Years"),
 (71,"Why Nobody Can Afford Canada Anymore"),
 (72,"Why Are Houses So Expensive? US vs UK vs Canada vs Australia"),
 (73,"The True Cost of Healthcare in Every Country"),
 (74,"Housing Market 2026: Every US State Ranked"),
 (75,"The Real Cost of a Degree in Every Country"),
 (76,"Most Expensive Cities to Live In, Ranked by What You Keep"),
 (77,"Rent in Every Major City vs the Salary You Need"),
 (78,"The Real Cost of Having a Baby in Every Country"),
 (79,"The Cost of Retiring in Every Country"),
 (80,"Why Everything Got So Expensive: Every Category Ranked"),
 (81,"Gas, Groceries, Rent: What a Week Costs in Every US State"),
 (82,"The Cost of a Car Over 10 Years in Every State"),
 (83,"Taxes: What You Keep From $100K in Every US State"),
 (84,"Taxes: What You Keep From $100K in the US vs UK vs Canada vs Australia"),
 (85,"The Cost of Childcare in Every State vs a Second Salary"),
 (86,"Top 10 Countries by Inflation Rate (and Why)"),
 (87,"Minimum Wage vs Rent in Every US State"),
 (88,"The Cost of Dying: Funerals, Probate and Estate Tax by State"),
 (89,"Electricity, Internet, Phone: Monthly Bills in Every Country"),
 (90,"What a Doctor Visit Costs in Every Country"),
 (91,"The Price of a Big Mac in Every Country (and What It Reveals)"),
 (92,"Fastest-Growing US Cities and What They Cost Now"),
 (93,"How Much the Average Person Owns in Gold, Stocks and Cash, by Country"),
 (94,"Every Country Ranked by Household Debt"),
 (95,"The Cost of Starting a Business in Every State"),
 (96,"Insurance: What Car, Home and Health Cost in Every State"),
 (97,"What a Wedding Costs in Every State vs What It Should"),
 (98,"GDP per Capita vs What People Actually Earn, Every Country"),
 (99,"The Price of Everything in 1970 vs 2026"),
 (100,"How Much $1 Million Is Really Worth in Every Country"),
]

# Real faces only where the topic genuinely features them. slug must exist in render/public/img.
FACE_MAP = {
 3:[("nixon","1973")],
 4:[("lay","Lay"),("skilling","Skilling")],
 5:[("sbf","SBF"),("cz","CZ")],
 6:[("soros","Soros")],
 17:[("volcker","Volcker")],
 20:[("holmes","Holmes")],
 21:[("madoff","Madoff")],
 22:[("warren","Buffett"),("musk","Musk"),("zuckerberg","Zuckerberg")],
 24:[("powell","Powell")],
 26:[("belfort","Belfort")],
 27:[("abe","Abe"),("kuroda","Kuroda")],
 28:[("nixon","Nixon"),("kissinger","Kissinger")],
 29:[("bogle","Bogle"),("warren","Buffett")],
 30:[("braun","Braun"),("marsalek","Marsalek")],
 31:[("fuld","Fuld"),("paulson","Paulson")],
 32:[("greenspan","Greenspan"),("bezos","Bezos")],
 34:[("warren","Buffett"),("soros","Soros"),("graham","Graham")],
 35:[("bogle","Bogle"),("dalio","Dalio")],
 40:[("nixon","Nixon")],
 41:[("rockefeller","Rockefeller"),("munger","Munger")],
 47:[("warren","Buffett")],
 52:[("bezos","Bezos"),("rockefeller","Rockefeller")],
 56:[("warren","Buffett"),("munger","Munger")],
 60:[("livermore","Livermore")],
 61:[("powell","Powell")],
 70:[("warren","Buffett")],
}

# Authored specs for not-yet-built topics 86-100 (no episode JSON yet).
FALLBACK = {
 86:("INFLATION GONE","COMPLETELY MAD","200%+","top countries' yearly inflation","chartup"),
 87:("MINIMUM WAGE vs","THE RENT","0 states","where min wage covers a 1-bed","apartment"),
 88:("DYING ISN'T","FREE EITHER","$8,000+","funeral + probate + estate, by state","tombstone"),
 89:("YOUR MONTHLY BILLS","AROUND THE WORLD","10×","electricity+internet+phone gap","phone"),
 90:("A DOCTOR VISIT:","$0 OR $300","$0 vs $300","same visit, by country","hospital"),
 91:("THE BIG MAC","INDEX","$2 vs $8","same burger, by country","grocerybag"),
 92:("AMERICA'S BOOMTOWNS","AND THE CATCH","+40%","price surge in the fastest-growing cities","risingcity"),
 93:("WHAT YOU OWN","BY COUNTRY","gold vs cash","the average person's assets","goldbar"),
 94:("WHO OWES THE","MOST?","200%+","household debt vs income, by country","debtclock"),
 95:("STARTING A BUSINESS","IN EVERY STATE","$0 vs $1,000s","fees to launch, by state","store"),
 96:("INSURANCE:","EVERY STATE","3× gap","car + home + health premiums","shield"),
 97:("THE REAL COST OF","SAYING 'I DO'","$30,000","average wedding, by state","champagne"),
 98:("YOUR COUNTRY IS RICH","ARE YOU?","GDP vs PAY","per-capita vs real wages","scale"),
 99:("1970 vs 2026:","THE REAL PRICES","10×","what everything cost then vs now","pricetag"),
 100:("$1 MILLION","ISN'T WHAT YOU THINK","$1M = ?","real purchasing power, by country","moneystack"),
}

def sanitize(title):
    t = title.split("(")[0].strip()          # drop parentheticals for the filename
    t = t.replace(":", " -").replace("?", "").replace("/", " ").replace('"', "")
    t = re.sub(r"\s+", " ", t).strip()
    return t

def epid_for(num):
    # NOT a clean topic+10: EP025 (private equity, topic 25) was made early, which
    # shifted topics 15-24 to EPID=topic+11. See [[napkin-numbers-progress]].
    if 1 <= num <= 14: return num + 10      # topics 1-14  -> EP011-EP024
    if num == 25:      return 25            # topic 25     -> EP025 (early)
    if 15 <= num <= 24: return num + 11     # topics 15-24 -> EP026-EP035
    if 26 <= num <= 85: return num + 10     # topics 26-85 -> EP036-EP095
    return None                              # 86-100 not yet built

def ep_thumb(num):
    epid = epid_for(num)
    if epid is None: return None
    hits = glob.glob(f"episodes/examples/EP{epid:03d}-*.json")
    hits = [h for h in hits if ".clips." not in h]
    if not hits: return None
    try:
        ep = json.load(open(hits[0]))
    except Exception:
        return None
    th = (ep.get("youtube") or {}).get("thumbnail")
    if not th: return None
    return (th.get("hookTop",""), th.get("hookBot",""), th.get("napkinNumber",""),
            th.get("napkinSub",""), th.get("deco","moneybag"))

manifest = []
missing = []
for num, title in TOPICS:
    spec = ep_thumb(num) or FALLBACK.get(num)
    if not spec:
        # last-ditch generic
        spec = (title.upper()[:22], "BY THE NUMBERS", "?", title, "moneybag")
    hookTop, hookBot, big, sub, deco = spec
    faces = [{"slug": s, "label": l} for (s, l) in FACE_MAP.get(num, [])]
    for f in faces:
        if not os.path.exists(f"render/public/img/{f['slug']}.jpg"):
            missing.append((num, f["slug"]))
    manifest.append({
        "num": num, "title": title,
        "file": f"{num}.{sanitize(title)}.png",
        "hookTop": hookTop, "hookBot": hookBot,
        "bigNumber": big, "sub": sub, "deco": deco,
        "faces": faces,
    })

os.makedirs("thumbnails", exist_ok=True)
json.dump(manifest, open("thumbnails/manifest.json", "w"), indent=2, ensure_ascii=False)
withface = sum(1 for m in manifest if m["faces"])
print(f"wrote thumbnails/manifest.json — {len(manifest)} topics, {withface} with real faces")
if missing:
    print("MISSING PORTRAITS:", missing)
