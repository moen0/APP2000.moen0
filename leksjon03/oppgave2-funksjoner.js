"use strict";

// 1) Funksjon som tar en overskrift som parameter og genererer et h1-element.
function lagH1(tekst) {
    const h = document.createElement("h1");
    h.textContent = tekst;
    return h;
}

// 2) Funksjon som tar en overskrift og et tall mellom 1 og 3 og genererer
//    en overskrift på nivå 1, 2 eller 3.
function lagOverskrift(tekst, niva) {
    if (!Number.isInteger(niva) || niva < 1 || niva > 3) {
        throw new RangeError("niva må være 1, 2 eller 3");
    }
    const h = document.createElement("h" + niva);
    h.textContent = tekst;
    return h;
}

// 3) Funksjon som tar en liste av tekststrenger og genererer en HTML-punktliste.
function lagPunktliste(strenger) {
    const ul = document.createElement("ul");
    for (const s of strenger) {
        const li = document.createElement("li");
        li.textContent = s;
        ul.appendChild(li);
    }
    return ul;
}

// Vise demo ved lasting
const utskrift = document.querySelector("#utskrift");
utskrift.appendChild(lagH1("Dette er en H1"));
utskrift.appendChild(lagOverskrift("Dette er en H2", 2));
utskrift.appendChild(lagOverskrift("Dette er en H3", 3));
utskrift.appendChild(lagPunktliste(["Kart", "Hytter", "Fellesturer", "Vaervarsel"]));

// Interaktiv test-form
const testskjema = document.querySelector("#testskjema");
const testUtskrift = document.querySelector("#test-utskrift");

testskjema.addEventListener("submit", (e) => {
    e.preventDefault();
    testUtskrift.replaceChildren();

    const data = new FormData(testskjema);
    const tekst = (data.get("tekst") || "").toString();
    const niva = Number(data.get("niva"));
    const punkter = (data.get("punkter") || "").toString()
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    try {
        testUtskrift.appendChild(lagOverskrift(tekst, niva));
    } catch (err) {
        const p = document.createElement("p");
        p.style.color = "#c62828";
        p.textContent = "Feil: " + err.message;
        testUtskrift.appendChild(p);
    }
    if (punkter.length > 0) {
        testUtskrift.appendChild(lagPunktliste(punkter));
    }
});
