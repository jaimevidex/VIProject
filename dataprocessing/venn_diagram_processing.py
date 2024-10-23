import pandas as pd
import ast

def create_venn_table():
    # Load keyword artist data
    artist_keywords_data = pd.read_csv('./data/artist_search_table.csv')

    # Load data
    data = pd.read_csv('./data/final_data.csv')

    # Load genre data
    genre_data = pd.read_csv('./data/bubble_table.csv')

    # Add a column to the artist_keywords_data to store the artist's genre
    artist_keywords_data['genre'] = artist_keywords_data['artist'].apply(lambda x: data[data['artist'] == x]['tag'].values[0] if len(data[data['artist'] == x]['tag'].values) > 0 else None)

    # Iterate over each genre
    for index, row in artist_keywords_data.iterrows():

        # Filter genre data by the artist's genre
        genre_data_artist = genre_data[genre_data['genre'] == row['genre']]

        # Get artist's time interval
        time_interval = ast.literal_eval(row['time_interval'])
        start_year = max(time_interval[0],1960 )
        end_year = min(time_interval[1], 2022)

        # Create a list to store the total count of each keyword in the genre
        genre_keywords_total_list = []

        # Create a list with all the years in the artist's time interval
        years = [str(year) for year in range(start_year, end_year + 1)]

        # Iterate over the genre's keywords and count the number of times they appear in total inside the artist's time interval
        for genre_index, genre_row in genre_data_artist.iterrows():
            keyword = genre_row['keyword']
            count = 0

            # Iterate over the years in the artist's time interval
            for year in years:
                count += genre_row[year]

            genre_keywords_total_list.append({'keyword': keyword, 'count': count})
        
        # Convert the list to a DataFrame
        genre_keywords_total = pd.DataFrame(genre_keywords_total_list)
        # Sort the DataFrame by count
        genre_keywords_total = genre_keywords_total.sort_values(by='count', ascending=False)

        # Get the top 10 keywords
        genre_keywords_total = genre_keywords_total.head(10)

        #Save them in a new column in the artist_keywords_data
        artist_keywords_data.at[index, 'genre_keywords'] = genre_keywords_total['keyword'].values
        
        # Print the percentage of rows that have been processed
        print(f'{index / len(artist_keywords_data) * 100:.1f}% of rows processed for venn diagram')
        print('\033[F', end='')

    # Add column artist keywords to the artist_keywords_data
    keywords_data = pd.read_csv('./data/artist_keywords.csv')    
    artist_keywords_data['artist_keywords'] = artist_keywords_data['artist'].apply(lambda x: keywords_data[keywords_data['artist'] == x]['keywords'].values[0] if len(keywords_data[keywords_data['artist'] == x]['keywords'].values) > 0 else None)

    # Drop column time_interval and song_ids
    artist_keywords_data = artist_keywords_data.drop(columns=['time_interval', 'song_ids'])

    # Save the artist_keywords_data to a csv file
    artist_keywords_data.to_csv('./data/venn_table.csv', index=False)

import re

if __name__ == "__main__":
    #create_venn_table()

    df = pd.read_csv('./data/venn_table.csv')

    # Replace newline characters with commas in all string columns
    df = df.applymap(lambda x: x.replace('\n', ',') if isinstance(x, str) else x)

    # Save the modified DataFrame back to the CSV file
    df.to_csv('./data/venn_table.csv', index=False)

    