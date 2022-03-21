import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from janome.tokenizer import Tokenizer
from wordcloud import WordCloud
from utils import remove_url

FONT_PATH = "fonts/keifont.ttf"


class WC:
    def __init__(self, texts, exclude_list):
        self.texts = texts
        self.exclude_list = exclude_list

    def __word_count(self):
        t = Tokenizer()
        words = []
        for text in self.texts:
            remove_url_text = remove_url(text)
            tokens = t.tokenize(remove_url_text)
            for token in tokens:
                part_of_speech = token.part_of_speech.split(',')[0]
                part_of_speech2 = token.part_of_speech.split(',')[1]
                if part_of_speech in ["名詞"]:
                    if (part_of_speech2 != "非自立") and (part_of_speech2 != "代名詞") and (part_of_speech2 != "数"):
                        if token.base_form not in self.exclude_list:
                            # print("{}: {} {}".format(token.base_form, part_of_speech, part_of_speech2))
                            words.append(token.base_form)
        return words

    def generate_word_cloud(self, filename, alpha=False, mask=False):
        words = self.__word_count()
        text = " ".join(words)
        if mask == "rect":
            mask = None
            wordcloud = WordCloud(background_color='white',
                                  colormap="viridis",
                                  font_path=FONT_PATH,
                                  width=320,
                                  height=160,
                                  mask=mask
                                  ).generate(text)
            wordcloud.to_file(filename)
            return None
        elif mask == "rect_large":
            mask = None
            wordcloud = WordCloud(background_color='white',
                                  colormap="viridis",
                                  font_path=FONT_PATH,
                                  mode="RGBA",
                                  width=800,
                                  height=400,
                                  mask=mask
                                  ).generate(text)
            wordcloud.to_file(filename)
            return None
        elif mask:
            mask = np.array(Image.open(mask))
        else:
            x, y = np.ogrid[:450, :900]
            mask = ((x - 225) ** 2 / 5 ** 2) + ((y - 450) ** 2 / 10 ** 2) > 40 ** 2
            mask = 255 * mask.astype(int)

        if alpha:
            wordcloud = WordCloud(background_color=None,
                                  colormap="viridis",
                                  font_path=FONT_PATH,
                                  mode="RGBA",
                                  mask=mask
                                  ).generate(text)
            wordcloud.to_file(filename)
        else:
            wordcloud = WordCloud(background_color="white",
                                  colormap="viridis",
                                  font_path=FONT_PATH,
                                  mask=mask
                                  ).generate(text)
            wordcloud.to_file(filename)

    @staticmethod
    def overdraw_image():
        im1 = Image.open("mask_photos/head-profile-of-young-male.png")
        im2 = Image.open("word_cloud_tweet_face_profile_alpha.png").convert("RGBA")
        im1.paste(im2, (1000, 500), im2)
        im1.save("word_cloud_tweet_face_profile_overlay.png", quality=95)
