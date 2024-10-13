import pandas as pd
import ast

# Function to create a table every artist, it's top keywords, and the top keywords of its genre which are the ones with the highest number of times they appear subctracted by the number of times they appear in the artist's top keywords
def create_venn_table():
    # Load main data
    data = pd.read_csv('./data/final_data.csv')

    # Load the time range of the artist, the genre and song ids
    artist_data = pd.read_csv('./data/artist_search_table.csv')

    # Load the data with the artist's top keywords 
    artist_keywords_data = pd.read_csv('./data/artist_keyword.csv')

    # Load the data with the time each keyword appears in each genre in each year
    genre_data = pd.read_csv('./data/bubble_table.csv')

    # Convert the 'keywords' column from string representations of lists to actual lists
    artist_keywords_data['keywords'] = artist_keywords_data['keywords'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    # Create a new dataframe to store the artists
    venn_table = pd.DataFrame(columns=['artist', 'artist_keywords', 'others_in_genre_keywords'])

    # Iterate over the rows of artists
    for index, row in artist_data.iterrows():
        
        if index == 10:
            break
 
        # Get the artist's songs
        artist_songs = row['song_ids']

        # Filter genre data by the artist's genre
        genre_data_artist = genre_data[genre_data['genre'] == row['genre']]

        # Get artist's time interval
        time_interval = ast.literal_eval(row['time_interval'])
        start_year = time_interval[0]
        end_year = time_interval[1]

        # Create a list to store the total count of each keyword in the genre
        genre_keywords_total_list = []

        # Iterate over the genre's keywords and count the number of times they appear in total inside the artist's time interval
        for genre_index, genre_row in genre_data_artist.iterrows():
            keyword = genre_row['keyword']
            count = 0

            for year in range(start_year, end_year + 1):
                count += genre_row[str(year)]
            genre_keywords_total_list.append({'keyword': keyword, 'count': count})
        
        # Convert the list to a DataFrame
        genre_keywords_total = pd.DataFrame(genre_keywords_total_list)
        # Sort the DataFrame by count
        genre_keywords_total = genre_keywords_total.sort_values(by='count', ascending=False)
        print(genre_keywords_total)
        
            
          

        


if __name__ == "__main__":
    create_venn_table()