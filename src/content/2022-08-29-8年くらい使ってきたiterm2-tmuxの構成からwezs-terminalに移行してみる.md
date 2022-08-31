---
slug: 2022/08/29/wezterm
title: 8年くらい使ってきたiTerm2 + tmuxの構成からWez's Terminalに移行してみる
date: 2022-08-29T13:00:24.971Z
description: 8年くらい使ってきたiTerm2 + tmuxの構成からWez's Terminalに移行してみる
tags:
  - terminal
  - 開発環境
headerImage: https://i.imgur.com/h5RiIEv.png
templateKey: blog-post
---
## Table of Contents

ついにターミナル周りを更新します。

```toc

```

## Wez's Terminal Emulatorとは？

[Wez's Terminal Emulator](https://wezfurlong.org/wezterm/)とは[Wez](https://github.com/wez/)さんの作ったRust製のターミナルです。

ターミナルは正直そこまで違いがないと思ってましたが、weztermの主な特徴としてGPUアクセラレータとクロスプラットフォームがあるらしいです。

クロスプラットフォームについては私はWindows,Mac両方使うことが多いので助かりますね。

GPUアクセラレータは以前のターミナル（iTerm2）で不満もなかったので感動が味わえるか不安です。ただiTerm2はなんとなくもっさりしている気がしてます。気がしているだけと割り切ってましたが調べてみると他の皆さんももっさりしていることに不満を申しているっぽいです[要出典]。

## 今までの環境

今までずっとMacではiTerm2にtmuxを指してターミナルとして使ってました。

特に不満もなかったのでコンフィグの更新はあるものの、なんだかんだ8年くらいこの構成だと思います。

というよりこの手の設定を構築してしまうと更新が億劫になるんですよね。

![img](https://i.imgur.com/WeeoXsW.png)

ただそこまでカスタマイズはしてなくてちょっとキーバインドを変えているのとコピーモードを使いやすくしているのとステータスバーを表示させているくらいです。

同じような使い心地でweztermに乗り換えられれば大満足です。

## 乗り換えてみた

![img](https://i.imgur.com/h5RiIEv.png)

見た目はこんな感じになりました。

コンフィグは[Lua](https://www.lua.org/)で作るのですが[ドキュメント](https://wezfurlong.org/wezterm/config/files.html)がしっかりしているのとWezさんが結構GitHub Issueでコンフィグ例を公開しているのでめちゃくちゃ参考になりました。

下記に軽くだけ設定を共有します。

### SSH Connection

正直最近コンテナ仕事が多くて直にサーバーにログインする機会がそこまで多くないのですが
あらかじめweztermをサーバーに入れておけば[ターミナルマルチプレクサ](https://wezfurlong.org/wezterm/multiplexing.html#multiplexing)でセッションを作ることができます。
しかも[enumerate_ssh_hosts](https://wezfurlong.org/wezterm/config/lua/wezterm/enumerate_ssh_hosts.html)を使うことで勝手に **~/.ssh/config** を読み込んでくれて設定してくれます。
本機能を使うのであればぜひとも使いたいですね。

```lua
local wezterm = require 'wezterm';

-- SSH Domains
local ssh_domains = {}
for host, config in pairs(wezterm.enumerate_ssh_hosts()) do
    table.insert(ssh_domains, {
        name = host,
        remote_address = config["hostname"],
        username = config["user"],
        ssh_option = { identityfile = config["identityfile"] },
    })
end
```

### target_triple

クロスプラットフォームが売りなので、プラットフォームを[Rust target triple](https://doc.rust-lang.org/nightly/rustc/platform-support.html)で確認してコンフィグを分岐させることができます。

```lua
-- デフォルト(ほぼLinux)はbash
local default_prog = { 'bash', '-l' }

-- OS環境差分吸収
if wezterm.target_triple == "x86_64-pc-windows-msvc" then
  default_prog = { 'pwsh.exe', '-NoLogo' }
end
if wezterm.target_triple == "x86_64-apple-darwin" then 
  default_prog = { 'zsh', '-l' }
end

```

### タブのカスタマイズ

タブのタイトルもカスタマイズ可能です。

タイトルにはタブ番号、ディレクトリ、プロセス名を出すようにしてます。

あと、pane分割を実施した際に特定のpaneにズームした際にわかるようにしてます。

また、プロセス名によってアイコンを変えてます。そこまでバリエーション作ってませんが...。

![img](https://i.imgur.com/NOGpKZf.png)

```lua
-- Equivalent to POSIX basename(3)
-- Given "/foo/bar" returns "bar"
-- Given "c:\\foo\\bar" returns "bar"
local function basename(s)
	return string.gsub(s, "(.*[/\\])(.*)", "%2")
end

-- タブのカスタマイズ
wezterm.on("format-tab-title", function(tab, tabs, panes, config, hover, max_width)

    -- プロセスに合わせてアイコン表示
	local nerd_icons = {
		nvim = wezterm.nerdfonts.custom_vim,
		vim = wezterm.nerdfonts.custom_vim,
		bash = wezterm.nerdfonts.dev_terminal,
		zsh = wezterm.nerdfonts.dev_terminal,
		ssh = wezterm.nerdfonts.mdi_server,
		top = wezterm.nerdfonts.mdi_monitor,
        docker = wezterm.nerdfonts.dev_docker,
        node = wezterm.nerdfonts.dev_nodejs_small,
	}
    local zoomed = ""
    if tab.active_pane.is_zoomed then
      zoomed = "[Z] "
    end
	local pane = tab.active_pane
	local process_name = basename(pane.foreground_process_name)
	local icon = nerd_icons[process_name]
	local index = tab.tab_index + 1
	local cwd = basename(pane.current_working_dir)
    
    -- 例) 1:project_dir | zsh
	local title = index .. ": " .. cwd .. "  | " .. process_name
	if icon ~= nil then
		title = icon .. "  " .. zoomed .. title
	end
	return {
		{ Text = " " .. title .. " " },
	}
end)


### 右ステータス

ほぼ<https://github.com/wez/wezterm/issues/500>のパクリですが右ステータスも作ることができます。

リモートで仕事しているとWebミーティングに遅刻しないように秒まで刻むような生活になってしまったので秒数まで時刻表示させてます。

```lua
-- 右ステータスのカスタマイズ
wezterm.on("update-right-status", function(window, pane)
    local cells = {};
    -- 現在のディレクトリ
    local cwd_uri = pane:get_current_working_dir()
    if cwd_uri then
      cwd_uri = cwd_uri:sub(8);
      local slash = cwd_uri:find("/")
      local cwd = ""
      local hostname = ""
      local leader = ''
      if window:leader_is_active() then
        leader = 'LEADER'
      end
      -- paneの累計IDを取得
      local pane_id = pane:pane_id()
      if slash then
        hostname = cwd_uri:sub(1, slash-1)
        local dot = hostname:find("[.]")
        if dot then
          hostname = hostname:sub(1, dot-1)
        end
        cwd = cwd_uri:sub(slash)
  
        table.insert(cells, cwd);
        table.insert(cells, pane_id);
        table.insert(cells, leader);
      end
    end
  
    -- 時刻表示
    local date = wezterm.strftime("%m/%-d %H:%M:%S %a");
    table.insert(cells, wezterm.nerdfonts.mdi_clock .. '  ' .. date);
  
    -- バッテリー
    for _, b in ipairs(wezterm.battery_info()) do
      table.insert(cells, string.format("%.0f%%", b.state_of_charge * 100))
    end
  
    -- The powerline < symbol
    local LEFT_ARROW = utf8.char(0xe0b3);
    -- The filled in variant of the < symbol
    local SOLID_LEFT_ARROW = utf8.char(0xe0b2)
  
    -- Color palette for the backgrounds of each cell
    local colors = {
      "#3c1361",
      "#52307c",
      "#663a82",
      "#7c5295",
      "#b491c8",
    };
  
    -- Foreground color for the text across the fade
    local text_fg = "#c0c0c0";
  
    -- The elements to be formatted
    local elements = {};
    -- How many cells have been formatted
    local num_cells = 0;
  
    -- Translate a cell into elements
    function push(text, is_last)
      local cell_no = num_cells + 1
      table.insert(elements, {Foreground={Color=text_fg}})
      table.insert(elements, {Background={Color=colors[cell_no]}})
      table.insert(elements, {Text=" "..text.." "})
      if not is_last then
        table.insert(elements, {Foreground={Color=colors[cell_no+1]}})
        table.insert(elements, {Text=SOLID_LEFT_ARROW})
      end
      num_cells = num_cells + 1
    end
  
    while #cells > 0 do
      local cell = table.remove(cells, 1)
      push(cell, #cells == 0)
    end
  
    window:set_right_status(wezterm.format(elements));
  end);


### その他

その他の設定値はreturnで返してあげれば設定できます。

カラースキーマ―は[VibrantInk](https://wezfurlong.org/wezterm/colorschemes/v/index.html?highlight=VibrantInk#vibrantink)を使ってます。

一時期コントラストの薄いスキーマ―使ってましたがやっぱりハイコントラストがかっこいいですね。個人の主観です。

あと、個人的にマストかなと思うのがvisual_bellです。Macの音声をmuteにしている時にも警告が可視化できたほうがいいと考えているからです。

ちょっと目がチカチカする設定なのでもしかしたら今後変更するかもしれません。

```lua
return {
    -- https://wezfurlong.org/wezterm/colorschemes/v/index.html?highlight=VibrantInk#vibrantink
    color_scheme = 'VibrantInk',
    -- 背景透過
    window_background_opacity = 0.91,
    adjust_window_size_when_changing_font_size = false,
    window_close_confirmation = 'AlwaysPrompt',
    animation_fps = 1,
    default_cursor_style = 'BlinkingBlock',
    enable_scroll_bar = true,
    default_prog = default_prog,
    ssh_domains = ssh_domains,
    visual_bell = {
        fade_in_function = 'EaseIn',
        fade_in_duration_ms = 105,
        fade_out_function = 'EaseOut',
        fade_out_duration_ms = 150,
      },
      colors = {
        visual_bell = '#0A0A0A',
      },
    launch_menu = {
        {
            label = "Zsh",
            args = {"zsh"},
          },
        {
          label = "PowerShell 7",
          args = {"pwsh"},
        },
      },
  };
  ```

キーバインドはとりあえずデフォルトのままにしてます。これから頑張って覚えていこうと思います！

コピーモードさえちゃんと使えこなせればほぼクリアと思ってます。

## 結論

久しぶりに開発環境を更新しましたが楽しかったです。

## 参考

- [Wez's Terminal Emulator Docs](https://wezfurlong.org/wezterm/index.html)
- [Tmux Like Status Bar](https://github.com/wez/wezterm/issues/500)
- [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes#screenshots)