"use strict";

const tekstfelt = document.querySelector("#tekstfelt");
const leggTilKnapp = document.querySelector("#leggTilKnapp");
const container = document.querySelector("#avsnittContainer");

function leggTilAvsnitt() {
    const tekst = tekstfelt.value.trim();
    if (tekst === "") {
        tekstfelt.classList.add("feil");
        tekstfelt.focus();
        return;
    }
    tekstfelt.classList.remove("feil");

    const p = document.createElement("p");
    p.textContent = tekst;
    p.classList.add("avsnitt");
    p.title = "Klikk for å fjerne";
    container.appendChild(p);

    tekstfelt.value = "";
    tekstfelt.focus();
}

leggTilKnapp.addEventListener("click", leggTilAvsnitt);

tekstfelt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        leggTilAvsnitt();
    }
});

container.addEventListener("click", (e) => {
    if (e.target.classList.contains("avsnitt")) {
        e.target.remove();
    }
});
