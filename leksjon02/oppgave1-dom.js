"use strict";

// hentes én gang, defer i HTML-en sikrer at elementene finnes
const tekstfelt = document.querySelector("#tekstfelt");
const leggTilKnapp = document.querySelector("#leggTilKnapp");
const container = document.querySelector("#avsnittContainer");

function leggTilAvsnitt() {
    const tekst = tekstfelt.value.trim();   // trim så bare mellomrom ikke blir et avsnitt
    if (tekst === "") {
        tekstfelt.classList.add("feil");    // rød ramme i stedet for alert
        tekstfelt.focus();
        return;
    }
    tekstfelt.classList.remove("feil");

    const p = document.createElement("p");
    p.textContent = tekst;              // textContent, ikke innerHTML: input skal ikke tolkes som HTML
    p.classList.add("avsnitt");
    p.title = "Klikk for å fjerne";
    container.appendChild(p);

    tekstfelt.value = "";               // klar for neste avsnitt
    tekstfelt.focus();
}

leggTilKnapp.addEventListener("click", leggTilAvsnitt);

// enter skal gjøre det samme som knappen
tekstfelt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        leggTilAvsnitt();
    }
});

// én lytter på containeren, virker også for avsnitt som lages senere
container.addEventListener("click", (e) => {
    if (e.target.classList.contains("avsnitt")) {   // e.target er avsnittet, ikke containeren
        e.target.remove();
    }
});
