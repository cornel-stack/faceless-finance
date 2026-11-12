import json, re
from collections import OrderedDict

def C(**k): return k

scenes = []

# ---------- HOOK ----------
scenes += [
C(id="s1", type="character", pose="explain",
  narration="A four-year degree at a top American private university now carries a sticker price north of a quarter of a million dollars. The exact same four years in Germany costs a student almost nothing — tuition is zero. Same diploma, wildly different price tag. Today we rank what a degree actually costs in every country, and why America's is in a league of its own.",
  props=[C(name="gradcap", label="4 years of university"),
         C(name="dollar", label="US private: ~$240K"),
         C(name="globe", label="Germany: $0")]),

C(id="s2", type="callout",
  narration="Start with the number that breaks people's brains. A four-year bachelor's degree at a private US college now runs well over two hundred forty thousand dollars in tuition. In much of Europe, the same degree costs the student essentially nothing. It may be the widest price gap for one identical product anywhere in the modern economy.",
  text="$240,000", sub="4-year US private degree, sticker price", icon="dollar"),

C(id="s3", type="character", pose="present",
  narration="So today we rank tuition in every major country from free to brutal, expose exactly why the American price exploded while the rest of the world's didn't, tour the free-college model and its hidden trade-offs, and finally answer the only question that matters: with all that debt, is a degree even worth it anymore? Let's go.",
  props=[C(name="scale", label="rank every country"),
         C(name="chartup", label="why the US exploded"),
         C(name="diploma", label="is it worth it?")]),

C(id="s4", type="image", src="img/memes/drake.jpg", meme="Drake Hotline Bling",
  memeTop="pay $38,000 a year for tuition",
  memeBottom="fly to Germany and study for free",
  narration="Because for a growing number of students, the smartest financial move isn't picking a major — it's picking a country. Before we rank them, let's agree on what tuition even is."),
]

# ---------- BASICS ----------
scenes += [
C(id="s5", type="title", narration="First, the one word that decides everything: tuition.",
  heading="The Sticker Price", kicker="what you actually pay"),

C(id="s6", type="screenshot", sourceId="wiki-tuition",
  narration="Tuition is simply the fee an institution charges you for instruction. And here's the quiet fact most Americans never hear: across much of the developed world, that fee barely exists. In Scandinavia and continental Europe, there are no or only nominal tuition fees for all forms of education, university included. Free isn't a radical experiment there. It's the default."),

C(id="s7", type="character", pose="explain",
  narration="In the United States, college took the opposite path. It became, in practice, a product to be sold — with brochures, amenities, and a price that rises every single year. And almost uniquely, nobody caps that price. A school can charge whatever families, and the loans behind them, are willing to pay.",
  props=[C(name="school", label="college as a product"),
         C(name="pricetag", label="rises every year"),
         C(name="warning", label="no price cap")]),

C(id="s8", type="screenshot", sourceId="wiki-ushe",
  narration="That's not an accident — it's by design. The system is deliberately decentralized, and as the encyclopedia puts it, US higher education is loosely regulated by the government. Nearly four thousand degree-granting institutions each set their own prices, with no national ceiling. Loose regulation is exactly how you get a thousand different prices for the same credential."),
]

