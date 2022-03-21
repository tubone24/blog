import os
import re
import codecs
import emoji


def generate_exclude_list():
    exclude_list = []
    with codecs.open(os.path.join(os.path.dirname(__file__), "stop_words.txt"), "r", "UTF-8") as lines:
        for line in lines:
            exclude_list.append(line.replace("\n", "").replace("\r", ""))
    return exclude_list


def remove_emoji(src_str):
    return "".join(c for c in src_str if c not in emoji.UNICODE_EMOJI)


def remove_url(text):
    return re.sub(r"(https?|ftp)(:\/\/[-_\.!~*\'()a-zA-Z0-9;\/?:\@&=\+$,%#]+)", "", text)
