from time import sleep
from bs4 import BeautifulSoup
import requests
from reppy.cache import RobotsCache
from retrying import retry
from utils import remove_emoji, remove_url


class Web:
    def __init__(self, url, exclude_list):
        self.base_url = url
        self.exclude_list = exclude_list

    def get_text_by_base_url(self):
        robots = RobotsCache(capacity=100)
        if not robots.allowed(self.base_url, "python-requests"):
            return ["Crawling this site is not allowed by robots.txt"]
        text_list = []
        for slug in self.__get_links_by_url_depth():
            print(slug)
            sleep(0.5)
            text_list.append(remove_emoji(remove_url(self.__get_text_by_url(self.base_url + slug))).strip())
        return text_list

    def __get_links_by_url(self, url):
        res = self.__requests_get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        title = soup.find("title").get_text()
        print("page title: {}".format(title))
        links = [url.get("href") for url in soup.find_all("a") if 'http' not in url.get("href")]
        for exclude in self.exclude_list:
            links = [link for link in links if exclude not in link]
        print("get {} links".format(len(links)))
        return links

    def __get_links_by_url_depth(self, depth=8):
        all_links = set()
        done_crawl = set()
        for i in range(depth):
            print("loop depth: {}".format(i))
            links = set(self.__get_links_by_url(self.base_url))
            all_links |= links
            diff_links = links - done_crawl
            for link in diff_links:
                all_links |= set(self.__get_links_by_url(self.base_url + link))
                sleep(0.5)
            done_crawl |= diff_links
        return all_links

    def __get_text_by_url(self, url):
        res = self.__requests_get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        content = soup.find("div", class_='content')
        if content:
            return content.get_text()
        else:
            return ""

    @staticmethod
    @retry(wait_exponential_multiplier=1000, wait_exponential_max=10000)
    def __requests_get(url):
        return requests.get(url)

