import csv
import json
movies = []
with open("./movie_metadata.csv_movie_metadata.csv", encoding="utf8") as tsvfile:
    tsvreader = csv.reader(tsvfile, delimiter=",")
    for line in tsvreader:
        if 'imdb_score' in line:
            continue
        if line[23] == '':
            continue
        movies.append({
            'rating': float(line[25]),
            'genres': line[9].split('|'),
            'title':  str(line[11]).rstrip(),
            'year': int(line[23])
        })

sortedMovies = sorted(movies, key=lambda x: x['rating'], reverse=True)
with open('data.json', 'w') as outfile:
    top = sortedMovies[:500]
    json.dump(top, outfile)
