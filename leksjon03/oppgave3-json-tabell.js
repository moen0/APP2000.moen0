"use strict";

function bygTabell(rader, container) {
    container.replaceChildren();

    if (!Array.isArray(rader) || rader.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Ingen data å vise.";
        container.appendChild(p);
        return;
    }

    const kolonner = Object.keys(rader[0]);

    const tabell = document.createElement("table");
    tabell.classList.add("datatabell");

    const thead = document.createElement("thead");
    const hodeRad = document.createElement("tr");
    for (const kol of kolonner) {
        const th = document.createElement("th");
        th.textContent = kol;
        hodeRad.appendChild(th);
    }
    thead.appendChild(hodeRad);
    tabell.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const rad of rader) {
        const tr = document.createElement("tr");
        for (const kol of kolonner) {
            const td = document.createElement("td");
            const verdi = rad[kol];
            td.textContent = verdi === null || verdi === undefined ? "" : String(verdi);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    tabell.appendChild(tbody);

    container.appendChild(tabell);
}

// Last inn turer-datasettet fra JSON-fila og bygg tabell.
async function hovedprogram() {
    const container = document.querySelector("#tabell-container");
    try {
        const res = await fetch("oppgave3-turer.json");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        bygTabell(data, container);
    } catch (err) {
        container.textContent = "Kunne ikke laste JSON: " + err.message +
            " (siden må serveres via HTTP for at fetch skal fungere).";
    }
}
hovedprogram();

// Demonstrer at samme funksjon fungerer for et annet datasett.
const hytter = [
    { navn: "Rondvassbu",  betjent: true,  senger: 90,  hoyde_moh: 1170 },
    { navn: "Glitterheim", betjent: true,  senger: 76,  hoyde_moh: 1385 },
    { navn: "Øystre Slidre", betjent: false, senger: 12, hoyde_moh: 940 },
    { navn: "Fondsboden", betjent: false, senger: 8,   hoyde_moh: 720 }
];
bygTabell(hytter, document.querySelector("#tabell-container-2"));
