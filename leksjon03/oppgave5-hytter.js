/**
 * Henter hyttedata fra JSON-fila ved siden av HTML-siden.
 *
 * Merk: `as Hytte[]` overbeviser bare kompilatoren. JSON som kommer utenfra
 * er utypet ved kjøretid, så neste steg er en type guard (se rapporten).
 */
export async function hentHytter(url = "oppgave5-hytter.json") {
    const respons = await fetch(url);
    if (!respons.ok) {
        throw new Error(`Klarte ikke å laste ${url} (HTTP ${respons.status})`);
    }
    return await respons.json();
}
export function typeEtikett(type) {
    switch (type) {
        case "betjent": return "Betjent";
        case "selvbetjent": return "Selvbetjent";
        case "ubetjent": return "Ubetjent";
    }
}
export function lagKontaktLinje(k) {
    const p = document.createElement("p");
    const deler = [];
    if (k.telefon)
        deler.push(k.telefon);
    if (k.epost)
        deler.push(k.epost);
    p.textContent = deler.join("  |  ") || "Kun bookbar online";
    p.classList.add("meta");
    return p;
}
export function lagHyttekort(hytte) {
    const kort = document.createElement("article");
    kort.classList.add("hyttekort");
    const tittel = document.createElement("h3");
    tittel.textContent = hytte.navn;
    kort.appendChild(tittel);
    const meta = document.createElement("p");
    meta.classList.add("meta");
    const typeSpan = document.createElement("span");
    typeSpan.textContent = typeEtikett(hytte.type);
    typeSpan.classList.add(`type-${hytte.type}`);
    meta.appendChild(typeSpan);
    meta.append(` * ${hytte.region} * ${hytte.senger} senger * ${hytte.posisjon.hoyde_moh} moh`);
    kort.appendChild(meta);
    kort.appendChild(lagKontaktLinje(hytte.kontakt));
    const fasilOverskrift = document.createElement("strong");
    fasilOverskrift.textContent = "Fasiliteter:";
    kort.appendChild(fasilOverskrift);
    const ul = document.createElement("ul");
    for (const f of hytte.fasiliteter) {
        const li = document.createElement("li");
        li.textContent = f;
        ul.appendChild(li);
    }
    kort.appendChild(ul);
    if (hytte.kontakt.booking_url) {
        const a = document.createElement("a");
        a.href = hytte.kontakt.booking_url;
        a.textContent = "Book hytte";
        a.rel = "noopener";
        a.target = "_blank";
        kort.appendChild(a);
    }
    return kort;
}
export function visHytter(hytter, container) {
    container.replaceChildren();
    for (const h of hytter) {
        container.appendChild(lagHyttekort(h));
    }
}
const container = document.querySelector("#hytte-liste");
if (container) {
    hentHytter()
        .then(hytter => visHytter(hytter, container))
        .catch((feil) => {
        container.textContent = "Kunne ikke laste hyttedata fra " +
            "oppgave5-hytter.json. Sjekk at siden åpnes via en webserver " +
            "(IntelliJ sin innebygde, eller python3 -m http.server).";
        console.error(feil);
    });
}
