export const BIBLE_QUOTES = [
    { text: "Ta parole est une lampe pour mon pied, et une lumière pour mon sentier.", ref: "Psaume 119:105" },
    { text: "L’herbe se dessèche, la fleur se fane, mais la parole de notre Dieu demeure pour toujours.", ref: "Isaïe 40:8" },
    { text: "Heureux l’homme qui... prend plaisir dans la loi de Jéhovah, et sa loi, il la lit à voix basse jour et nuit.", ref: "Psaume 1:1,2" },
    { text: "Car la parole de Dieu est vivante et puissante.", ref: "Hébreux 4:12" }
];

export const BIBLE_BOOKS_MAP = {
    'GENÈSE': 1, 'EXODE': 2, 'LÉVITIQUE': 3, 'NOMBRES': 4, 'DEUTÉRONOME': 5,
    'JOSUÉ': 6, 'JUGES': 7, 'RUTH': 8, '1 SAMUEL': 9, '2 SAMUEL': 10,
    '1 ROIS': 11, '2 ROIS': 12, '1 CHRONIQUES': 13, '2 CHRONIQUES': 14,
    'ESDRAS': 15, 'NÉHÉMIE': 16, 'ESTHER': 17, 'JOB': 18, 'PSAUMES': 19,
    'PROVERBES': 20, 'ECCLÉSIASTE': 21, 'CHANT DE SALOMON': 22, 'ISAÏE': 23,
    'JÉRÉMIE': 24, 'LAMENTATIONS': 25, 'ÉZÉCHIEL': 26, 'DANIEL': 27, 'OSÉE': 28,
    'JOËL': 29, 'AMOS': 30, 'ABDIAS': 31, 'JONAS': 32, 'MICHÉE': 33,
    'NAHUM': 34, 'HABACUC': 35, 'SOPHONIE': 36, 'AGGÉE': 37, 'ZACHARIE': 38,
    'MALACHIE': 39, 'MATTHIEU': 40, 'MARC': 41, 'LUC': 42, 'JEAN': 43,
    'ACTES': 44, 'ROMAINS': 45, '1 CORINTHIENS': 46, '2 CORINTHIENS': 47, 'GALATES': 48,
    'ÉPHÉSIENS': 49, 'PHILIPPIENS': 50, 'COLOSSIENS': 51, '1 THESSALONICIENS': 52, '2 THESSALONICIENS': 53,
    '1 TIMOTHÉE': 54, '2 TIMOTHÉE': 55, 'TITE': 56, 'PHILÉMON': 57, 'HÉBREUX': 58,
    'JACQUES': 59, '1 PIERRE': 60, '2 PIERRE': 61, '1 JEAN': 62, '2 JEAN': 63,
    '3 JEAN': 64, 'JUDE': 65, 'RÉVÉLATION': 66
};

