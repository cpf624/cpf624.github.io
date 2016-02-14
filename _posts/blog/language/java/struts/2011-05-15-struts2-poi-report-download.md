---
title: Struts2+POI报表下载
category: 编程开发
tags: [Java, J2EE, Struts2, POI]
---

#### 1. Action类

```java
import java.io.InputStream;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

/**
　* public class BaseAction extends ActionSupport
　*　implements ServletRequestAware,ServletResponseAware{}
　*/
public class ExportAction extends BaseAction {

    private static final longserialVersionUID= 8288703553558391122L;

    private InputStream inputStream;
    private String fileName; //设置下载文件名

    @Override
    public String execute() {
        Workbook workBook = new HSSFWorkbook();
        Sheet sheet = workBook.createSheet("示例报表");
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            workBook.write(outputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
        fileName = "FILE.xls";
        inputStream = new ByteArrayInputStream(outputStream.toByteArray());
        return SUCCESS;
    }

    public String getFileName(){
        return fileName;
    }

    public InputStream getInputStream(){
        return inputStream;
    }

    public void setInputStream(InputStream inputStream){
        this.inputStream=inputStream;
    }
}
```

#### 2. struts.xml配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE struts PUBLIC "-//Apache Software Foundation//DTD Struts Configuration 2.1//EN"
    "http://struts.apache.org/dtds/struts-2.1.dtd">
<struts>
    <package name="report" extends="struts-default" namespace="/report">
        <action name="test" class="org.jhat.ExportAction">
            <result type="stream">
                <param name="contentType">application/vnd.ms-excel</param>
                <param name="inputName">inputStream</param>
                <param name="contentDisposition">attachment;filename="${fileName}"</param>
                <param name="bufferSize">1024</param>
            </result>
        </action>
    </package>
</struts>
```
