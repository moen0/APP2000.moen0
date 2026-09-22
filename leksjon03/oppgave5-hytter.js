// Kompilert output fra oppgave5-hytter.ts (target ES2020, ingen moduler).
// Denne fila lastes direkte av oppgave5-hytter.html slik at siden fungerer
// uten at man først må kjøre tsc.
"use strict";

const hytter = [
    {
        id: 1,
        navn: "Rondvassbu",
        type: "betjent",
        region: "Rondane",
        senger: 90,
        posisjon: { breddegrad: 61.919, lengdegrad: 9.847, hoyde_moh: 1170 },
        kontakt: {
            telefon: "+47 61 23 45 67",
            epost: "rondvassbu@dnt.no",
            booking_url: "https://dnt.no/hytter/rondvassbu"
        },
        fasiliteter: ["Middagsservering", "Dusj", "Strøm", "Butikk"],
        bilder: []
    },
    {
        id: 2,
        navn: "Fondsboden",
        type: "ubetjent",
        region: "Hardangervidda",
        senger: 8,
        posisjon: { breddegrad: 60.310, lengdegrad: 7.588, hoyde_moh: 1220 },
        kontakt: { booking_url: "https://dnt.no/hytter/fondsboden" },
        fasiliteter: ["Vedovn", "Proviantskap"],
        bilder: []
    },
    {
        id: 3,
        navn: "Glitterheim",
        type: "betjent",
        region: "Jotunheimen",
        senger: 76,
        posisjon: { breddegrad: 61.596, lengdegrad: 8.542, hoyde_moh: 1385 },
        kontakt: {
            telefon: "+47 61 21 20 74",
            booking_url: "https://dnt.no/hytter/glitterheim"
        },
        fasiliteter: ["Middagsservering", "Frokost", "Utleie av utstyr"],
        bilder: []
    }
];

function typeEtikett(type) {
    switch (type) {
        case "betjent": return "Betjent";
        case "selvbetjent": return "Selvbetjent";
        case "ubetjent": return "Ubetjent";
        default: return type;
    }
}

function lagKontaktLinje(k) {
    const p = document.createElement("p");
    const deler = [];
    if (k.telefon) deler.push(k.telefon);
    if (k.epost) deler.push(k.epost);
    p.textContent = deler.join("  |  ") || "Kun bookbar online";
    p.classList.add("meta");
    return p;
}

function lagHyttekort(hytte) {
    const kort = document.createElement("article");
    kort.classList.add("hyttekort");

    const tittel = document.createElement("h3");
    tittel.textContent = hytte.navn;
    kort.appendChild(tittel);

    const meta = document.createElement("p");
    meta.classList.add("meta");
    const typeSpan = document.createElement("span");
    typeSpan.textContent = typeEtikett(hytte.type);
    typeSpan.classList.add(hytte.type === "betjent" ? "type-betjent" : "type-ubetjent");
    meta.appendChild(typeSpan);
    meta.append(
        ` * ${hytte.region} * ${hytte.senger} senger * ${hytte.posisjon.hoyde_moh} moh`
    );
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

function visHytter(liste, container) {
    container.replaceChildren();
    for (const h of liste) {
        container.appendChild(lagHyttekort(h));
    }
}

const container = document.querySelector("#hytte-liste");
if (container) {
    visHytter(hytter, container);
}