export const BOOK_ABBREVIATIONS = {
    'GENÈSE': 'Gn', 'EXODE': 'Ex', 'LÉVITIQUE': 'Lv', 'NOMBRES': 'Nb', 'DEUTÉRONOME': 'Dt',
    'JOSUÉ': 'Jos', 'JUGES': 'Jg', 'RUTH': 'Ru', '1 SAMUEL': '1S', '2 SAMUEL': '2S',
    '1 ROIS': '1R', '2 ROIS': '2R', '1 CHRONIQUES': '1Ch', '2 CHRONIQUES': '2Ch',
    'ESDRAS': 'Esd', 'NÉHÉMIE': 'Né', 'ESTHER': 'Est', 'JOB': 'Jb', 'PSAUMES': 'Ps',
    'PROVERBES': 'Pr', 'ECCLÉSIASTE': 'Ec', 'CHANT DE SALOMON': 'Ct', 'ISAÏE': 'Is',
    'JÉRÉMIE': 'Jr', 'LAMENTATIONS': 'Lm', 'ÉZÉCHIEL': 'Éz', 'DANIEL': 'Dn', 'OSÉE': 'Os',
    'JOËL': 'Jl', 'AMOS': 'Am', 'ABDIAS': 'Ab', 'JONAS': 'Jon', 'MICHÉE': 'Mi',
    'NAHUM': 'Na', 'HABACUC': 'Hab', 'SOPHONIE': 'Sph', 'AGGÉE': 'Ag', 'ZACHARIE': 'Za',
    'MALACHIE': 'Ml', 'MATTHIEU': 'Mt', 'MARC': 'Mc', 'LUC': 'Lc', 'JEAN': 'Jean',
    'ACTES': 'Ac', 'ROMAINS': 'Rm', '1 CORINTHIENS': '1Co', '2 CORINTHIENS': '2Co', 'GALATES': 'Ga',
    'ÉPHÉSIENS': 'Éph', 'PHILIPPIENS': 'Php', 'COLOSSIENS': 'Col', '1 THESSALONICIENS': '1Th', '2 THESSALONICIENS': '2Th',
    '1 TIMOTHÉE': '1Tm', '2 TIMOTHÉE': '2Tm', 'TITE': 'Tt', 'PHILÉMON': 'Phm', 'HÉBREUX': 'Hé',
    'JACQUES': 'Jc', '1 PIERRE': '1P', '2 PIERRE': '2P', '1 JEAN': '1Jn', '2 JEAN': '2Jn',
    '3 JEAN': '3Jn', 'JUDE': 'Jude', 'RÉVÉLATION': 'Rév'
};

