# Nastavení odesílání e-mailů (Gmail + Vercel)

Poptávkový formulář posílá **dva e-maily**, oba odeslané z účtu
`josefpufr@gmail.com`:

| E-mail | Komu | Reply-To (kam půjde odpověď) |
| --- | --- | --- |
| Notifikace o nové poptávce | `josefpufr@email.cz` | zákazníkovi |
| Potvrzení přijetí poptávky | zákazníkovi | `josefpufr@email.cz` |

Gmail se používá jen jako **odesílací brána** (SMTP). Provozní schránka, kterou
budeš číst, zůstává `josefpufr@email.cz`.

---

## Krok 1 — Zapnout dvoufázové ověření na Gmailu

Bez dvoufázového ověření Google heslo aplikace vůbec nenabídne.

1. Přihlas se do účtu **josefpufr@gmail.com**.
2. Jdi na <https://myaccount.google.com/security>.
3. Sekce **„Jak se přihlašujete do Googlu"** → **Dvoufázové ověření** →
   **Zapnout**. Projdi ověření telefonem.

## Krok 2 — Vygenerovat heslo aplikace

Tohle je to „speciální heslo se speciálním oprávněním", které hledáš. Je to
16znakový kód, který platí **jen pro odesílání pošty** — nedá se s ním
přihlásit do účtu, číst e-maily ani nic měnit. Kdykoli ho můžeš zneplatnit,
aniž bys měnil heslo k účtu.

Google odkaz na hesla aplikací v menu schoval — proklikat se k němu přes
Zabezpečení prakticky nejde. Použij přímý odkaz:

1. Jdi na <https://myaccount.google.com/apppasswords>.

   Kdyby odkaz nefungoval, další dvě cesty:
   - **Vyhledávání v účtu:** <https://myaccount.google.com> → nahoře pole
     **„Prohledat účet Google"** → napiš `hesla aplikací` → klikni na výsledek.
   - **Proklik:** Zabezpečení → **Dvoufázové ověření** → otevřít → sjet
     **úplně dolů** → **Hesla aplikací**.

   Když stránka hlásí, že volba není dostupná, není to o hledání — účet ji má
   zakázanou. Viz „Hesla aplikací se vůbec nezobrazí" na konci dokumentu.

2. Do pole názvu napiš např. `Web J. Pufr` a dej **Vytvořit**.
3. Google zobrazí kód ve tvaru `abcd efgh ijkl mnop`.
   **Zkopíruj ho hned — po zavření okna se už nikdy nezobrazí.**
4. Mezery můžeš nechat i smazat, funguje obojí. Doporučuju smazat:
   `abcdefghijklmnop`.

> Kód nikam neposílej a nedávej do gitu. Když ho ztratíš nebo unikne, na stejné
> stránce ho smažeš a vygeneruješ nový — web pak jen přepíšeš ve Vercelu.

## Krok 3 — Vyplnit proměnné ve Vercelu

Vercel Dashboard → projekt → **Settings** → **Environment Variables** →
**Add New**. Přidej těchto pět položek. U každé zaškrtni všechna tři prostředí:
**Production**, **Preview** i **Development**.

| Key | Value | Odkud to je |
| --- | --- | --- |
| `SMTP_HOST` | `smtp.gmail.com` | pevná hodnota Gmailu |
| `SMTP_PORT` | `465` | pevná hodnota (SSL) |
| `SMTP_USER` | `josefpufr@gmail.com` | odesílací účet |
| `SMTP_PASS` | `abcdefghijklmnop` | heslo aplikace z Kroku 2 |
| `MAIL_TO` | `josefpufr@email.cz` | kam chodí poptávky |

Pár poznámek:

- **`SMTP_PASS` označ jako `Sensitive`** (přepínač u pole). Vercel ji pak už
  nikdy nezobrazí, jen přepíše — což je přesně to, co chceš.
- `MAIL_FROM` nastavovat nemusíš. Gmail hlavičku `From` stejně přepíše na
  `SMTP_USER`, takže by to nic neudělalo.
