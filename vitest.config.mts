import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        // leksjon03/ inneholder både oppgave5-hytter.ts og den kompilerte
        // oppgave5-hytter.js. Vite leter normalt etter .js før .ts, og da
        // ville testene kjørt mot kompilert - og kanskje utdatert - kode.
        // Her setter vi .ts først, slik at vi alltid tester kildekoden.
        extensions: [".ts", ".js", ".json"]
    }
});
