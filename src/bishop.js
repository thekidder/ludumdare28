var bishopNames = [
  'Adolph Marx',
  'Albert Daeger',
  'Albert Gregory Meyer',
  'Albert Lewis Fletcher',
  'Albert Rudolph Zuroweste',
  'Alden John Bell',
  'Alexander Christie',
  'Alexander Joseph McGavick',
  'Alexander M. Zaleski',
  'Alfred Allen Paul Curtis',
  'Alfred Michael Watson',
  'Allen James Babcock',
  'Aloisius Joseph Muench',
  'Aloysius John Wycislo',
  'Aloysius Joseph Willinger',
  'Alphonse James Schladweiler',
  'Alphonse John Smith',
  'Alphonse Joseph Glorieux',
  'Ambrose Maréchal',
  'Ambrose Senyshyn',
  'Andrew Byrne',
  'Andrew Gregory Grutka',
  'Andrew James Louis Brennan',
  'Anthony Dominic Pellicer',
  'Anthony Durier',
  'Anthony John King Mussio',
  'Anthony Joseph Schuler',
  'Anthony O\'Regan',
  'Antoine Blanc',
  'Arthur Jerome Drossaerts',
  'Augustin Verot',
  'Augustin-Magloire Blanchet',
  'Augustine Danglmayr',
  'Augustine Francis Schinner',
  'Augustine van de Vyver',
  'Augustus John Schwertner',
  'Augustus Marie Martin',
  'Augustus Toebbe',
  'Austin Dowling',
  'Bartholomew J. Eustace',
  'Basil Takach',
  'Benedict Joseph Fenwick',
  'Benedict Joseph Flaget',
  'Benjamin Joseph Keiley',
  'Bernard James Sheil',
  'Bernard John McQuaid',
  'Bernard Joseph Flanagan',
  'Bernard Joseph Mahoney',
  'Bernard Joseph Topel',
  'Bernard Matthew Kelly',
  'Bernard O\'Reilly',
  'Bernard T. Espelage',
  'Bonaventure Broderick',
  'Bryan Joseph McEntegart',
  'Camillus Paul Maes',
  'Caspar Henry Borgess',
  'Celestine Damiano',
  'Célestine de la Hailandière',
  'Charles Albert Buswell',
  'Charles Borromeo McLaughlin',
  'Charles Daniel White',
  'Charles Edward McDonnell',
  'Charles F. Buddy',
  'Charles Garrett Maloney',
  'Charles H. Colton',
  'Charles Herman Helmsing',
  'Charles Hubert Le Blond',
  'Charles John Seghers',
  'Charles Joseph O\'Reilly',
  'Charles Pasquale Greco',
  'Charles Richard Mulrooney',
  'Charles Salatka',
  'Christian Herman Winkelmann',
  'Christopher Edward Byrne',
  'Christopher Joseph Weldon',
  'Clarence Edward Elwell',
  'Clarence George Issenmann',
  'Claude Marie Dubuis',
  'Clement Smyth',
  'Cletus F. O\'Donnell',
  'Cletus Joseph Benjamin',
  'Coleman Carroll',
  'Constantine Bohachevsky',
  'Cornelius Van de Ven',
  'Cyril John Vogel',
  'Daniel E. Sheehan',
  'Daniel Francis Desmond',
  'Daniel Francis Feehan',
  'Daniel Ivancho',
  'Daniel James Gercke',
  'Daniel Joseph Curley',
  'Daniel Joseph Feeney',
  'Daniel Mary Gorman',
  'David Frederick Cunningham',
  'David Monas Maloney',
  'David William Bacon',
  'Denis J. O\'Connell',
  'Denis Mary Bradley',
  'Denis Matthew Lowney',
  'Denis O\'Donaghue',
  'Dennis Joseph Dougherty',
  'Dominic Manucy',
  'Duane Garrison Hunt',
  'Edgar P. P. Wadhams',
  'Edmond Francis Prendergast',
  'Edmond Heelan',
  'Edmond John Fitzmaurice',
  'Edmund Gibbons',
  'Edmund Joseph Reilly',
  'Edmund Michael Dunne',
  'Edward A. McCarthy',
  'Edward Aloysius Fitzgerald',
  'Edward Celestin Daly',
  'Edward D. Kelly',
  'Edward Ernest Swanstrom',
  'Edward Fenwick',
  'Edward Fitzgerald',
  'Edward Francis Hoban',
  'Edward Francis Ryan',
  'Edward Gerard Hettinger',
  'Edward Howard',
  'Edward John Harper',
  'Edward John Herrmann',
  'Edward John O\'Dea',
  'Edward Joseph Dunne',
  'Edward Joseph Hanna',
  'Edward Joseph Hunkeler',
  'Edward Joseph Maginn',
  'Edward Kelly',
  'Edward Kozłowski',
  'Edward Mooney',
  'Edward Patrick Allen',
  'Edward Peter McManaman',
  'Edward Vincent Dargin',
  'Edwin Broderick',
  'Edwin Byrne',
  'Edwin Vincent O\'Hara',
  'Egidius Junger',
  'Eldon Bernard Schuster',
  'Emmanuel Boleslaus Ledvina',
  'Emmet M. Walsh',
  'Eric Francis MacKenzie',
  'Ernest John Primeau',
  'Ernest Leo Unterkoefler',
  'Eugene Augustine Garvey',
  'Eugene J. McGuinness',
  'Eugene O\'Connell',
  'Ferdinand Brossart',
  'Floyd Lawrence Begin',
  'Francis Augustine Thill',
  'Francis Beckman',
  'Francis Doyle Gleeson',
  'Francis Edward Hyland',
  'Francis Frederick Reh',
  'Francis Gilfillan',
  'Francis J. Haas',
  'Francis James Furey',
  'Francis Janssens',
  'Francis Johannes',
  'Francis Joseph Green',
  'Francis Joseph Magner',
  'Francis Joseph Monaghan',
  'Francis Joseph Schenk',
  'Francis Joseph Tief',
  'Francis Kelley',
  'Francis Kenrick',
  'Francis Mansour Zayek',
  'Francis Martin Kelly',
  'Francis McNeirny',
  'Francis Patrick Keough',
  'Francis Patrick McFarland',
  'Francis Peter Leipzig',
  'Francis Ridgley Cotton',
  'Francis Spellman',
  'Francis William Howard',
  'Francis Xavier Gartland',
  'Francis Xavier Krautbauer',
  'Francis Xavier Leray',
  'Francisco Diego y Moreno',
  'Francisco Mora y Borrell',
  'Francisco Porró y Reinado',
  'François Norbert Blanchet',
  'Frank Henry Greteman',
  'Frederic Baraga',
  'Frederick Eis',
  'Frederick Katzer',
  'Frederick Rese',
  'Frederick William Freking'
];

bishopNames = _.shuffle(bishopNames);

var bishopCurrentName = 0; 

function getBishopName() {
  var name = bishopNames[bishopCurrentName];
  bishopCurrentName++;
  return name;
}

function Bishop(name, img, charisma, fervor, loyalty, pennypinching) {
  this.index = bishopCurrentName;
  this.name = name;
  this.img = img;
  this.charisma = charisma;
  this.fervor = fervor;
  this.loyalty = loyalty;
  this.pennypinching = pennypinching;
}