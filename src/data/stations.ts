export interface Station {
  id: string;
  name: string;
  city: string;
  streamUrl: string;
  logoUrl: string;
  metadataUrl?: string;
}

export const stations: Station[] = [
  {
    id: 'ecclesia',
    name: 'Εκκλησία της Ελλάδος',
    city: 'Αθήνα',
    streamUrl: 'https://loki.mental-media.gr:8038/',
    logoUrl: './eccl895.jpg'
  },
  {
    id: 'peiraiki',
    name: 'Πειραϊκή Εκκλησία',
    city: 'Πειραιάς',
    streamUrl: 'https://impradio2.bytemasters.gr/8002/stream',
    logoUrl: './pir912.jpg'
  },
  {
    id: 'lydia',
    name: 'Λυδία η Φιλιππησία',
    city: 'Θεσσαλονίκη',
    streamUrl: 'https://tls-chrome.live24.gr/271',
    logoUrl: './lydia.png'
  },
  {
    id: 'kivotos',
    name: 'Ράδιο Κιβωτός',
    city: 'Σέρρες',
    streamUrl: 'https://sh.onweb.gr/8452/;',
    logoUrl: './kivotos.jpeg'
  },
  {
    id: 'martyria',
    name: 'Ράδιο Μαρτυρία',
    city: 'Χανιά',
    streamUrl: 'https://sc2.streamwithq.com:2000/stream/martiria',
    logoUrl: './radmartyria.png'
  },
  {
    id: 'kastorias',
    name: 'I.M. Καστοριάς',
    city: 'Καστοριά',
    streamUrl: 'https://eco.onestreaming.com/proxy/imk/stream',
    logoUrl: './kastor979.jpg'
  },
  {
    id: 'filopoli',
    name: 'Radio Filopoli',
    city: 'Web Radio',
    streamUrl: 'https://cast4.magicstreams.gr:2200/ssl/nantia?mp=/stream&1586890375551',
    logoUrl: './filopoli.jpg'
  },
  {
    id: 'vamvas',
    name: 'Vamvas 24',
    city: 'Web Radio',
    streamUrl: 'https://stream.radiojar.com/1p608uhyf0nwv',
    logoUrl: './vamvas.png'
  },
  {
    id: 'agSpyridon',
    name: 'Άγιος Σπυρίδων',
    city: 'Κέρκυρα',
    streamUrl: 'https://sh.onweb.gr:8462/stream',
    logoUrl: './agspyridon.jpg'
  },
  {
    id: 'alitheia963',
    name: 'Αλήθεια FM',
    city: 'Κάλυμνος',
    streamUrl: 'http://sc2.streamwithq.com:8070/;stream/1',
    logoUrl: './alitheia963.jpg'
  },
  {
    id: 'galilea',
    name: 'Γαλιλαία',
    city: 'Web Radio - Λάρισα',
    streamUrl: 'https://sh.onweb.gr:7019/stream',
    logoUrl: './galilea.jpg'
  },
  {
    id: 'diakonia938',
    name: 'Διακονία 93.8',
    city: 'Ξάνθη',
    streamUrl: 'https://radio.streamings.gr/proxy/imxanthis?mp=/stream',
    logoUrl: './diakonia938.png'
  },
  {
    id: 'imlarisis',
    name: 'Ι.Μ. Λαρίσης & Τυρνάβου',
    city: 'Λάρισα',
    streamUrl: 'https://tls-chrome.live24.gr/161?http://in.icss.com.gr:8000/stream_007',
    logoUrl: './imlarisis.png'
  },
  {
    id: 'impatron',
    name: 'Ι.Μ. Πατρών',
    city: 'Πάτρα',
    streamUrl: 'https://eco.onestreaming.com/proxy/impatron/stream',
    logoUrl: './impatron.png'
  },
  {
    id: 'iakritis',
    name: 'Ι.Αερχισκοπή Κρήτης',
    city: 'Ηράκλειο',
    streamUrl: 'https://i7.streams.ovh/ic/iakradi1/stream',
    logoUrl: './iakritis.png'
  },
  {
    id: 'imaitolias',
    name: 'Ι.Μ. Αιτωλίας & Ακαρνανίας',
    city: 'Μεσολόγγι',
    streamUrl: 'https://sh.onweb.gr/8038/;',
    logoUrl: './imaitolias.jpg'
  },
  /*   {
      id: 'imparonaxias',
      name: 'Ι.Μ. Παροναξίας',
      city: 'Νάξος',
      streamUrl: 'http://live.onweb.gr:8212',
      logoUrl: './imparonaxias.png'
    }, */
  {
    id: 'iakyprou',
    name: 'Ο Αληθινός Λόγος',
    city: 'Στρόβολος',
    streamUrl: 'https://r1.cloudskep.com/radio/agiosdemetrios/icecast.audio',
    logoUrl: './iakyprou.png'
  },
  {
    id: 'imspartis',
    name: 'Ι.Μ. Σπάρτης',
    city: 'Σπάρτη',
    streamUrl: 'https://sh.onweb.gr/8862/;',
    logoUrl: './imspartis.png'
  },
  {
    id: 'imfthiotidos',
    name: 'Ι.Μ. Φθιώτιδος',
    city: 'Λαμία',
    streamUrl: 'https://tls-chrome.live24.gr/661',
    logoUrl: './imfthiotidos.png'
  },
  {
    id: 'imartis',
    name: 'Ι.Μ. Άρτης',
    city: 'Άρτα',
    streamUrl: 'https://i.streams.ovh/sc/imartis/stream',
    logoUrl: './imartis.png'
  },
  {
    id: 'imtrikkis',
    name: 'Άγιος Οικουμένιος 102',
    city: 'Τρίκαλα',
    streamUrl: 'https://tls-chrome.live24.gr/2509',
    logoUrl: './imtrikkis.jpg'
  },
  {
    id: 'monaxikidiakonia',
    name: 'Μοναχική Διακονία',
    city: 'Αγριά Βόλου',
    streamUrl: 'http://eco.onestreaming.com:8019/stream',
    logoUrl: './monaxikidiakonia.jpg'
  },
  {
    id: 'korinthiako',
    name: 'Κορινθιακό Ορθόδοξο Ραδιόφωνο',
    city: 'Κόρινθος',
    streamUrl: 'https://azuracast.streams.ovh/listen/corinthianorthodoxradio/stream?',
    logoUrl: './korinthiako.jpg'
  },
  {
    id: 'monpoliteia',
    name: 'Μοναδική Πολιτεία 96',
    city: 'Ναύπακτος',
    streamUrl: 'https://netradio.live24.gr/monadikipolitia96',
    logoUrl: './monpoliteia.jpg'
  },
  {
    id: 'orthmartiria',
    name: 'Ορθόδοξη Μαρτυρία',
    city: 'Βόλος',
    streamUrl: 'https://tls-chrome.live24.gr/216',
    logoUrl: './orthmartiria.png'
  },
  {
    id: 'orthparousia',
    name: 'Ορθόδοξη Παρουσία',
    city: 'Λαγκαδάς',
    streamUrl: 'https://panel.gwebstream.com/stream/imlagada/stream',
    logoUrl: './orthparousia.jpg'
  },
  {
    id: 'orthoparadosi',
    name: 'Ορθοδοξία και Παράδοση',
    city: 'Σιάτιστα',
    streamUrl: 'http://radio.lts-group.eu:52390/ANS',
    logoUrl: './orthoparadosi.jpg'
  },
  {
    id: 'orthofos',
    name: 'Ορθόδοξο Φως',
    city: 'Μεγαλόπολη',
    streamUrl: 'https://solid41.streamupsolutions.com/proxy/jkkumoxy/stream',
    logoUrl: './orthofos.png'
  },
  {
    id: 'pavlioslogos',
    name: 'Παύλειος Λόγος',
    city: 'Βέρεια',
    streamUrl: 'https://eco.onestreaming.com/proxy/pavleioslogos/stream',
    logoUrl: './pavlioslogos.png'
  },
  {
    id: 'pemptousia',
    name: 'Πεμπτουσία FM',
    city: 'Web Radio',
    streamUrl: 'https://stream.radiojar.com/48cz219puzzuv',
    logoUrl: './pemptousia.png'
  },
  {
    id: 'imsyrou',
    name: 'Ι.Μ. Σύρου',
    city: 'Ερμούπολη',
    streamUrl: 'https://tls-chrome.live24.gr/459?http://s2.onweb.gr:8852/',
    logoUrl: './imsyrou.png'
  },
  {
    id: 'lemesos',
    name: 'Ι.Μ. Λεμεσού',
    city: 'Λεμεσός',
    streamUrl: 'http://93.109.209.123:9080/stream.mp3',
    logoUrl: './lemesos.png'
  },
  {
    id: 'agdimitrios',
    name: 'Άγιος Δημήτριος Ακροπόλεως',
    city: 'Λευκωσία',
    streamUrl: 'http://eco.onestreaming.com:8474/stream',
    logoUrl: './agdimitrios.png'
  },
  {
    id: 'ekvatheon',
    name: 'Εκ Βαθέων',
    city: 'Γιαννιτσά',
    streamUrl: 'https://ekvatheon.gr/radio/stream',
    logoUrl: './ekvatheon.jpeg'
  },
  {
    id: 'elpida',
    name: 'Ράδιο Ελπίδα',
    city: 'Αλεξανδρούπολη',
    streamUrl: 'https://eco.onestreaming.com/proxy/elpida1023/stream',
    logoUrl: './elpida.jpg'
  },
  {
    id: 'pantokrator',
    name: 'Παντοκράτωρ',
    city: 'Web Radio',
    streamUrl: 'https://a11.asurahosting.com:7720/radio.mp3',
    logoUrl: './pantokrator.jpg'
  },
  {
    id: 'imargolidos',
    name: 'Ι.Μ. Αργολίδος',
    city: 'Ναύπλιο',
    streamUrl: 'https://eco.onestreaming.com/proxy/imargol1052/stream',
    logoUrl: './imargolidos.png'
  },
  {
    id: 'simantro',
    name: 'Σήμαντρο',
    city: 'Χίος',
    streamUrl: 'http://65.108.133.10:8050/stream',
    logoUrl: './simantro.jpg'
  },
  {
    id: 'spinos',
    name: 'Σπίνος FM',
    city: 'Ιωάννινα',
    streamUrl: 'https://cast.streams.ovh:12079/live?1521032644463',
    logoUrl: './spinos.jpg'
  },
  {
    id: 'terirem',
    name: 'Τεριρέμ Radio',
    city: 'Δράμα',
    streamUrl: 'https://c34.radioboss.fm:18213/stream',
    logoUrl: './terirem.png'
  },
  {
    id: 'stegi',
    name: 'Χριστιανική Στέγη',
    city: 'Καλαμάτα',
    streamUrl: 'https://premium.streams.gr:8029/stream',
    logoUrl: './stegi.png'
  },
];