# ---------- THE RANKING ----------
scenes += [
C(id="s9", type="title", narration="So let's line the whole world up, cheapest to most expensive.",
  heading="The Ranking", kicker="tuition by country"),

C(id="s10", type="stage", motif="tuitionbars",
  caption="average annual tuition, by country",
  narration="Here's the planet on one chart. Germany, Norway, and most of the Nordics: zero. France: a few hundred dollars, basically nominal. Canada and Australia sit in the middle, a few thousand a year. England caps its fees around eleven thousand. And then, alone at the top, the United States — where a private college charges nearly forty thousand dollars a year."),

C(id="s11", type="chart", chartType="bar", title="Tuition per year by country ($K)", unit="$K",
  narration="Put the hard numbers side by side. Germany, zero. France, about one thousand. Canada, around seven. Australia, roughly eight. England, about eleven. And a US private university, near thirty-eight thousand dollars a year. The American bar doesn't just win — it towers over every other country on Earth.",
  data=[C(label="Germany", value=0), C(label="France", value=1), C(label="Canada", value=7),
        C(label="Australia", value=8), C(label="UK", value=11), C(label="US private", value=38)],
  highlight=5),

C(id="s12", type="character", pose="explain",
  narration="Sit with the size of that gap. At the extremes, a single year at a US private school costs more than an entire four-year degree in half of Europe. An American family can pay thirty times what a German family pays — for a credential that, on paper, does the exact same job in the labor market.",
  props=[C(name="dollar", label="1 US year > 4 EU years"),
         C(name="scale", label="up to 30× the price"),
         C(name="diploma", label="same credential")]),

C(id="s13", type="callout",
  narration="There's the headline ratio. Per year, a US private degree can cost around thirty times what a student pays in tuition-free Germany. Nowhere else in modern life does the identical product carry a thirty-fold price difference depending purely on which border you were born behind.",
  text="30×", sub="US private tuition vs Germany, per year", icon="percent"),

C(id="s14", type="compare",
  narration="Zoom out to the full four years and it's even starker. In Germany, the all-in tuition bill for a bachelor's degree rounds to zero. At a private US university, that same four years can clear a quarter of a million dollars in tuition alone. One student walks out owing nothing. The other walks out owing a house.",
  left=C(title="Germany, 4-year tuition", value="~$0", icon="globe"),
  right=C(title="US private, 4-year tuition", value="~$240K", icon="dollar")),
]

# ---------- WHY US SO EXPENSIVE ----------
scenes += [
C(id="s15", type="title", narration="Which raises the obvious question: why is America so expensive?",
  heading="Why America Costs More", kicker="four forces"),

C(id="s16", type="stage", motif="whyustuition",
  caption="the four engines of runaway tuition",
  narration="Four forces drive it. First, no price caps — schools charge whatever they like. Second, easy loans, which quietly let colleges raise prices knowing students can borrow more. Third, administrative bloat: campuses now hire more administrators than teaching staff. And fourth, college sold as a product — luxury dorms, climbing walls, all baked into your tuition."),

C(id="s17", type="stage", motif="tuitioninflationcurve",
  caption="US tuition vs everything else since 1980",
  narration="And this is what those forces did over forty years. Since nineteen eighty, the general price of everything roughly tripled. US college tuition rose by well over a thousand percent — outpacing normal inflation by about three to one, year after year, decade after decade. No other consumer price in America ran this hot for this long."),

C(id="s18", type="screenshot", sourceId="wiki-loans",
  narration="At the center of it sits the loan machine. By twenty eighteen, seventy percent of higher education graduates had used loans to cover some or all of their expenses. Borrowing isn't the exception in America — it's the norm. And when almost everyone can borrow, schools discover they can raise the price almost without limit.",
  ),

C(id="s19", type="character", pose="explain",
  narration="Economists even have a name for this feedback loop. The theory goes that every time the government expands student loans, colleges simply raise tuition to capture the extra money. The aid meant to make college affordable gets quietly swallowed by the price itself — so students borrow more, and end up no better off.",
  props=[C(name="banknote", label="more loans available"),
         C(name="chartup", label="schools raise tuition"),
         C(name="warning", label="aid gets swallowed")]),

C(id="s20", type="character", pose="explain",
  narration="Then there's the arms race almost nobody mentions: bureaucracy. Over recent decades the number of college administrators ballooned far faster than the number of professors. Someone has to pay those salaries, those glossy buildings, those marketing budgets — and that someone is you, through a tuition line that never stops climbing.",
  props=[C(name="officetower", label="administrators ballooned"),
         C(name="paystub", label="their salaries, your bill"),
         C(name="pricetag", label="tuition climbs")]),

C(id="s21", type="image", src="img/memes/twobuttons.jpg", meme="Two Buttons",
  memeTop="go $100,000 into debt",
  memeBottom="learn German and pay nothing",
  narration="This is the real dilemma facing a smart eighteen-year-old today. One button is six figures of debt for a domestic degree. The other is a passport and a free one abroad. More and more students are starting to eye that second button — and the free-college countries know it."),
]

