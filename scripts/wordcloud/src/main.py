# -*- coding: utf-8 -*-
from utils import generate_exclude_list
from web import Web
from wc import WC
from convert_webp import conv_webp

FONT_PATH = "fonts/keifont.ttf"
BASE_URL = "https://blog.tubone-project24.xyz"
WEB_EXCLUDE_LIST = ["tag", "contact", "about", "sitemap", "pages", "rss", "photos", "privacy-policies", "header", "#"]


def main():
    exclude_list = generate_exclude_list()
    web = Web(BASE_URL, WEB_EXCLUDE_LIST)
    wordcloud_blog_words = WC(web.get_text_by_base_url(), exclude_list)
    wordcloud_blog_words.generate_word_cloud("word_cloud_blog.png", alpha=False, mask="rect")
    wordcloud_blog_words.generate_word_cloud("word_cloud_blog_large.png", alpha=True, mask="rect_large")
    conv_webp("word_cloud_blog.png")


if __name__ == "__main__":
    main()
