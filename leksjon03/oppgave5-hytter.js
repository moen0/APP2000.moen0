// henter hyttedata fra JSON-fila som ligger ved siden av HTML-siden
export async function hentHytter(url = "oppgave5-hytter.json") {
    const respons = await fetch(url);
    if (!respons.ok) { // fetch kaster ikke feil på 404, må sjekkes selv
        throw new Error(`Klarte ikke å laste ${url} (HTTP ${respons.status})`);
    }
    return await respons.json(); // as overbeviser bare kompilatoren, ingen sjekk ved kjøretid
}
// ingen default: en fjerde hyttetype gir kompileringsfeil her
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
    p.textContent = deler.join("  |  ") || "Kun bookbar online"; // tom join gir tom streng, som er falsy
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
    typeSpan.classList.add(`type-${hytte.type}`); // klassen bygges av verdien: type-betjent osv.
    meta.appendChild(typeSpan);
    meta.append(// append tar tekst, appendChild tar bare elementer
    ` * ${hytte.region} * ${hytte.senger} senger * ${hytte.posisjon.hoyde_moh} moh`);
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
    if (hytte.kontakt.booking_url) { // lenka lages bare hvis feltet finnes
        const a = document.createElement("a");
        a.href = hytte.kontakt.booking_url;
        a.textContent = "Book hytte";
        a.rel = "noopener";
        a.target = "_blank";
        kort.appendChild(a);
    }
    return kort; // kalleren bestemmer hvor kortet havner, det gjør funksjonen lett å teste
}
export function visHytter(hytter, container) {
    container.replaceChildren(); // tømmer først, ellers dobles kortene ved nytt kall
    for (const h of hytter) {
        container.appendChild(lagHyttekort(h));
    }
}
const container = document.querySelector("#hytte-liste");
if (container) { // strict tvinger oss til å utelukke null før bruk
    hentHytter() // .then fordi await på toppnivå krever module es2022
        .then(hytter => visHytter(hytter, container))
        .catch((feil) => {
        container.textContent = "Kunne ikke laste hyttedata fra " +
            "oppgave5-hytter.json. Sjekk at siden åpnes via en webserver " +
            "(IntelliJ sin innebygde, eller python3 -m http.server).";
        console.error(feil);
    });
}
