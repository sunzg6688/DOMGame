
AStar 是A*寻路算法实现 <br>
寻路过程分别用 普通优化的方法，二叉堆优化的方法，和二分查找优化的方法实现。<br>
项目里包含了 3种不同优化方法的效率对比，和动态显示寻路过程。<br>
AStartDemo.html是一个demo页面，AStarAnimate.html是一个动态展示寻路过程的页面，AStarTest.html是一个展示3中不同方式寻路消耗的时间对比页面。<br>
测试地址：<br>
https://sunzg6688.github.io/DOMGame/AStar/AStarAnimate.html;每次都会随机生成地图打点数据<br>
https://sunzg6688.github.io/DOMGame/AStar/AStarDemo.html;<br>
https://sunzg6688.github.io/DOMGame/AStar/AStarTest.html;每次都会随机生成地图打点数据<br>


点击单元格可以重置当前格子的数据类型。<br>
点击获取mapData按钮，可以显示当前网格数据。<br>
消耗时间对比.jpg是根据2000*2000大小的测试数据，消耗的时间对比图。<br>
三个页面源码中都可以设置生成的网格的数量多少，也可以注释掉createTestData()这个方法是设置随机生成数据还是读取mapData2.js里面的数据。<br>
