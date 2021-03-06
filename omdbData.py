import requests
import json

data = []
with open('./top250ids.json', encoding="utf8") as topjson:
    data = json.load(topjson)

urls = list(
    map(lambda v: 'http://www.omdbapi.com/?apikey=94499cbb&i='+v['id'], data))
movies = []
for url in urls:

    response = requests.request("GET", url)

    result = json.loads(response.text, encoding="utf8")

    movies.append({
        'title': result['Title'],
        'year': int(result['Year']),
        'rating': float(result['imdbRating']),
        'genre': result['Genre'],
        'boxOffice': result['BoxOffice'],
        'id': result['imdbID']
    })

with open('./data.json', mode="w", encoding="utf8") as newjson:
    newjson.write(json.dumps(movies))
