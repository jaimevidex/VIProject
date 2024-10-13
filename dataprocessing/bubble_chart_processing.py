import pandas as pd
import ast

# Function to create a table for each genre with the top keywords and the number of times they appear for each year
def create_bubble_table():
    # Load the data
    data = pd.read_csv('./data/final_data.csv')

    # Convert the 'keywords' column from string representations of lists to actual lists
    data['keywords'] = data['keywords'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    # Sort the data by genre and year
    #data = data.sort_values(by=['tag', 'year'])

    # Create a new dataframe to store the keywords
    bubble_table = pd.DataFrame(columns=['keyword', 'genre', '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'])

    # Go through each genre data and count the number of times each keyword appears in each year
    for index, row in data.iterrows():
        # Get the keywords from the row
        keywords = row['keywords']

        # Get the genre from the row
        genre = row['tag']

        # Get the year from the row
        year = str(row['year'])

        # Iterate over the keywords
        for keyword in keywords:
            # Check if the keyword with that genre is already in the bubble_table
            if keyword in bubble_table['keyword'].values and genre in bubble_table[bubble_table['keyword'] == keyword]['genre'].values:
                # Get the index of the keyword
                i = bubble_table[(bubble_table['keyword'] == keyword) & (bubble_table['genre'] == genre)].index[0]
                # Update the year count
                if year in bubble_table.columns:
                    bubble_table.at[i, year] += 1
                else:
                    bubble_table[year] = 0
                    bubble_table.at[i, year] += 1
            else:
                # Add the keyword to the bubble_table
                new_row = pd.DataFrame({'keyword': [keyword], 'genre': [genre], '1960': 0, '1961': 0, '1962': 0, '1963': 0, '1964': 0, '1965': 0, '1966': 0, '1967': 0, '1968': 0, '1969': 0, '1970': 0, '1971': 0, '1972': 0, '1973': 0, '1974': 0, '1975': 0, '1976': 0, '1977': 0, '1978': 0, '1979': 0, '1980': 0, '1981': 0, '1982': 0, '1983': 0, '1984': 0, '1985': 0, '1986': 0, '1987': 0, '1988': 0, '1989': 0, '1990': 0, '1991': 0, '1992': 0, '1993': 0, '1994': 0, '1995': 0, '1996': 0, '1997': 0, '1998': 0, '1999': 0, '2000': 0, '2001': 0, '2002': 0, '2003': 0, '2004': 0, '2005': 0, '2006': 0, '2007': 0, '2008': 0, '2009': 0, '2010': 0, '2011': 0, '2012': 0, '2013': 0, '2014': 0, '2015': 0, '2016': 0, '2017': 0, '2018': 0, '2019': 0, '2020': 0, '2021': 0, '2022': 0})
                if year in new_row.columns:
                    new_row.at[0, year] += 1

                bubble_table = pd.concat([bubble_table, new_row], ignore_index=True)

        # Print the percentage of rows that have been processed
        print(f'{index / len(data) * 100:.1f}% of rows processed for bubble chart')
        print('\033[F', end='')

    # Save the bubble_table to a csv file
    bubble_table.to_csv('./data/bubble_table.csv', index=False)


if __name__ == "__main__":
    create_bubble_table()
    # Remove any column after 2022 column in the bubble_table.csv file
    bubble_table = pd.read_csv('./data/bubble_table.csv')
    bubble_table = bubble_table.loc[:, :'2022']
    bubble_table.to_csv('./data/bubble_table.csv', index=False)
    print('Bubble table created')