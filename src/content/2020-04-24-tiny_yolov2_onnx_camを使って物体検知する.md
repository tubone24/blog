---
slug: 2020/04/24/jetson-nano
title: tiny_yolov2_onnx_camを使って物体検知する
date: 2020-04-24T11:28:14.315Z
description: tiny_yolov2_onnx_camを使って物体検知する
tags:
  - 機械学習
  - 物体検知
headerImage: 'https://i.imgur.com/jzkNhR6.jpg'
templateKey: blog-post
---
こんにちは。

Jetson nanoを使って、物体検知をしてみます。

物体検知には[tiny_yolov2_onnx_cam](https://github.com/tsutof/tiny_yolov2_onnx_cam)を使います。

## Table of Contents

```toc

```

## Jetson nanoへのインストール

まず、Jetson nanoに **tiny_yolov2_onnx_cam** をインストールします。

基本は、[README.md](https://github.com/tsutof/tiny_yolov2_onnx_cam/blob/master/README.ja.md)に従って叩くだけです。

### 依存パッケージを入れる

```
$ sudo apt update

$ sudo apt install python3-pip protobuf-compiler libprotoc-dev libjpeg-dev cmake
```

画像を扱うためのライブラリと、[Protocol Buffers](https://developers.google.com/protocol-buffers)を扱うライブラリとCMakeです。

### Cythonを入れる

```
$ pip3 install --user cython
```

Cythonを入れます。入れないと、 pipで**requirements.txt**を使ってPyCudaを入れるとき、下記のような **Running cythonize failed!**が起きちゃいます。

```
Processing scipy/cluster/_vq_rewrite.pyx
Traceback (most recent call last):
  File "tools/cythonize.py", line 172, in <module>
    main()
  File "tools/cythonize.py", line 168, in main
    find_process_files(root_dir)
  File "tools/cythonize.py", line 160, in find_process_files
    process(cur_dir, fromfile, tofile, function, hash_db)
  File "tools/cythonize.py", line 137, in process
    processor_function(fromfile, tofile)
  File "tools/cythonize.py", line 66, in process_pyx
    raise OSError('Cython needs to be installed')
OSError: Cython needs to be installed

Traceback (most recent call last):
  File "setup.py", line 209, in <module>
    setup_package()
  File "setup.py", line 202, in setup_package
    generate_cython()
  File "setup.py", line 147, in generate_cython
    raise RuntimeError("Running cythonize failed!")
RuntimeError: Running cythonize failed!
```

### tiny_yolov2_onnx_camをインストールする

**git clone**でtiny_yolov2_onnx_camを落としてきます。

また、Cudaにパスを通します。

```
$ git clone https://github.com/tsutof/tiny_yolov2_onnx_cam

$ cd tiny_yolov2_onnx_cam

$ export PATH=$PATH:/usr/local/cuda-10.0.0/bin

$ python3 -m pip install -r requirements.txt
```

また、**Jetsonのクロックアップ**をします。

```
$ sudo nvpmodel -m 0
$ sudo jetson_clocks
```

## 起動する

Raspberry PIのカメラをぶっ刺したので**--camera -1**を引数にします。

![img](https://i.imgur.com/gWqd2xb.jpg)

```
$ python3 tiny_yolov2_onnx_cam.py --camera -1
```

ONNX形式からTensorRTに変換するので初回起動は時間かかります。

しばらくするとカメラが起動し、物体検知が始まります。

![img](https://i.imgur.com/jzkNhR6.jpg)