# ---------- FREE COLLEGE MODEL ----------
scenes += [
C(id="s22", type="title", narration="So how does free college actually work — and what's the catch?",
  heading="The Free Model", kicker="who really pays"),

C(id="s23", type="stage", motif="freecollegemodel",
  caption="how 'free' college is actually funded",
  narration="Free college isn't magic — it's a transfer. Taxpayers fund it through higher taxes, the government pays the universities, and students walk in owing zero tuition. The cost doesn't vanish; it moves. Instead of landing on one eighteen-year-old as crushing personal debt, it's spread thinly across every worker in the country."),

C(id="s24", type="screenshot", sourceId="wiki-free",
  narration="That's the textbook definition. Free education is education funded through government spending or charitable organizations rather than tuition funding. The word free is doing a lot of lifting — it means free at the point of use. Society still pays in full. It just chooses to pay collectively, upfront, through the tax system."),

C(id="s25", type="character", pose="explain",
  narration="And that model comes with real trade-offs. Taxes are higher — noticeably higher — across the free-college countries. Universities are often more selective, with fewer seats, so entry can be fiercely competitive. And budgets are political, meaning the funding can be squeezed when governments tighten their belts. Free, but not frictionless.",
  props=[C(name="receipt", label="higher taxes"),
         C(name="barrier", label="fewer, pickier slots"),
         C(name="warning", label="budget-dependent")]),

C(id="s26", type="character", pose="explain",
  narration="So which is fairer? The American system says the person who benefits should pay — you get the degree, you carry the cost. The European system says an educated population benefits everyone, so everyone chips in. Neither is free. One bills the individual; the other bills the nation. That single philosophical choice explains almost the entire price gap.",
  props=[C(name="scale", label="user pays vs all pay"),
         C(name="crowd", label="who benefits?"),
         C(name="globe", label="a national choice")]),
]

# ---------- THE DEBT ----------
scenes += [
C(id="s27", type="title", narration="Now follow the money all the way to graduation day.",
  heading="The Debt", kicker="what grads owe"),

C(id="s28", type="chart", chartType="bar", title="Average debt per graduate ($K)", unit="$K",
  narration="Here's what the average graduate actually owes, by country. Germany and France: a couple thousand, basically a rounding error. Canada and Australia: in the twenties. The United States: around thirty-eight thousand. And the shock at the top — England, near sixty thousand, the highest paper debt in the world. But that English number hides a twist.",
  data=[C(label="Germany", value=2), C(label="France", value=3), C(label="Canada", value=20),
        C(label="Australia", value=24), C(label="US", value=38), C(label="UK", value=57)],
  highlight=5),

C(id="s29", type="character", pose="explain",
  narration="The twist is how the debt behaves. England's loans are income-contingent: you repay a small slice of income above a threshold, and whatever's left is wiped after thirty years. Australia runs the same gentle system. American debt is the opposite — it accrues interest relentlessly, and it's brutally hard to erase, even in bankruptcy.",
  props=[C(name="shield", label="UK/AU: income-contingent"),
         C(name="ballchain", label="US: relentless interest"),
         C(name="warning", label="hard to ever erase")]),

C(id="s30", type="callout",
  narration="And the American pile is staggering in aggregate. Collectively, US borrowers now owe over one point seven trillion dollars in student debt — more than the entire country owes on credit cards or car loans. It's a debt the size of a major economy, carried on the backs of people who just wanted an education.",
  text="$1.7T", sub="total US student debt — more than all credit cards", icon="debtclock"),

C(id="s31", type="image", src="img/memes/thisisfine.jpg", meme="This Is Fine",
  memeTop="$38,000 in loans, $44,000 starting salary",
  memeBottom="this is fine",
  narration="For millions of American grads, this is the morning after the ceremony: a five-figure balance, interest already ticking, and a first paycheck that barely covers rent and the minimum payment. Which forces the hardest question of all — after all of that, is the degree even worth it?"),
]

