"use strict";

const datasettDef = {
    nedbor: {
        label: "Nedbør (mm)",
        farge: "#00509e",
        felt: "nedbor_mm",
        akseTittel: "Millimeter"
    },
    temperatur: {
        label: "Snittemperatur (°C)",
        farge: "#ff9800",
        felt: "snitt_temp_c",
        akseTittel: "Grader Celsius"
    }
};

let vaerdata = null;
let diagram = null;

function bygg(datasettNokkel) {
    if (!vaerdata) return;
    const konf = datasettDef[datasettNokkel];

    const data = {
        labels: vaerdata.maaneder,
        datasets: [{
            label: konf.label,
            data: vaerdata[konf.felt],
            backgroundColor: konf.farge,
            borderColor: konf.farge,
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `${konf.label} - ${vaerdata.sted} ${vaerdata.aar}`
            },
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: konf.akseTittel }
            }
        }
    };

    if (diagram) {
        diagram.data = data;
        diagram.options = options;
        diagram.update();
    } else {
        const ctx = document.querySelector("#diagram").getContext("2d");
        diagram = new Chart(ctx, { type: "bar", data, options });
    }
}

document.querySelectorAll(".bytt-knapp").forEach((knapp) => {
    knapp.addEventListener("click", () => {
        document.querySelectorAll(".bytt-knapp").forEach(k => k.classList.remove("aktiv"));
        knapp.classList.add("aktiv");
        bygg(knapp.dataset.datasett);
    });
});

async function last() {
    try {
        const res = await fetch("oppgave4-vaerdata.json");
        if (!res.ok) throw new Error("HTTP " + res.status);
        vaerdata = await res.json();
        document.querySelector("#sted").textContent = vaerdata.sted;
        bygg("nedbor");
    } catch (err) {
        const boks = document.querySelector(".diagram-boks");
        boks.textContent = "Kunne ikke laste værdata: " + err.message +
            " (siden må serveres via HTTP for at fetch skal fungere).";
    }
}
last();
