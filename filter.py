import csv
import json
movies = []
ids = []
with open('./top250ids.json', encoding='utf8') as topjson:
    ids = list(map(lambda x: x['id'], json.load(topjson)))
with open("./movie_metadata.csv_movie_metadata.csv", encoding="utf8") as tsvfile:
    tsvreader = csv.reader(tsvfile, delimiter=",")
    i = 0
    for line in tsvreader:
        if 'imdb_score' in line:
            continue
        if line[23] == '':
            continue
        movies.append({
            'rating': float(line[25]),
            'genres': line[9].split('|'),
            'title':  str(line[11]).rstrip(),
            'year': int(line[23]),
            'budget': line[22],
            'id': i,
            'url': str(line[17])
        })
        i += 1

# sortedMovies = sorted(movies, key=lambda x: x['rating'], reverse=True)
top250 = list(filter(lambda m: str(m['url']).split('/')[4] in ids, movies))
# print(top250)
with open('data.json', 'w') as outfile:
    # top = sortedMovies[:250]
    json.dump(top250, outfile)
