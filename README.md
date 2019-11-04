# Bubble-System

## 项目介绍

`Bubble-System` 是一个结合气泡图、柱状图等元素为一体的可视化框架，可用于时序数据的可视化展示。该框架使用原生 JavaScript+d3.js 开发，并有多种参数可以配置，可以很方便地根据需求进行调整。

## 使用方法

### 1.配置数据

将所需图片复制到`\img`文件夹下，将数据文件、配置文件复制到`\data`文件夹下。

### 2.启动服务

两种启动方式任选一

> 1.提前安装 python 用作启动服务

- 在工程根目录下执行命令:<br>
  Python 2: `python -m SimpleHTTPServer 9093`<br>
  Python 3: `python -m http.server 9093`

> 2.提前安装 node.js 用作启动服务

- 在工程根目录下依次执行以下命令:<br>
  `npm i`<br>
  `npm start`

### 3.查看结果

- 使用浏览器打开`localhost:9093`查看结果。

## 所需文件

1. `data.csv`

   格式如下：

   | date | name | value | group  |
   | ---- | ---- | ----- | ------ |
   | 1992 | 中国 | 123   | 亚洲   |
   | 1992 | 美国 | 213   | 北美洲 |
   | ……   | ……   | ……    | ……     |

   `date`为代表时间或者序列，值可以为年、日期、序号等。

   `name`为节点名称，如各国名称、名性名字。

   `value`为具体数值，可以为整数、浮点数。

   `group`为群组，这个值代表节点所属群组，用于初始化时气泡图节点聚类及颜色分配，即统一群组的节点会聚集到一起，颜色也会保持一致。

2. `config.json`
   配置文件，主要可以配置以下参数

   | 名称        | 描述                                                                        | 示例                             |
   | ----------- | --------------------------------------------------------------------------- | -------------------------------- |
   | colors      | 气泡、柱子配色                                                              | 暂时不支持修改，使用 d3 自带配色 |
   | barLabel    | 柱状图上的标签，用来展示单位，如不想使用可以将其设置为 0                    | 万                               |
   | barDer      | 原始数据和柱状图上展示数值的比值                                            | 10000                            |
   | bubbleLabel | 气泡上的数值的单位，如不想使用可以将其设置为空字符串''                      | ''                               |
   | bubbleDer   | 原始数据和气泡图上展示数值的比值                                            | 10000                            |
   | decimals    | 小数保留的位数                                                              | 0                                |
   | duration    | 每次迭代动画持续时间，单位为毫秒                                            | 2000                             |
   | barNum      | 柱子的个数                                                                  | 10                               |
   | ease        | 缓动函数名称                                                                | easeLinear                       |
   | maxRadius   | 最大气泡的半径                                                              | 140                              |
   | descTitle   | 右上模块展示最大值前方的描述                                                | 如：播放量第一：、微博指数第一： |
   | ifShowImg   | 气泡图是否展示照片                                                          | false                            |
   | ifShowName  | 气泡图是否展示名称，最好在展示照片的时候将该值设置为`false`避免出现严重遮挡 | true                             |

3. 图片

   图片时可选配置，如果选择展示图片，需要将采集`data.csv`中的 name 字段对应的照片，具体名称为`[name的值].jpg`。照片要求为`jpg`格式，为了保证显示效果，要求图片为正方形。为了保证图片加载速度及显示效果，不推荐使用分辨率过高或过小的图片，宽高像素为 300 至 400 是一个不错的选择。

## 注意事项

1. 框架还有需要改进的地方，会持续修改；
2. 目前整体的分辨率是固定的 1920\*1080；
3. 使用本框架请注明出处，也算是对作者的一种支持与尊重，制作视频请注明：`框架来源：彩色说`
4. 如果出现汉字乱码，请用电脑自带的文本编辑器将数据文件另存为`utf-8`编码格式

## 更新日志

1. 2019-11-04：修复第一个日期数据因为气泡初始化加载而来不及展示的问题。

## 关于作者

email：274219962#qq.com

qq 群：彩色说粉丝交流群 群号：857560096

官方网站：[彩色说](vis27.com)

微博：[孔令远](https://weibo.com/u/5019153940)

知乎：[孔令远](https://www.zhihu.com/people/andy-57/activities)

b 站：[彩色说官方](https://space.bilibili.com/10194356/#/)

澎湃新闻：[彩色说](https://www.thepaper.cn/user_2772369)

微信公众号：

![img](http://vis27.com/wp-content/uploads/2018/03/qrcode_for_gh_a3ec7046a736_258-1.jpg)
