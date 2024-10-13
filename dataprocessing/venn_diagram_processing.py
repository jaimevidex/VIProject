import pandas as pd

def create_venn_table():
    # Load keyword artist data
    artist_keywords_data = pd.read_csv('./data/artist_keyword.csv')

    # Load data
    data = pd.read_csv('./data/final_data.csv')

    # Add a column to the artist_keywords_data to store the artist's genre
    artist_keywords_data['genre'] = artist_keywords_data['artist'].apply(lambda x: data[data['artist'] == x]['tag'].values[0] if len(data[data['artist'] == x]['tag'].values) > 0 else None)

    # Save the artist_keywords_data to a csv file
    artist_keywords_data.to_csv('./data/venn_table.csv', index=False)
        


if __name__ == "__main__":
    create_venn_table()