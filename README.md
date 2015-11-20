
# 大智慧云平台技术服务规范 #

## 服务API接口规范 ##

** 命名 **

每个服务接口都通过统一资源定位符（URL）方式提供。路径表达意思清晰，层次分明，(如/quote/dyna)。

** 参数 **

系统保留参数定义。

不同服务作用类似的参数尽量统一。[详情连接](http://dms.gw.com.cn/pages/viewpage.action?pageId=128057536)

** 文档 **

每个服务的文档需要有功能说明，请求说明，结果说明，举例说明。[参见](http://dms.gw.com.cn/pages/viewpage.action?pageId=128057527)

公共服务文档必须push到[git库](http://git.gw.com.cn:7990/projects/DZHYUN/repos/doc.api/browse)

[错误信息规范](http://dms.gw.com.cn/pages/viewpage.action?pageId=135955803)


## 配合测试运维规范 ##

** 提交 ims 规范 **


开发的相关设计文档

功能说明

影响其他功能关系

部署依赖关系

注意事项

[示例](http://ims.gw.com.cn/browse/DZHYUN-428)


** 服务监控 **

服务出现异常情况能够准确向监控平台报警，并能清楚的提供信息。
出现错误级别应及时处理。
警告级别信息根据情况安排处理计划。
[监控平台](http://10.15.107.95/yunconsole/index.html)

## [云平台设计开发规范](http://dms.gw.com.cn/pages/viewpage.action?pageId=125895110) ##
