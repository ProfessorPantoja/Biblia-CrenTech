
export interface BibleBook {
  name: string;
  abbrev: string[];
  chapters: number;
}

export const BIBLE_BOOKS: BibleBook[] = [
  { name: "Gênesis", abbrev: ["gn", "gen"], chapters: 50 },
  { name: "Êxodo", abbrev: ["ex", "exo"], chapters: 40 },
  { name: "Levítico", abbrev: ["lv", "lev"], chapters: 27 },
  { name: "Números", abbrev: ["nm", "num"], chapters: 36 },
  { name: "Deuteronômio", abbrev: ["dt", "deut"], chapters: 34 },
  { name: "Josué", abbrev: ["js", "jos"], chapters: 24 },
  { name: "Juízes", abbrev: ["jz", "juiz"], chapters: 21 },
  { name: "Rute", abbrev: ["rt", "rut"], chapters: 4 },
  { name: "1 Samuel", abbrev: ["1sm", "1sam"], chapters: 31 },
  { name: "2 Samuel", abbrev: ["2sm", "2sam"], chapters: 24 },
  { name: "1 Reis", abbrev: ["1rs", "1reis"], chapters: 22 },
  { name: "2 Reis", abbrev: ["2rs", "2reis"], chapters: 25 },
  { name: "1 Crônicas", abbrev: ["1cr", "1cron"], chapters: 29 },
  { name: "2 Crônicas", abbrev: ["2cr", "2cron"], chapters: 36 },
  { name: "Esdras", abbrev: ["ed", "esd"], chapters: 10 },
  { name: "Neemias", abbrev: ["ne", "neem"], chapters: 13 },
  { name: "Ester", abbrev: ["et", "est"], chapters: 10 },
  { name: "Jó", abbrev: ["job", "job"], chapters: 42 },
  { name: "Salmos", abbrev: ["sl", "sal", "salmo"], chapters: 150 },
  { name: "Provérbios", abbrev: ["pv", "prov"], chapters: 31 },
  { name: "Eclesiastes", abbrev: ["ec", "ecl"], chapters: 12 },
  { name: "Cânticos", abbrev: ["ct", "cant"], chapters: 8 },
  { name: "Isaías", abbrev: ["is", "isa"], chapters: 66 },
  { name: "Jeremias", abbrev: ["jr", "jer"], chapters: 52 },
  { name: "Lamentações", abbrev: ["lm", "lam"], chapters: 5 },
  { name: "Ezequiel", abbrev: ["ez", "eze"], chapters: 48 },
  { name: "Daniel", abbrev: ["dn", "dan"], chapters: 12 },
  { name: "Oseias", abbrev: ["os", "ose"], chapters: 14 },
  { name: "Joel", abbrev: ["jl", "joe"], chapters: 3 },
  { name: "Amós", abbrev: ["am", "amo"], chapters: 9 },
  { name: "Obadias", abbrev: ["ob", "oba"], chapters: 1 },
  { name: "Jonas", abbrev: ["jn", "jon"], chapters: 4 },
  { name: "Miqueias", abbrev: ["mq", "miq"], chapters: 7 },
  { name: "Naum", abbrev: ["na", "nau"], chapters: 3 },
  { name: "Habacuque", abbrev: ["hc", "hab"], chapters: 3 },
  { name: "Sofonias", abbrev: ["sf", "sof"], chapters: 3 },
  { name: "Ageu", abbrev: ["ag", "age"], chapters: 2 },
  { name: "Zacarias", abbrev: ["zc", "zac"], chapters: 14 },
  { name: "Malaquias", abbrev: ["ml", "mal"], chapters: 4 },
  { name: "Mateus", abbrev: ["mt", "mat"], chapters: 28 },
  { name: "Marcos", abbrev: ["mc", "mar"], chapters: 16 },
  { name: "Lucas", abbrev: ["lc", "luc"], chapters: 24 },
  { name: "João", abbrev: ["jo", "joao"], chapters: 21 },
  { name: "Atos", abbrev: ["at", "atos"], chapters: 28 },
  { name: "Romanos", abbrev: ["rm", "rom"], chapters: 16 },
  { name: "1 Coríntios", abbrev: ["1co", "1cor"], chapters: 16 },
  { name: "2 Coríntios", abbrev: ["2co", "2cor"], chapters: 13 },
  { name: "Gálatas", abbrev: ["gl", "gal"], chapters: 6 },
  { name: "Efésios", abbrev: ["ef", "efe"], chapters: 6 },
  { name: "Filipenses", abbrev: ["fp", "fil"], chapters: 4 },
  { name: "Colossenses", abbrev: ["cl", "col"], chapters: 4 },
  { name: "1 Tessalonicenses", abbrev: ["1ts", "1tes"], chapters: 5 },
  { name: "2 Tessalonicenses", abbrev: ["2ts", "2tes"], chapters: 3 },
  { name: "1 Timóteo", abbrev: ["1tm", "1tim"], chapters: 6 },
  { name: "2 Timóteo", abbrev: ["2tm", "2tim"], chapters: 4 },
  { name: "Tito", abbrev: ["tt", "tit"], chapters: 3 },
  { name: "Filemom", abbrev: ["fm", "file"], chapters: 1 },
  { name: "Hebreus", abbrev: ["hb", "heb"], chapters: 13 },
  { name: "Tiago", abbrev: ["tg", "tia"], chapters: 5 },
  { name: "1 Pedro", abbrev: ["1pe", "1ped"], chapters: 5 },
  { name: "2 Pedro", abbrev: ["2pe", "2ped"], chapters: 3 },
  { name: "1 João", abbrev: ["1jo", "1joa"], chapters: 5 },
  { name: "2 João", abbrev: ["2jo", "2joa"], chapters: 1 },
  { name: "3 João", abbrev: ["3jo", "3joa"], chapters: 1 },
  { name: "Judas", abbrev: ["jd", "jud"], chapters: 1 },
  { name: "Apocalipse", abbrev: ["ap", "apo", "apoc"], chapters: 22 },
];

export const searchBibleBooks = (query: string): BibleBook[] => {
  const cleanQuery = query.toLowerCase().trim();
  if (cleanQuery.length < 2) return [];

  return BIBLE_BOOKS.filter(b => 
    b.name.toLowerCase().includes(cleanQuery) || 
    b.abbrev.some(a => a.startsWith(cleanQuery))
  ).slice(0, 5); // Retorna top 5 sugestões
};