- `MAIL_TO` je nepovinné — když ho vynecháš, použije se `siteConfig.email`
  ze `src/lib/site.ts`, což je taky `josefpufr@email.cz`. Explicitně nastavené
  je ale lepší: měníš adresu pro poptávky bez zásahu do kódu a nasazování.

## Krok 4 — Přenasadit

Proměnné prostředí se načtou až při buildu. Existující nasazení je samo od sebe
nepřevezme.

Vercel → **Deployments** → u posledního nasazení menu **⋯** → **Redeploy**.

## Krok 5 — Vyzkoušet

Otevři web, vyplň poptávkový formulář a odešli. Do minuty by mělo dorazit:

- do `josefpufr@email.cz` — „Nová poptávka…"
- na adresu, kterou jsi zadal do formuláře — „Potvrzení přijetí poptávky"

První potvrzení se občas schová do **Hromadné/Spam** — pokud tam je, označ
„Není spam", ať se to příště doručí správně.

---

## Lokální vývoj

Vytvoř si soubor `.env.local` (je v `.gitignore`, do repozitáře se nedostane)
podle vzoru v `.env.example`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=josefpufr@gmail.com
SMTP_PASS=abcdefghijklmnop
MAIL_TO=josefpufr@email.cz
```

Když `SMTP_*` proměnné **nevyplníš**, kód se nezhroutí — přepne se na testovací
schránku [Ethereal](https://ethereal.email/). Nic se doopravdy neodešle a do
konzole se vypíše odkaz na náhled vygenerovaného e-mailu. Na zkoušení vzhledu
e-mailů je to ideální.

---

## Hesla aplikací se vůbec nezobrazí

Když <https://myaccount.google.com/apppasswords> hlásí, že volba není dostupná,
účet ji má zakázanou. Důvody podle četnosti:

1. **Není zapnuté dvoufázové ověření.** Zdaleka nejčastější — bez něj Google
   hesla aplikací nenabídne. Zapni na
   <https://myaccount.google.com/signinoptions/two-step-verification>.
2. **Jako druhý faktor máš jen passkey nebo bezpečnostní klíč.** Přidej ještě
   telefon (SMS nebo výzvu Google), jinak zůstane volba zamčená.
3. **Zapnutá Pokročilá ochrana** (Advanced Protection) — ta hesla aplikací
   zakazuje úplně.
4. **Firemní/školní účet (Workspace)** — správce je může mít vypnutá. Běžného
   účtu `@gmail.com` se to netýká.

## Když to nefunguje

| Chyba v logu (Vercel → Deployments → Functions → `/api/send-email`) | Příčina |
| --- | --- |
| `Invalid login: 535-5.7.8 Username and Password not accepted` | Špatné nebo zrušené heslo aplikace, případně je v `SMTP_PASS` normální heslo k účtu. Vygeneruj nové heslo aplikace. |
| `Connection timeout` / `ETIMEDOUT` | Nesedí `SMTP_PORT`. Pro `465` musí být SSL, pro `587` STARTTLS — kód to řeší automaticky podle čísla portu, takže stačí mít 465 nebo 587. |
| E-mail nedorazil, ale v logu není chyba | Podívej se do spamu. Případně ověř, že `MAIL_TO` je opravdu `josefpufr@email.cz` bez překlepu. |
| `Daily user sending limit exceeded` | Gmail zdarma zvládne ~500 e-mailů denně. Pro běžný provoz víc než dost. |

## Omezení Gmailu, o kterých je dobré vědět

- **Odesílatel bude vždy `josefpufr@gmail.com`**, i kdyby v `MAIL_FROM` bylo
  něco jiného. Až budeš mít vlastní doménu, dá se v Gmailu nastavit ověřený
  alias (např. `info@pufr.cz`) přes Nastavení → Účty → „Odeslat poštu jako".
  Pak teprve `MAIL_FROM` začne fungovat.
- **~500 e-mailů denně** u bezplatného účtu.
- Kdyby web někdy posílal opravdu hodně pošty, je na místě přejít na službu
  určenou pro transakční e-maily (Resend, Postmark). Do té doby je Gmail
  naprosto v pořádku.
