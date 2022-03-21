#!/usr/bin/env bash
git clone https://github.com/neologd/mecab-ipadic-neologd.git
xz -dkv mecab-ipadic-neologd/seed/*.csv.xz
cat mecab-ipadic-neologd/seed/*.csv > neologd.csv
rm -rf mecab-ipadic-neologd
python src/build_neologd_dict.py
tar czf neologd.tar.gz neologd
rm neologd.csv