export const readingPlan = {
    'ÉCRITS DE MOÏSE': [
        { book: 'GENÈSE', sections: [{ ch: '1-3' }, { ch: '4-7' }, { ch: '8-11' }, { ch: '12-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-22', m: 'o' }, { ch: '23-24', m: 'o' }, { ch: '25-27', m: 'o' }, { ch: '28-30', m: 'o' }, { ch: '31-32', m: 'o' }, { ch: '33-34', m: 'o' }, { ch: '35-37', m: 'o' }, { ch: '38-40', m: 'o' }, { ch: '41-42', m: 'o' }, { ch: '43-45', m: 'o' }, { ch: '46-48', m: 'o' }, { ch: '49-50', m: 'o' }] },
        { book: 'EXODE', sections: [{ ch: '1-4', m: 'o' }, { ch: '5-7', m: 'o' }, { ch: '8-10', m: 'o' }, { ch: '11-13', m: 'o' }, { ch: '14-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-25' }, { ch: '26-28' }, { ch: '29-30' }, { ch: '31-33', m: 'o' }, { ch: '34-35', m: 'o' }, { ch: '36-38' }, { ch: '39-40' }] },
        { book: 'LÉVITIQUE', sections: [{ ch: '1-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-15' }, { ch: '16-18' }, { ch: '19-21' }, { ch: '22-23' }, { ch: '24-25' }, { ch: '26-27' }] },
        { book: 'NOMBRES', sections: [{ ch: '1-3' }, { ch: '4-6' }, { ch: '7-9' }, { ch: '10-12', m: 'o' }, { ch: '13-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-24', m: 'o' }, { ch: '25-27', m: 'o' }, { ch: '28-30' }, { ch: '31-32', m: 'o' }, { ch: '33-36', m: 'o' }] },
        { book: 'DEUTÉRONOME', sections: [{ ch: '1-2' }, { ch: '3-4', m: 'o' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-16' }, { ch: '17-19', m: 'o' }, { ch: '20-22' }, { ch: '23-26' }, { ch: '27-28' }, { ch: '29-31', m: 'o' }, { ch: '32', m: 'o' }, { ch: '33-34', m: 'o' }] }
    ],
    "ENTRÉE D'ISRAËL EN TERRE PROMISE": [
        { book: 'JOSUÉ', sections: [{ ch: '1-4', m: 'o' }, { ch: '5-7', m: 'o' }, { ch: '8-9', m: 'o' }, { ch: '10-12', m: 'o' }, { ch: '13-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-24', m: 'o' }] },
        { book: 'JUGES', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-5', m: 'o' }, { ch: '6-7', m: 'o' }, { ch: '8-9', m: 'o' }, { ch: '10-11', m: 'o' }, { ch: '12-13', m: 'o' }, { ch: '14-16', m: 'o' }, { ch: '17-19', m: 'o' }, { ch: '20-21', m: 'o' }] },
        { book: 'RUTH', sections: [{ ch: '1-4', m: 'o' }] }
    ],
    "PÉRIODE DES ROIS D'ISRAËL": [
        { book: '1 SAMUEL', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-6', m: 'o' }, { ch: '7-9', m: 'o' }, { ch: '10-12', m: 'o' }, { ch: '13-14', m: 'o' }, { ch: '15-16', m: 'o' }, { ch: '17-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-24', m: 'o' }, { ch: '25-27', m: 'o' }, { ch: '28-31', m: 'o' }] },
        { book: '2 SAMUEL', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-5', m: 'o' }, { ch: '6-8', m: 'o' }, { ch: '9-12', m: 'o' }, { ch: '13-14', m: 'o' }, { ch: '15-16', m: 'o' }, { ch: '17-18', m: 'o' }, { ch: '19-20', m: 'o' }, { ch: '21-22', m: 'o' }, { ch: '23-24', m: 'o' }] },
        { book: '1 ROIS', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-5', m: 'o' }, { ch: '6-7', m: 'o' }, { ch: '8', m: 'o' }, { ch: '9-10', m: 'o' }, { ch: '11-12', m: 'o' }, { ch: '13-14', m: 'o' }, { ch: '15-17', m: 'o' }, { ch: '18-19', m: 'o' }, { ch: '20-21', m: 'o' }, { ch: '22', m: 'o' }] },
        { book: '2 ROIS', sections: [{ ch: '1-3', m: 'o' }, { ch: '4-5', m: 'o' }, { ch: '6-8', m: 'o' }, { ch: '9-10', m: 'o' }, { ch: '11-13', m: 'o' }, { ch: '14-15', m: 'o' }, { ch: '16-17', m: 'o' }, { ch: '18-19', m: 'o' }, { ch: '20-22', m: 'o' }, { ch: '23-25', m: 'o' }] },
        { book: '1 CHRONIQUES', sections: [{ ch: '1-2' }, { ch: '3-5' }, { ch: '6-7' }, { ch: '8-10' }, { ch: '11-12' }, { ch: '13-15' }, { ch: '16-17' }, { ch: '18-20' }, { ch: '21-23' }, { ch: '24-26' }, { ch: '27-29' }] },
        { book: '2 CHRONIQUES', sections: [{ ch: '1-3' }, { ch: '4-6' }, { ch: '7-9' }, { ch: '10-14' }, { ch: '15-18' }, { ch: '19-22' }, { ch: '23-25' }, { ch: '26-28' }, { ch: '29-30' }, { ch: '31-33' }, { ch: '34-36' }] }
    ],
    "RETOUR D'EXIL DES JUIFS": [
        { book: 'ESDRAS', sections: [{ ch: '1-3', m: 'o' }, { ch: '4-7', m: 'o' }, { ch: '8-10', m: 'o' }] },
        { book: 'NÉHÉMIE', sections: [{ ch: '1-3', m: 'o' }, { ch: '4-6', m: 'o' }, { ch: '7-8', m: 'o' }, { ch: '9-10', m: 'o' }, { ch: '11-13', m: 'o' }] },
        { book: 'ESTHER', sections: [{ ch: '1-4', m: 'o' }, { ch: '5-10', m: 'o' }] }
    ],
    "CHANTS ET PAROLES DE SAGESSE": [
        { book: 'JOB', sections: [{ ch: '1-5' }, { ch: '6-9' }, { ch: '10-14' }, { ch: '15-18' }, { ch: '19-20' }, { ch: '21-24' }, { ch: '25-29' }, { ch: '30-31' }, { ch: '32-34' }, { ch: '35-38' }, { ch: '39-42' }] },
        { book: 'PSAUMES', sections: [{ ch: '1-8' }, { ch: '9-16' }, { ch: '17-19' }, { ch: '20-25' }, { ch: '26-31' }, { ch: '32-35' }, { ch: '36-38' }, { ch: '39-42' }, { ch: '43-47' }, { ch: '48-52' }, { ch: '53-58' }, { ch: '59-64' }, { ch: '65-68' }, { ch: '69-72' }, { ch: '73-77' }, { ch: '78-79' }, { ch: '80-86' }, { ch: '87-90' }, { ch: '91-96' }, { ch: '97-103' }, { ch: '104-105' }, { ch: '106-108' }, { ch: '109-115' }, { ch: '116-119:63' }, { ch: '119:64-176' }, { ch: '120-129' }, { ch: '130-138' }, { ch: '139-144' }, { ch: '145-150' }] },
        { book: 'PROVERBES', sections: [{ ch: '1-4' }, { ch: '5-8' }, { ch: '9-12' }, { ch: '13-16' }, { ch: '17-19' }, { ch: '20-22' }, { ch: '23-27' }, { ch: '28-31' }] },
        { book: 'ECCLÉSIASTE', sections: [{ ch: '1-4' }, { ch: '5-8' }, { ch: '9-12' }] },
        { book: 'CHANT DE SALOMON', sections: [{ ch: '1-8' }] }
    ],
    'PROPHÈTES': [
        { book: 'ISAÏE', sections: [{ ch: '1-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-14' }, { ch: '15-19' }, { ch: '20-24' }, { ch: '25-28' }, { ch: '29-31' }, { ch: '32-35' }, { ch: '36-37' }, { ch: '38-40' }, { ch: '41-43' }, { ch: '44-47' }, { ch: '48-50' }, { ch: '51-55' }, { ch: '56-58' }, { ch: '59-62' }, { ch: '63-66' }] },
        { book: 'JÉRÉMIE', sections: [{ ch: '1-3' }, { ch: '4-5' }, { ch: '6-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-16' }, { ch: '17-20' }, { ch: '21-23' }, { ch: '24-26' }, { ch: '27-29' }, { ch: '30-31' }, { ch: '32-33' }, { ch: '34-36' }, { ch: '37-39' }, { ch: '40-42' }, { ch: '43-44' }, { ch: '45-48' }, { ch: '49-50' }, { ch: '51-52' }] },
        { book: 'LAMENTATIONS', sections: [{ ch: '1-2' }, { ch: '3-5' }] },
        { book: 'ÉZÉCHIEL', sections: [{ ch: '1-3' }, { ch: '4-6' }, { ch: '7-9' }, { ch: '10-12' }, { ch: '13-15' }, { ch: '16' }, { ch: '17-18' }, { ch: '19-21' }, { ch: '22-23' }, { ch: '24-26' }, { ch: '27-28' }, { ch: '29-31' }, { ch: '32-33' }, { ch: '34-36' }, { ch: '37-38' }, { ch: '39-40' }, { ch: '41-43' }, { ch: '44-45' }, { ch: '46-48' }] },
        { book: 'DANIEL', sections: [{ ch: '1-2' }, { ch: '3-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-12' }] },
        { book: 'OSÉE', sections: [{ ch: '1-7' }, { ch: '8-14' }] },
        { book: 'JOËL', sections: [{ ch: '1-3' }] },
        { book: 'AMOS', sections: [{ ch: '1-5' }, { ch: '6-9' }] },
        { book: 'ABDIAS/JONAS', sections: [{ ch: '1' }] },
        { book: 'MICHÉE', sections: [{ ch: '1-7' }] },
        { book: 'NAHUM/HABACUC', sections: [{ ch: '1-3' }] },
        { book: 'SOPHONIE/AGGÉE', sections: [{ ch: '1-3' }] },
        { book: 'ZACHARIE', sections: [{ ch: '1-7' }, { ch: '8-11' }, { ch: '12-14' }] },
        { book: 'MALACHIE', sections: [{ ch: '1-4' }] }
    ],
    'VIE ET MINISTÈRE DE JÉSUS': [
        { book: 'MATTHIEU', sections: [{ ch: '1-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-17' }, { ch: '18-20' }, { ch: '21-23' }, { ch: '24-25' }, { ch: '26' }, { ch: '27-28' }] },
        { book: 'MARC', sections: [{ ch: '1-3', m: 'b' }, { ch: '4-5', m: 'b' }, { ch: '6-8', m: 'b' }, { ch: '9-10', m: 'b' }, { ch: '11-13', m: 'b' }, { ch: '14-16', m: 'b' }] },
        { book: 'LUC', sections: [{ ch: '1-2' }, { ch: '3-5' }, { ch: '6-7' }, { ch: '8-9' }, { ch: '10-11' }, { ch: '12-13' }, { ch: '14-17' }, { ch: '18-19' }, { ch: '20-22' }, { ch: '23-24' }] },
        { book: 'JEAN', sections: [{ ch: '1-3' }, { ch: '4-5' }, { ch: '6-7' }, { ch: '8-9' }, { ch: '10-12' }, { ch: '13-15' }, { ch: '16-18' }, { ch: '19-21' }] }
    ],
    "DÉVELOPPEMENT DE L'ASSEMBLÉE CHRÉTIENNE": [
        { book: 'ACTES', sections: [{ ch: '1-3', m: 'b' }, { ch: '4-6', m: 'b' }, { ch: '7-8', m: 'b' }, { ch: '9-11', m: 'b' }, { ch: '12-14', m: 'b' }, { ch: '15-16', m: 'b' }, { ch: '17-19', m: 'b' }, { ch: '20-21', m: 'b' }, { ch: '22-23', m: 'b' }, { ch: '24-26', m: 'b' }, { ch: '27-28', m: 'b' }] }
    ],
    "LETTRES DE PAUL": [
        { book: 'ROMAINS', sections: [{ ch: '1-3' }, { ch: '4-7' }, { ch: '8-11' }, { ch: '12-16' }] },
        { book: '1 CORINTHIENS', sections: [{ ch: '1-6' }, { ch: '7-10' }, { ch: '11-14' }, { ch: '15-16' }] },
        { book: '2 CORINTHIENS', sections: [{ ch: '1-6' }, { ch: '7-10' }, { ch: '11-13' }] },
        { book: 'GALATES', sections: [{ ch: '1-6' }] },
        { book: 'ÉPHÉSIENS', sections: [{ ch: '1-6' }] },
        { book: 'PHILIPPIENS', sections: [{ ch: '1-4' }] },
        { book: 'COLOSSIENS', sections: [{ ch: '1-4' }] },
        { book: '1 THESSALONICIENS', sections: [{ ch: '1-5' }] },
        { book: '2 THESSALONICIENS', sections: [{ ch: '1-3' }] },
        { book: '1 TIMOTHÉE', sections: [{ ch: '1-6' }] },
        { book: '2 TIMOTHÉE', sections: [{ ch: '1-4' }] },
        { book: 'TITE/PHILÉMON', sections: [{ ch: '1-3' }] }
    ],
    "ÉCRITS DES AUTRES APÔTRES ET DISCIPLES": [
        { book: 'HÉBREUX', sections: [{ ch: '1-6' }, { ch: '7-10' }, { ch: '11-13' }] },
        { book: 'JACQUES', sections: [{ ch: '1-5' }] },
        { book: '1 PIERRE', sections: [{ ch: '1-5' }] },
        { book: '2 PIERRE', sections: [{ ch: '1-3' }] },
        { book: '1 JEAN', sections: [{ ch: '1-5' }] },
        { book: '2 JEAN/3 JEAN/JUDE', sections: [{ ch: '1' }] },
        { book: 'RÉVÉLATION', sections: [{ ch: '1-4' }, { ch: '5-9' }, { ch: '10-14' }, { ch: '15-18' }, { ch: '19-22' }] }
    ]
};

export const totalSections = 368;