# ---------- IS IT WORTH IT ----------
scenes += [
C(id="s32", type="title", narration="Time for the uncomfortable cost-benefit math.",
  heading="Is It Worth It?", kicker="the degree premium"),

C(id="s33", type="stage", motif="collegeroi",
  caption="the college wage premium — if the debt stays sane",
  narration="Start with the good news, because it's real. On average, a bachelor's degree still pays. US workers with no degree earn around forty-four thousand a year; those with a bachelor's, closer to seventy. Over a full career, that gap compounds into a serious lead. Education economics has studied this relationship for decades."),

C(id="s34", type="screenshot", sourceId="wiki-edecon",
  narration="That's exactly what this field exists to measure. Education economics studies the demand for education, its financing, and crucially, the comparative efficiency of various educational programs. Translation: not every degree pays off equally. The return depends enormously on what you study — and on how much you paid to study it."),

C(id="s35", type="callout",
  narration="Averaged across a lifetime, a US bachelor's degree is associated with roughly one point two million dollars in extra earnings compared to a high-school diploma. That's a genuinely huge number — the single best argument for going to college. But an average hides winners and losers, and the losers are getting more common.",
  text="$1.2M", sub="lifetime earnings premium of a US bachelor's degree", icon="moneybag"),

C(id="s36", type="character", pose="explain",
  narration="Because that premium isn't evenly shared. An engineering or nursing degree can pay for itself in a few years. A degree in a low-wage field, bought at a private school for two hundred grand, might never break even. The equation is simple and ruthless: your return is the salary your field commands, minus the price you paid to enter it.",
  props=[C(name="chartup", label="engineering: pays fast"),
         C(name="chartdown", label="low-wage field: may not"),
         C(name="scale", label="salary minus price")]),

C(id="s37", type="character", pose="explain",
  narration="And this is precisely why the price gap matters so much. A German engineer and an American engineer might earn similar salaries — but the German started that career with zero debt, while the American started thirty or forty thousand in the hole. Same degree, same job, but one of them spent a decade just climbing back to zero.",
  props=[C(name="handshake", label="similar salaries"),
         C(name="ballchain", label="US starts in the hole"),
         C(name="hourglass", label="a decade to break even")]),
]

# ---------- WHAT TO DO / CLOSE ----------
scenes += [
C(id="s38", type="title", narration="So what should you actually do with all this?",
  heading="What To Do", kicker="smarter than the sticker"),

C(id="s39", type="character", pose="present",
  narration="If you're an American, the single biggest lever is where you enroll. An in-state public university often costs a third of a private one for a nearly identical education. Starting at a community college and transferring can halve the bill again. The name on the diploma matters far less than the debt behind it.",
  props=[C(name="school", label="in-state public = 1/3 price"),
         C(name="books", label="community college transfer"),
         C(name="scissors", label="cut the debt, not the degree")]),

C(id="s40", type="character", pose="present",
  narration="Here's the option almost no one considers: leave. Germany, Norway, and a growing list of countries offer free or near-free degrees — many taught entirely in English, open to international students. For the price of one year at a US private school, you could fund an entire degree abroad, passport stamps included.",
  props=[C(name="luggage", label="study abroad"),
         C(name="globe", label="free, taught in English"),
         C(name="gradcap", label="1 US year = a full degree")]),

C(id="s41", type="character", pose="present",
  narration="And whatever you choose, obey one rule: never borrow more than you expect to earn in your first year out. Owe forty thousand, aim for a field that starts around forty. Cross that line and the debt stops being an investment and becomes an anchor. Run the number before you sign, not after.",
  props=[C(name="calculator", label="borrow < first-year salary"),
         C(name="warning", label="cross it = an anchor"),
         C(name="paystub", label="run it before you sign")]),

C(id="s42", type="character", pose="explain",
  narration="Because here's the real lesson of the whole global map. The degree itself isn't the scam — education genuinely pays. The scam is the price. The rest of the developed world proved you can educate a population without burying it in debt. America chose a different path, and an entire generation is paying the interest.",
  props=[C(name="diploma", label="the degree isn't the scam"),
         C(name="pricetag", label="the price is"),
         C(name="globe", label="the world chose differently")]),

C(id="s43", type="character", pose="explain",
  narration="So before you sign away your twenties, zoom out and ask the question the sticker price hopes you won't: not just which school, but which system, which country, which field. In a world where the exact same degree ranges from totally free to a quarter-million dollars, where you choose to study is the biggest financial decision you'll make before thirty.",
  props=[C(name="globe", label="which country?"),
         C(name="scale", label="free to $240K"),
         C(name="gradcap", label="biggest call before 30")]),

C(id="s44", type="character", pose="celebrate", expression="happy",
  narration="If this finally made the true cost of a degree make sense, hit subscribe — and tell me which price tag you want me to break down next.",
  props=[C(name="diploma", label="which price tag next?")]),

C(id="s45", type="character", pose="celebrate", expression="happy",
  narration="I do the reading. You get the parts that matter.",
  props=[C(name="newspaper", label="…what matters")]),
]

# ---------- DEPTH SPLICE ----------
ins = OrderedDict()

