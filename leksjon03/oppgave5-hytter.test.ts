// @vitest-environment jsdom
//
// Enhetstester for visning av hyttedata (leksjon 3, arbeidskrav 5).
// Kjøres med: npm test   (fra APP2000.moen0/)
//
// Docblock-kommentaren over forteller vitest at denne testfilen skal kjøre i
// jsdom - en JavaScript-implementasjon av DOM-en. Da finnes document og
// createElement i Node.js, uten at vi trenger en nettleser.

import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
    hentHytter,
    lagHyttekort,
    lagKontaktLinje,
    typeEtikett,
    visHytter,
    type Hytte
} from "./oppgave5-hytter";

// Én testhytte vi gjenbruker. Spread-operatoren under lar hver test
// overstyre bare de feltene den er interessert i.
const testhytte: Hytte = {
    id: 99,
    navn: "Testhytta",
    type: "betjent",
    region: "Testheimen",
    senger: 12,
    posisjon: { breddegrad: 60.0, lengdegrad: 10.0, hoyde_moh: 900 },
    kontakt: {
        telefon: "+47 11 22 33 44",
        epost: "test@dnt.no",
        booking_url: "https://dnt.no/hytter/testhytta"
    },
    fasiliteter: ["Vedovn", "Dusj", "Strøm"],
    bilder: []
};

describe("typeEtikett", () => {
    it("gir stor forbokstav for alle tre hyttetypene", () => {
        expect(typeEtikett("betjent")).toBe("Betjent");
        expect(typeEtikett("selvbetjent")).toBe("Selvbetjent");
        expect(typeEtikett("ubetjent")).toBe("Ubetjent");
    });
});

describe("lagHyttekort", () => {
    it("viser navnet i en h3", () => {
        const kort = lagHyttekort(testhytte);
        expect(kort.querySelector("h3")?.textContent).toBe("Testhytta");
    });

    it("returnerer et article-element med klassen hyttekort", () => {
        const kort = lagHyttekort(testhytte);
        expect(kort.tagName).toBe("ARTICLE");
        expect(kort.classList.contains("hyttekort")).toBe(true);
    });

    it("lager én li per fasilitet", () => {
        const kort = lagHyttekort(testhytte);
        const punkter = kort.querySelectorAll("li");
        expect(punkter).toHaveLength(3);
        expect([...punkter].map(li => li.textContent))
            .toEqual(["Vedovn", "Dusj", "Strøm"]);
    });

    it("tar med metadata om region, senger og høyde", () => {
        const kort = lagHyttekort(testhytte);
        const meta = kort.querySelector(".meta")?.textContent ?? "";
        expect(meta).toContain("Testheimen");
        expect(meta).toContain("12 senger");
        expect(meta).toContain("900 moh");
    });

    it("lager bookinglenke når booking_url finnes", () => {
        const lenke = lagHyttekort(testhytte).querySelector("a");
        expect(lenke?.getAttribute("href"))
            .toBe("https://dnt.no/hytter/testhytta");
        expect(lenke?.rel).toBe("noopener");
    });

    it("dropper bookinglenka når booking_url mangler", () => {
        const utenBooking: Hytte = {
            ...testhytte,
            kontakt: { telefon: "+47 11 22 33 44" }
        };
        expect(lagHyttekort(utenBooking).querySelector("a")).toBeNull();
    });
});

describe("lagKontaktLinje", () => {
    it("skiller telefon og e-post med loddrett strek", () => {
        const p = lagKontaktLinje({ telefon: "12345678", epost: "a@b.no" });
        expect(p.textContent).toBe("12345678  |  a@b.no");
    });

    // Dette er poenget med de valgfrie feltene telefon? og epost? i
    // Kontakt-interfacet: koden må håndtere at de ikke finnes.
    it("faller tilbake på standardtekst når begge felt mangler", () => {
        const p = lagKontaktLinje({ booking_url: "https://dnt.no" });
        expect(p.textContent).toBe("Kun bookbar online");
    });
});

describe("visHytter", () => {
    const liste: Hytte[] = [
        testhytte,
        { ...testhytte, id: 100, navn: "Andre hytta", type: "selvbetjent" }
    ];
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="hytte-liste"></div>';
        container = document.querySelector("#hytte-liste") as HTMLElement;
    });

    it("lager ett kort per hytte i lista", () => {
        visHytter(liste, container);
        expect(container.querySelectorAll(".hyttekort")).toHaveLength(2);
    });

    it("tømmer containeren før ny visning, så kortene ikke dobles", () => {
        visHytter(liste, container);
        visHytter(liste, container);
        expect(container.querySelectorAll(".hyttekort")).toHaveLength(2);
    });

    it("håndterer tom liste uten å feile", () => {
        container.innerHTML = "<p>gammelt innhold</p>";
        visHytter([], container);
        expect(container.children).toHaveLength(0);
    });
});

describe("hentHytter", () => {
    it("returnerer hyttene fra JSON-responsen", async () => {
        // Vi bytter ut fetch med en stubb, slik at testen ikke trenger
        // nettverk eller en kjørende webserver.
        vi.stubGlobal("fetch", vi.fn(async () => ({
            ok: true,
            status: 200,
            json: async () => [testhytte]
        })));

        const resultat = await hentHytter("uansett.json");
        expect(resultat).toHaveLength(1);
        expect(resultat[0].navn).toBe("Testhytta");
        vi.unstubAllGlobals();
    });

    it("kaster feil når responsen ikke er ok", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => ({
            ok: false,
            status: 404,
            json: async () => []
        })));

        await expect(hentHytter("finnes-ikke.json"))
            .rejects.toThrow("HTTP 404");
        vi.unstubAllGlobals();
    });
});

describe("oppgave5-hytter.json", () => {
    // Leser fila rett fra disk, så testen fanger opp hvis noen ødelegger
    // JSON-en eller fjerner et felt interfacet krever.
    // Stien er relativ til prosjektrota, altså der npm test kjøres fra.
    const data = JSON.parse(
        readFileSync("leksjon03/oppgave5-hytter.json", "utf-8")
    ) as Hytte[];

    it("er en liste med tre hytter", () => {
        expect(Array.isArray(data)).toBe(true);
        expect(data).toHaveLength(3);
    });

    it("inneholder underobjekter og arrays, slik oppgaven krever", () => {
        for (const h of data) {
            expect(typeof h.posisjon.hoyde_moh).toBe("number");
            expect(Array.isArray(h.fasiliteter)).toBe(true);
            expect(h.fasiliteter.length).toBeGreaterThan(0);
            expect(Array.isArray(h.bilder)).toBe(true);
        }
    });

    it("bruker bare lovlige verdier for hyttetype", () => {
        const lovlige = ["betjent", "selvbetjent", "ubetjent"];
        for (const h of data) {
            expect(lovlige).toContain(h.type);
        }
    });

    it("kan rendres med visHytter", () => {
        document.body.innerHTML = '<div id="hytte-liste"></div>';
        const container = document.querySelector("#hytte-liste") as HTMLElement;
        visHytter(data, container);
        expect(container.querySelectorAll(".hyttekort")).toHaveLength(3);
        expect(container.querySelector("h3")?.textContent).toBe("Rondvassbu");
    });
});
