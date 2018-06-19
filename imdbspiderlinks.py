import scrapy


class ImdbSpider(scrapy.Spider):
    name = 'imdbspiderlinks'
    start_urls = ['https://www.imdb.com/chart/top']

    def parse(self, response):
        for link in response.css('.titleColumn a::attr(href)').extract():
            yield {'id': str(link).split('/')[2]}