ins["s6"] = [C(id="s46", type="character", pose="explain",
  narration="And this split is decades deep. Generations of Europeans went to university without ever seeing a tuition bill, treating higher education like a public road or a library — infrastructure, not a luxury. Americans grew up assuming massive debt is simply the price of admission to the middle class.",
  props=[C(name="globe", label="free for generations"),
         C(name="bridge", label="education as infrastructure"),
         C(name="ballchain", label="US: debt as normal")])]

ins["s11"] = [C(id="s47", type="character", pose="explain",
  narration="And notice the sticker price isn't even the whole bill. In America, tuition is just the headline. Add room, board, fees, books, and living costs and a single year at a private school can clear eighty thousand dollars. The forty-thousand tuition figure is the floor of the American price — not the ceiling.",
  props=[C(name="receipt", label="tuition is just the start"),
         C(name="house", label="+ room, board, fees"),
         C(name="warning", label="~$80K all-in per year")])]


ins["s17"] = [C(id="s49", type="character", pose="explain",
  narration="And the cruelest part of that curve is who it hit. For older generations, a summer job could genuinely cover a year of tuition. Today, that same year can cost more than many workers earn in an entire year. College went from a cheap ticket to the middle class to one of the largest debts a young person will ever take on.",
  props=[C(name="calendar", label="once: a summer job"),
         C(name="chartup", label="now: a year's salary"),
         C(name="ballchain", label="a lifelong debt")])]

ins["s25"] = [C(id="s50", type="character", pose="explain",
  narration="And the free model isn't limited to Europe. Public universities across Latin America charge little or nothing. Many Asian systems heavily subsidize tuition. Scotland is free for its own students while England charges. Over and over, the same pattern: the United States isn't the global norm for expensive college — it's the global outlier.",
  props=[C(name="globe", label="free across many regions"),
         C(name="mappin", label="Scotland free, England not"),
         C(name="warning", label="the US is the outlier")])]

ins["s30"] = [C(id="s51", type="character", pose="explain",
  narration="And that mountain of debt reshapes a whole economy. Buried under loans, young Americans delay buying homes, starting families, and launching businesses. A system meant to build the middle class now quietly postpones the very milestones that define it.",
  props=[C(name="house", label="homes delayed"),
         C(name="baby", label="families delayed"),
         C(name="hourglass", label="milestones postponed")])]

ins["s40"] = [C(id="s53", type="character", pose="present",
  narration="And hunt relentlessly for free money before you borrow a cent. Scholarships, grants, and employer tuition programs are left unclaimed every single year because nobody applied. Every dollar of aid you win is a dollar you never have to repay with interest. Treat chasing it like a part-time job — because financially, it pays like one.",
  props=[C(name="trophy", label="scholarships & grants"),
         C(name="handshake", label="employer tuition aid"),
         C(name="moneybag", label="free beats borrowed")])]

ins["s43"] = [C(id="s54", type="character", pose="explain",
  narration="And watch where the world is drifting. As American tuition climbs and free-college countries open their doors to foreign students, the smartest young people are quietly voting with their feet. In the end, a country that prices education like a luxury may slowly export its own future.",
  props=[C(name="luggage", label="students voting with feet"),
         C(name="globe", label="studying where it's cheap"),
         C(name="warning", label="exporting the future")])]

# interleave
out = []
for sc in scenes:
    out.append(sc)
    if sc["id"] in ins:
        out.extend(ins[sc["id"]])

