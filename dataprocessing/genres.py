import pandas as pd
import numpy as np


def get_genres():
    tracks = pd.read_json('./data/dataset1.json')
    #get the genres column
    genres = tracks['tag']
    #get the unique genres
    unique_genres = np.unique(genres)
    return unique_genres


def get_artists_musics(artists: list) -> dict:
    tracks = pd.read_json('./data/dataset1.json')
    #create a table with only the tracks of the given artists
    tracks = tracks[tracks['artist'].isin(artists)]
    #create a csv file with the table and the same coloums as the original table
    tracks.to_csv('./data/artists_tracks.csv', index=False)
    #return the shape of the table
    return tracks.shape

__name__ = "__main__"
#print(get_genres())
print(get_artists_musics(['Sylvy', 'Laycon', 'Girls Under Glass', "Je'Melody", 'Swallowed', 'SporatiK',
 'Josh Atticus', 'AE MAK', 'Loorr k', 'Jussin', 'Marshmello & Juicy J',
 'Cade Hoppe', 'Luke Genarro', 'Twisted Tower Dire', 'To Be Gentle',
 'Poetic Killa', 'Courtney Bell', 'TiaN', 'SA Zeiner', 'Emmett D. Carson',
 'Trek', 'Dylan House', 'Julie Reeves', 'Okezzy', 'Lindsay Bruce',
 'Blue moon ring', 'Laura Mvula', 'Damageplan', 'Autmn Rains', 'Xzay, Zalen',
 'ERYS (Jaden Smith)', 'OHMYGAB', 'Padre Official', 'Jonny Wild',
 'UNAVERAGE GANG & Black Smurf', 'Cask Mouse', 'OELuhHot', 'Lcia Moniz',
 '29PG', 'Cheyenne Goss', 'Lil Jaywalk', 'Dasha Grady', 'Rachel Rabin',
 'Nathaniel Ly, Aaron Fung', 'Jochi', 'Blaine Nasser', 'Winston Ward',
 'Julie Rogers', 'Ray Daytona and Googoobombos', 'Shark Breach & GHOSTIE',
 'MazGazi', 'Luqman Swati', 'Juicy checks', 'Next Step Down', 'Ruga',
 'King Ant', 'Alice Walker', 'Wfgwertg', 'WhipGF', 'MARS (Band)', 'J.R. Sharp',
 'Shelley Fabares', 'The Funny Gang', 'Jediah', 'Chainsaw Disaster',
 'SoSadSahvage', 'La Neverland', 'Wisdom Agbonghae', 'DJ Rashad', 'Dan Kye',
 'Pink Mario', 'Tora & Anna Boi', 'Amir Latran', 'Lupe Venzetti',
 'Devon Gilfillian', 'Carl Wayne', 'Alexander.S.Williams', 'King James III',
 'Tasha Duncan', 'Mondo Mason', 'Sardine12', 'NextupK', 'YNW SKI-G',
 'J.J. The Rapper', 'Lil frooty', 'Jinc Ent.', 'Nick Bostrom',
 'Tony Rose (Folk Singer)', 'Ynot and Lil Hibachi', 'Elias Lnnrot',
 'Sweet & Lynch', 'LEVR & Akacia', 'OfficialMindOfBlur', 'Danilyon', 'Jadon',
 'Freddie Raymond', 'KG Jay', 'EPIC // 555', 'PaKKman Mickyson',
 'Bands a Make Her Dance', 'Scooter & Xillions', 'Icedcoffeesodacan',
 'Arthur (Hip-Hop/R&B/Rap)', 'Insanian', 'Maseo', 'Gene Stratton-Porter',
 'Peter Wackel', 'Steve Hogarth', 'Matteo Ranieri', 'Fair Sex', 'Patti Jerome',
 'Ethan Logsdon', 'Steiner & Madlaina', 'ReytheCoolestLoser', 'Sunny Lukas',
 'GospelbeacH', 'Carl Sandburg', 'Stephen McNulty', 'French Park',
 'Yekim, Radio Big Mack', 'Olivia Herdt', 'Schilly', 'Nada909',
 'Joyce & Johnita Collins', 'Satellite', 'Versailles The Everything',
 'Beres Hammond & Popcaan', 'Damde8', 'Josh Saint', 'InfoFlo Pay', 'GLO 9',
 'Stockholm Monsters', '9TEEN (eng)', 'BARUCH', 'TheWACKYCOLLECTIVE',
 'Chocolate Droppa', 'NaviWDGT', 'Sheryl Crow & Johnny Cash', 'Lonli',
 'DraconiteDragon', 'Lazy Rios', 'Oli Lover', 'Weedpill', 'Precious Paris',
 'ShaunyFresh', 'Far Radio Clouds', 'Wy', 'Mrs. Wave', 'KGizzle', 'Maqo',
 'Wildcat', 'Cheap Thrills Lyrics - Sia', 'American Watercolors',
 'Armond WakeUp', 'Lil Saaf', 'Penis man', 'Jesse Campbell', 'Michael Franks',
 'Moon Bee', 'Rachel Bay Jones & Jennifer Laura Thompson', 'Trill Carl',
 'Ceezy FG', 'Apollyon Sun',
 'DJ Blackstone & Luxe 54 featuring A Taste Of Honey', 'Falsetto', 'Jaloo',
 'Big M', 'Myles Jacob', 'External Fields', 'Benjamin Hastings', 'Moralz40',
 'Corey James x Crusy & Jose De Mara', 'BdotAdot5', 'Yellowflowers',
 'Skeng HeI', 'Ranger Justin', 'Jan Slauerhoff', 'Joaquin corvalan',
 'Jeffrey McDaniel', 'Austin Underwood, Timothy Love', 'Hunter Nottingham',
 'ANMLPLNET', 'Hide And Seek', 'Kidd Keo & POUNDZ', 'Aaron McGonzo',
 'Mr. Wells', 'NYC DJ', 'Silence Is A Virus', 'Izzy Marcil', 'Gladius',
 "David Cronenberg's Wife" 'UwerMine', 'VeeDeshNee', 'Fam (R&B)',
 'William Allingham', 'Linear Downfall', 'Cirrha Niva',
 'Tjay Hayes (aka Baby Rich)', 'Le Motif', 'Alex Medrano', 'The Icicle Works',
 'Get the Gat (Clean)', 'Shogun', 'Gil Wilson', 'David Trobisch', 'Suzy Jones',
 'Carrie Premiere Cast, Michael Gore', 'Angel Crew', 'The Sons of Pitches',
 'The Motion Mosaic', 'Ben Brinton', 'The Cold Cuts', 'Grimlxck',
 'Lady Breezy', 'Hypnogaja', 'Xaphoon Jones & AC Slater', 'Dan Ganja',
 'The Atypicals', 'Shahul Habib', 'Quaro', 'Lonesome George', 'Ashfawks',
 'Pounder (Metal Band)', 'Ronald Larry', 'DC D-Nice', 'Monopoly Mane',
 'Meno N Envy', 'Kinj K.A.D.E, Yung Suxge & NED', 'The Phats Brothers',
 'CamelPhat & ARTBAT', 'JKD Kozart', 'Plotinus', 'Traco$', 'WAKJDSKL WJKASD',
 'Kid Cuebas', 'James Vane', 'Lil $horty', 'La Goony Chonga', 'Teleport',
 'Ryan Smooth', 'Z.E', 'New Kids On Your Mom', 'Zafra', 'perobug',
 'Rachel Pereira', 'XXXbrownie', 'Themselves', 'J Craft', 'G Felling',
 'Branch Stuffpuff', 'Thomasondatrack', 'RCK Media', 'Big Boy Pete',
 'Austin Chua', 'Ken Randle', 'WaterBoy130',
 'Jimmie Blythe And His Ragmuffins', 'Love potion', 'Shirugoth', 'State',
 "D'Yani" 'Empr3$$', 'Sa Vich', 'MaMan ft J and Nadine', 'HAVEN (US)',
 'HorsieRebel', 'Moodle-Tang Clan', 'The Empiire', 'Lisa Loeb & Nine Stories',
 'Savesaint', '10Tik', 'The Moonsoon Bassoon', 'Unity Klan', 'Strand, Mark',
 'Dalek I Love You', 'Yung $weeet', 'Proxy War', 'Huzsuh',
 'Manny K, Keire Stone', 'Charlie and the bhoys', 'NewErah', 'DeckTheBand',
 'Denny B', 'Steve JoHHbs', 'Benjaminimal', 'Bree my', 'Indigo Bill',
 'Throneaeon', 'The Attery Squash', 'Ollie', 'Tonner', 'West End Girls',
 'AngusBrown', 'Faraje', 'Sin  Ri-Ra', 'Pete Brown & Phil Ryan', 'Pip Skid',
 'JR & PH7', 'The Royals (Doo-Wop)', 'LzFromDaE']
))
    