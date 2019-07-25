# bubbleSystem

## 项目介绍
`bubbleSystem` 是一个结合气泡图、柱状图等元素为一体的可视化框架，可用于变化时序数据的可视化展示。该框架由彩色说工作室开发完成使用原生JavaScript+d3.js开发，并有多种参数可以配置，可以很方便地根据数据进行调整。

* [English version](./README.md)

## 软件架构
开发制作


## 参考

1. [修改圆的半径大小](https://bl.ocks.org/plmrry/b9db6d47dabaff6e59f565d9287c4064)
2. [修改很多圆的半径大小](https://jsfiddle.net/zc0fgh6y/16/)
3. [字符自适应](https://bl.ocks.org/mbostock/1846692)
4. [Add and remove nodes](http://bl.ocks.org/tgk/6068367)

## 参数说明
| name | desc | example |
| ------ | ------ | ------ |
| colors | 系统配色 | 默认为null，使用d3自带配色 |
| barLabel | bar图的标签 | 万 |
| denominator | 分母 | 1000 |
| decimals | 小数的位数 | 0 |
| duration | 持续时间 | 2000 |
| barNum | bar的数量 | 10 |
| ease | 缓动函数 | easeLinear |

## 注意事项
1. 不仅仅是添加节点的时候会引起抖动，移除节点的时候也会引起抖动，现在就是要修改这一点。