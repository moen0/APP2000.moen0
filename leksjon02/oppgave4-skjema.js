"use strict";

const skjema = document.querySelector("#påmeldingsskjema");
const kvitteringSeksjon = document.querySelector("#kvitteringSeksjon");
const kvittering = document.querySelector("#kvittering");

function visFeil(felt, melding) {
    const boks = skjema.querySelector(`[data-felt="${felt}"]`);
    if (boks) boks.textContent = melding;
    const felt_el = skjema.elements[felt];
    if (felt_el) felt_el.classList.toggle("js-feil", Boolean(melding));
}

function nullstillFeil() {
    skjema.querySelectorAll(".feilmelding").forEach(b => b.textContent = "");
    skjema.querySelectorAll(".js-feil").forEach(el => el.classList.remove("js-feil"));
}

function valider() {
    nullstillFeil();
    let ok = true;

    const data = new FormData(skjema);
    const navn = (data.get("navn") || "").toString().trim();
    const epost = (data.get("epost") || "").toString().trim();
    const mobil = (data.get("mobil") || "").toString().trim();
    const alder = Number(data.get("alder"));
    const tur = (data.get("tur") || "").toString();
    const antall = Number(data.get("antall"));
    const startdato = (data.get("startdato") || "").toString();
    const ledsager = skjema.elements["ledsager"].checked;

    // HTML5-validering først (dekker required, type, pattern, min/max)
    if (!skjema.checkValidity()) {
        const felt = ["navn", "epost", "mobil", "alder", "tur", "antall", "startdato"];
        for (const f of felt) {
            const el = skjema.elements[f];
            if (el && !el.validity.valid) {
                visFeil(f, el.validationMessage);
                ok = false;
            }
        }
    }

    // JS-regler som HTML5 ikke kan uttrykke:

    // 1. Startdato minst 3 dager frem i tid
    if (startdato) {
        const valgt = new Date(startdato);
        const grense = new Date();
        grense.setHours(0, 0, 0, 0);
        grense.setDate(grense.getDate() + 3);
        if (valgt < grense) {
            visFeil("startdato", "Startdato må være minst 3 dager frem i tid.");
            ok = false;
        }
    }

    // 2. Antall deltakere kan ikke overstige kapasiteten på den valgte turen
    const valgt = skjema.elements["tur"].selectedOptions[0];
    if (valgt && valgt.dataset.kapasitet) {
        const kapasitet = Number(valgt.dataset.kapasitet);
        if (antall > kapasitet) {
            visFeil("antall", `Denne turen har plass til ${kapasitet}. Du ba om ${antall}.`);
            ok = false;
        }
    }

    // 3. Ledsager krever at brukeren selv er 18+
    if (ledsager && alder < 18) {
        visFeil("ledsager", "Du må være 18 år for å ta med ledsager under 18.");
        ok = false;
    }

    return ok
        ? { navn, epost, mobil, alder, tur, antall, startdato, ledsager }
        : null;
}

skjema.addEventListener("submit", (e) => {
    e.preventDefault();
    const resultat = valider();
    if (!resultat) {
        kvitteringSeksjon.hidden = true;
        return;
    }
    kvittering.textContent = JSON.stringify(resultat, null, 2);
    kvitteringSeksjon.hidden = false;
    kvitteringSeksjon.scrollIntoView({ behavior: "smooth", block: "start" });
});

skjema.addEventListener("reset", () => {
    nullstillFeil();
    kvitteringSeksjon.hidden = true;
});

// Live-validering på input for umiddelbar tilbakemelding
skjema.addEventListener("input", (e) => {
    const felt = e.target.name;
    if (!felt) return;
    const boks = skjema.querySelector(`[data-felt="${felt}"]`);
    if (boks && e.target.validity.valid) {
        boks.textContent = "";
        e.target.classList.remove("js-feil");
    }
});
