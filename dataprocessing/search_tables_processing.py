import pandas as pd
import ast

# Function to create a table with every keyword, the genre it appears in, and the time interval it appears in, and the ids of the songs it appears in
def create_keyword_search_table():
    # Load the data
    data = pd.read_csv('./data/final_data.csv')

    # Convert the 'keywords' column from string representations of lists to actual lists
    data['keywords'] = data['keywords'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    # Create a new dataframe to store the keywords
    keyword_search_table = pd.DataFrame(columns=['keyword', 'genres', 'time_interval', 'song_ids'])

    # Iterate over the rows of the data
    for index, row in data.iterrows():
        # Get the keywords from the row
        keywords = row['keywords']
        # print(keywords)

        # Get the genre from the row
        genre = row['tag']
        # print(genres)

        # Get the id of the song
        song_id = row['id']

        # Iterate over the keywords
        for keyword in keywords:
            # print(keyword)
            # Create a max and min time interval for the keyword
            time_interval = (row['year'], row['year'])
            # print(time_interval)
            # Check if the keyword is already in the keyword_search_table
            if keyword in keyword_search_table['keyword'].values:
                # Get the index of the keyword
                i = keyword_search_table[keyword_search_table['keyword'] == keyword].index[0]
                # Update the genres, time interval, and song_ids
                if genre not in keyword_search_table.at[i, 'genres']:
                    keyword_search_table.at[i, 'genres'].append(genre)
                keyword_search_table.at[i, 'song_ids'].append(song_id)
                keyword_search_table.at[i, 'time_interval'] = (min(time_interval[0], keyword_search_table.at[i, 'time_interval'][0]), max(time_interval[1], keyword_search_table.at[i, 'time_interval'][1]))            
            else:
                # Add the keyword to the keyword_search_table
                new_row = pd.DataFrame({'keyword': [keyword], 'genres': [[genre]], 'time_interval': [time_interval], 'song_ids': [[song_id]]})
                keyword_search_table = pd.concat([keyword_search_table, new_row], ignore_index=True)

        # Print the percentage of rows that have been processed
        print(f'{index / len(data) * 100:.1f}% of rows processed for keywords')
        print('\033[F', end='')

    # Sort the keyword_search_table by keyword alphabetically
    keyword_search_table = keyword_search_table.sort_values(by='keyword')

    # Save the keyword_search_table to a csv file
    keyword_search_table.to_csv('./data/keyword_search_table.csv', index=False)

# Function to create a table with every artist, its genre, the time interval it appears in, and the ids of the songs it appears in
def create_artist_search_table():
    # Load the data
    data = pd.read_csv('./data/final_data.csv')

    # Create a new dataframe to store the artists
    artist_search_table = pd.DataFrame(columns=['artist', 'genre', 'time_interval', 'song_ids'])

    # Iterate over the rows of the data
    for index, row in data.iterrows():
        # Get the artist from the row
        artist = row['artist']
        # print(artist)

        # Get the genre from the row
        genre = row['tag']
        # print(genres)

        # Get the id of the song
        song_id = row['id']

        # Create a max and min time interval for the artist
        time_interval = (row['year'], row['year'])
        # print(time_interval)

        # Check if the artist is already in the artist_search_table
        if artist in artist_search_table['artist'].values:
            # Get the index of the artist
            i = artist_search_table[artist_search_table['artist'] == artist].index[0]
            # Update the time interval and song_ids
            artist_search_table.at[i, 'song_ids'].append(song_id)
            artist_search_table.at[i, 'time_interval'] = (min(time_interval[0], artist_search_table.at[i, 'time_interval'][0]), max(time_interval[1], artist_search_table.at[i, 'time_interval'][1]))            
        else:
            # Add the artist to the artist_search_table
            new_row = pd.DataFrame({'artist': [artist], 'genre': [genre], 'time_interval': [time_interval], 'song_ids': [[song_id]]})
            artist_search_table = pd.concat([artist_search_table, new_row], ignore_index=True)

        # Print the percentage of rows that have been processed
        print(f'{index / len(data) * 100:.1f}% of rows processed for artists')
        print('\033[F', end='')
    # Save the artist_search_table to a csv file
    artist_search_table.to_csv('./data/artist_search_table.csv', index=False)


#create_keyword_search_table()
create_artist_search_table()

# Sort the artist_search_table by artist alphabetically
pd.read_csv('./data/artist_search_table.csv').sort_values(by='artist').to_csv('./data/artist_search_table.csv', index=False)