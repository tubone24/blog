---
slug: 2019/10/6/mac-auto-setup
title: Ansible + Serverspecを使ってMacの環境構築を自動でする (Ansible編)
date: 2019-10-06T02:20:10.067Z
description: Ansible + Serverspecを使ってMacの環境構築を自動でします
tags:
  - Auto Provisioning
  - Ansible
  - Serverspec
  - Mac
headerImage: 'https://i.imgur.com/9iGRHft.png'
templateKey: blog-post
---
毎回Macの環境構築めんどくさい。

開発用MacBookの構成管理がしたくなり、AnsibleとServerspecを使って作りました。

記事が長くなりそうなので、今回は前半戦ということでAnsibleの設定について解説します。

## Table of Contents

```toc

```

## Ansible

![Img](https://i.imgur.com/oBucHNe.png)

Ansibleとは**Python**製の**OSS構成管理ツール**です。

便利なモジュールが多数用意されており、パッケージのインストール、コンフィグの書き換え、サービスの立ち上げ、有効化etc.. さまざまな構成を**Yaml形式**でパパっとかけることがポイントです。

また、**冪等（べきとう）性**、つまり何回実行しても結果が変わらないことを保証したり、**エージェントレス**で構成管理対象のサーバーに事前インストールが必要ないことが評価されている点です。

### MacでAnsibleを使う

ローカル環境であるMacの構成管理にもAnsibleが使えます。

ansible_connectionというパラメータをlocalにすることで、localhost上のマシンに対してコマンドが発行できるのでそれをうまく使います。

また、Macでパッケージをインストールするときにたびたびお世話になる**Homebrew**もAnsibleのモジュールにちゃんと用意されていますのでそちらを使います。

Homebrewでのインストールは次のように定義します。

```yaml
- name: 'Install Git'
  homebrew:
    name: 'git'
    state: 'present'
```

簡単そうですね。では早速作っていきましょう。

```
├─ansible
│  └─mac
│      ├─inventory
|      |  ├─default
│      │  └─group_vars
│      │      └─local
│      ├─playbooks
│      └─roles
│          └─dev-tools
│              ├─tasks
|              |   |
|              |   └─main.yml
|              |   └─hoge.yml
│              └─vars
|                 └─main.yml
```

Ansibleのディレクトリ構成は上記のようにしてます。

Ansibleのplaybookを作るにはざっくり3つの手順を取ります。

1. 接続先情報をまとめたInventoryを設定
2. 実際の構成情報を記載したRoleを設定
3. InventoryとRoleをひとまとめにしたplaybookを設定

では早速Inventoryの設定から進めていきます。

### Inventoryを設定する

Inventoryは複数のサーバーをグルーピングして、同時にプロビジョンするためにサーバーの接続情報をまとめておくコンフィグです。

今回はMacに適用するため、接続先情報はlocalとなります。

inventoryをコマンドで指定しない場合にdefalutで設定される`defalut`ファイルに下記を設定します。

[inventory/defalut](https://github.com/tubone24/mac-auto-setup/blob/master/ansible/mac/inventory/default) に、

```ini
[local]
localhost
```

これで、特にInventoryを指定しない場合は`localhost`として接続がされます。また、InventoryGroupとして`local`を指定しているため、`group_vars/local`にlocalとして共通の変数を定義できます。

今回は複数サーバーで共有させる変数が見当たらないので特に設定しません。

[inventory/group_vars/local/ansible.yml](https://github.com/tubone24/mac-auto-setup/blob/master/ansible/mac/inventory/group_vars/local/ansible.yml) に、

```yaml
ansible_connection: 'local'
```

と設定しておけばいいです。

### Roleを設定

次にRoleを設定していきます。

今回は特にRoleを分ける必要もないのですが、たとえば、

- 開発者のMac
- デザイナーのMac
- 運用者のMac

とそれぞれインストールするアプリが異なる場合、全員に共通して入れたい設定やAさんは開発者兼デザイナーで両方のアプリが入れたいなどの要求もある場合はそれぞれ、

- dev-tools
- design-tools
- ops-tools

みたくRoleをわけておくのがセオリーです。

さて、今回は開発者用のRoleだけつくればいいことにしますので、

dev-toolsだけ用意します。

また、各RoleにはTaskというプロビジョニングの実行単位があります。

例えば、Pythonを入れるTask、Node.jsを入れるTaskという具合です。

AnsibleではTasksディレクトリのmain.ymlが読み込まれるため、**各Taskごとに分けたYaml**を**main.ymlでInclude**して上げればいいわけです。

roles/dev-tools/tasks/main.ymlに、

```yaml
- include: 'tools.yml'
- include: 'git.yml'
- include: 'nodejs.yml'
- include: 'terraform.yml'
- include: 'python.yml'
- include: 'ruby.yml'
- include: 'docker.yml'
```

とIncludeさせるだけです。かんたんです。

#### Homebrew

上記にも書いたとおり、AnsibleではHomebrewモジュールが用意されているため、

[roles/dev-tools/tasks/nodejs.yml](https://github.com/tubone24/mac-auto-setup/blob/master/ansible/mac/roles/dev-tools/tasks/nodejs.yml)

```yaml
- name: 'Install nodenv'
  homebrew:
    name: 'nodenv'
    state: 'present'
```

と記載すればインストールが実現できます。

また、用意されているモジュールを使うことで、すでにインストール、設定済みでも、

エラーにならずプロビジョニングが終了しますのでなるべく使えるモジュールがないか探しましょう。

#### PATHの通し方

構成のなかでいくつかPATHを通す必要があり、bash_profileに環境変数のexportを記載する必要がでてきました。

```bash
# bash_profileに書きたい
export PYENV_ROOT="${HOME}/.pyenv"
export PATH=${PYENV_ROOT}/bin:${PYENV_ROOT}/shims:${PATH}

if [ -d "${PYENV_ROOT}" ]; then
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
fi
```

そのようなときに役立つのが**inlinefile**と**blockinline**です。

[roles/dev-tools/tasks/python.yml](https://github.com/tubone24/mac-auto-setup/blob/master/ansible/mac/roles/dev-tools/tasks/python.yml)

```yaml
# inlinefile
- name: 'Add PATH'
  lineinfile:
    dest: '~/.bash_profile'
    line: '{{ item }}'
  with_items:
    - 'export PYENV_ROOT="${HOME}/.pyenv"'
    - 'export PATH=${PYENV_ROOT}/bin:${PYENV_ROOT}/shims:${PATH}'

# blockinline
- name: 'Setup pyenv-virtualenv'
  blockinfile:
    dest: '~/.bash_profile'
    block: |
      if [ -d "${PYENV_ROOT}" ]; then
        eval "$(pyenv init -)"
        eval "$(pyenv virtualenv-init -)"
      fi
```

のように呼び出すだけでbash_profileに**冪等性を保ったまま、コンフィグを書き込むこと**ができます。

inlinefileとblockinlineの違いは一行か複数行かということです。

blockinlineで複数行を記載するとblockの中身の順番が**担保**されます。

#### shell

モジュールが見あたらなく、プロビジョニングができないときは仕方なくshellモジュールを使うことができます。


[roles/dev-tools/tasks/python.yml](https://github.com/tubone24/mac-auto-setup/blob/master/ansible/mac/roles/dev-tools/tasks/python.yml)

```yaml
- name: 'Install Python 3.6.1'
  shell: 'pyenv install 3.6.1'
  ignore_errors: yes
```

ただし、冪等性は保たれないため、すでに環境ができていた場合、エラーになってしまう可能性があります。

少し乱暴ですが、**ignore_errors: yes** を使うことでエラーがでても読み飛ばして次のタスクに進むことができます。

今回はignore_errors: yesした部分をServerspecで確認する形でOKとしてます。

#### 変数の管理

変数を管理したくなったらvarsに記載することでtask側でも呼び出すことができます。

[vars/main.yml](https://github.com/tubone24/mac-auto-setup/blob/master/ansible/mac/roles/dev-tools/vars/main.yml) に、

```yaml
git:
  name: "foobar"
  mail: "hoge@example.com"
```

と記載し、

```yaml
- name: 'Set git name'
  shell: 'git config --global user.name "{{ git.name }}"'

- name: 'Set git mail'
  shell: 'git config --global user.email "{{ git.mail }}"'
```

と宣言すれば利用できます。

### playbookの設定

Ansible最後はplaybookです。

とはいったものの、roleとinventoryを紐づければいいだけですので、

[playbooks/my-mac.yml](https://github.com/tubone24/mac-auto-setup/blob/master/ansible/mac/playbooks/my-mac.yml)

```yaml
- hosts: 'local'
  roles:
    - 'dev-tools'
```

とすれば出来上がりです。

これで、

```bash
ansible-playbook playbooks/my-mac.yml
```

のように実行すればansibleの実行が可能です。

## Makefileで一発実行

仕上げにMakefileをディレクトリルートに作り、煩わしいコマンドから解放されましょう。

[Makefile](https://github.com/tubone24/mac-auto-setup/blob/master/Makefile)に、

```
TARGET = $1
CD_ANSIBLE = cd ansible/${TARGET}
CD_SERVERSPEC = cd serverspec/${TARGET}

setup:
	@${CD_ANSIBLE} && \
	ansible-playbook playbooks/my-mac.yml
```

のように設定しました。

これで、

```bash
make setup TARGET=mac
```

で実行可能になりました。

## 結論

長くなったのでServerspecは次項で話します。

Ansibleはディレクトリが複雑なイメージがありますが、意味を理解すれば簡単です。

みなさまもMacの構成管理にトライしてみてください。