ep = C(
  id="EP085", series="Napkin Numbers",
  title="The Real Cost of a Degree in Every Country",
  slug="cost-of-a-degree-every-country",
  market="US", language="en",
  voice=C(provider="edge", voiceId="en-US-BrianNeural", accent="natural"),
  note="EP085 — The Price Tag series (topic 75). Rank university tuition by country: free in Germany/Nordics vs ~$38K/yr at a US private college; why US tuition exploded (no caps, loan-fueled inflation, admin bloat, college-as-product), the tuition-inflation curve, the free-college model + trade-offs (higher taxes, selective), debt per grad (UK highest on paper but income-contingent; US $1.7T), is it worth it (the ~$1.2M wage premium, but field- and price-dependent), what to do (in-state/community college/study abroad/borrow<first-year-salary). Chart-heavy. 4 new motifs (tuitionbars/tuitioninflationcurve/whyustuition/freecollegemodel) + reuse collegeroi. Sources: Tuition payments/Higher education in the US/Student loans in the US/Education economics/Free education. Distinct from EP077 (student-debt tiers). Density bar EP044/45. Target 14-15 min.",
  scenes=out,
  sources=[
    C(id="wiki-tuition", name="Tuition payments (Wikipedia)",
      url="https://en.wikipedia.org/wiki/Tuition_payments",
      quote="there are no or only nominal tuition fees for all forms of education"),
    C(id="wiki-ushe", name="Higher education in the United States (Wikipedia)",
      url="https://en.wikipedia.org/wiki/Higher_education_in_the_United_States",
      quote="higher education is loosely regulated by the government"),
    C(id="wiki-loans", name="Student loans in the United States (Wikipedia)",
      url="https://en.wikipedia.org/wiki/Student_loans_in_the_United_States",
      quote="70 percent of higher education graduates had used loans to cover some or all of their expenses"),
    C(id="wiki-free", name="Free education (Wikipedia)",
      url="https://en.wikipedia.org/wiki/Free_education",
      quote="education funded through government spending or charitable organizations rather than tuition funding"),
    C(id="wiki-edecon", name="Education economics (Wikipedia)",
      url="https://en.wikipedia.org/wiki/Education_economics",
      quote="the comparative efficiency of various educational programs"),
  ],
  youtube=C(
    title="The Real Cost of a Degree in Every Country",
    alts=["The True Cost of College: Every Country Ranked",
          "Why College Is Free in Europe and $240K in America"],
    hook="A four-year degree at a top US private university now costs over $240,000 — the exact same degree in Germany costs a student $0. This is the real cost of a university degree in every country, ranked: free in Germany, Norway and most of the Nordics, nearly free in France, a few thousand in Canada and Australia, ~£9-11K capped in England, and up to ~$38K per year at a US private college. We expose why American tuition exploded (no price caps, loan-fueled inflation, administrative bloat, college sold as a product), tour how 'free' college is actually funded (and its real trade-offs — higher taxes, selective entry), rank average student debt per graduate by country (the UK twist: highest on paper but income-contingent; US student debt now tops $1.7 trillion), and answer the big one: is a degree even worth it? (The ~$1.2M lifetime wage premium — but it depends on your field and the price you paid.) Plus exactly how to pay far less: in-state public, community-college transfer, studying abroad, and never borrowing more than your first-year salary. Fully cited.",
    bullets=[
      "Tuition ranked by country: $0 in Germany vs ~$38K/yr US private",
      "Why US tuition exploded: no caps, easy loans, admin bloat",
      "How 'free' college really works — and its hidden trade-offs",
      "Debt per grad by country: the UK vs US twist",
      "Is a degree worth it? The $1.2M premium, with a catch",
      "How to pay far less: in-state, transfer, and study abroad",
    ],
    tags=["cost of college", "college tuition", "student debt", "is college worth it",
          "free college", "study abroad", "college in europe vs america", "tuition by country",
          "student loans", "cost of a degree", "money explained", "Napkin Numbers"],
    hashtags=["#collegecost", "#studentdebt", "#tuition", "#personalfinance"],
    thumbnail=C(hookTop="A DEGREE COSTS", hookBot="EVERY COUNTRY RANKED",
                napkinNumber="$0 vs $240K", napkinSub="Germany vs US private",
                deco="gradcap"),
    chapters=[
      ["the one word that decides everything", "The sticker price"],
      ["line the whole world up", "The ranking"],
      ["why is America so expensive", "Why America costs more"],
      ["how does free college actually work", "The free model"],
      ["follow the money all the way to graduation", "The debt"],
      ["the uncomfortable cost-benefit math", "Is it worth it?"],
      ["what should you actually do", "What to do"],
      ["the real lesson of the whole global map", "The lesson"],
    ],
  ),
)

with open("episodes/examples/EP085-degree-cost-price-tag.json", "w") as f:
    json.dump(ep, f, indent=2, ensure_ascii=False)

# word count
words = sum(len(s["narration"].split()) for s in out)
print("scenes:", len(out), "words:", words, "est min:", round(words/165, 2))
# chapter needle check
narr = " ".join(s["narration"] for s in out)
for needle, t in ep["youtube"]["chapters"]:
    print(("OK " if needle in narr else "MISS ") + needle)
