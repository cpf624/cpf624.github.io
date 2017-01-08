---
title: Maven本地第三方库依赖
category: 编程工具
tags: [Java, Maven]
---

在使用Maven作为项目构建工具的过程中，有时还是会不可避免的遇到依赖的第三方库在Maven中央库中没有，只能使用本地依赖，虽然这样的情况极少发生，但当真的遇到时，应该如何优雅的解决呢？

如果是简单粗暴的引入一个本地依赖的话，一般像下面这样配置就好了：

```xml
<project>
    ...
    <dependencies>
        ...
        <dependency>
            <groupId>org.jhat</groupId>
            <artifactId>third-party</artifactId>
            <version>1.0</version>
            <scope>system</scope>
            <systemPath>${project.basedir}/libs/third-party.jar</systemPath>
        </dependency>
        ...
    </dependencies>
    ...
</project>
```

这种方式使用起来最简单，但是并不建议这么做，因为Maven在打包的过程中会忽略system类型依赖，也就是说system类型的依赖信息不会写入MANIFEST.MF文件中，自然也不会将其拷贝到jar/war包的libs目录下，打成一个单独的jar包时也不会包含system类型依赖的任何内容。如果要解决上述问题，不同的Maven插件都需要单独配置对system类型依赖的处理，也就是说在不同的使用场景下，都需要用对应的Maven插件针对system类型依赖进行处理。


为了更优雅的解决本地依赖，应该是将其存入本地Maven仓库，再将其当做普通的第三方依赖使用。
一种方法是执行如下命令，先手动将其存入本地Maven仓库，然后再使用。

```bash
mvn org.apache.maven.plugins:maven-install-plugin:2.5.2:install-file  -Dfile=path-to-your-artifact-jar \
                                                                      -DgroupId=your.groupId \
                                                                      -DartifactId=your-artifactId \
                                                                      -Dversion=version \
                                                                      -Dpackaging=jar \
                                                                      -DlocalRepositoryPath=path-to-specific-local-repo
```

这样有一点不好的是可能会忘记，或者存入错误的路径，尤其是团队协作的时候。更好的解决方法是将其配置在pom.xml里面，使用maven-install-plugin自动处理：

```xml
<project>
    ...
    <properties>
        ...
        <third-party.version>1.0</third-party.version>
        ...
    </properties>
    ...
    <dependencies>
        ...
        <dependency>
            <groupId>org.jhat</groupId>
            <artifactId>third-party</artifactId>
            <version>${third-party.version}</version>
        </dependency>
        ...
    </dependencies>
    ...
    <build>
        ...
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-install-plugin</artifactId>
                <executions>
                    <execution>
                        <id>install-third-party</id>
                        <phase>validate</phase>
                        <goals>
                            <goal>install-file</goal>
                        </goals>
                        <configuration>
                            <!-- 此处的groupId, artifactId, version 需要和dependencies里面配置的完全一致 -->
                            <groupId>org.jhat</groupId>
                            <artifactId>third-party</artifactId>
                            <version>${third-party.version}</version>
                            <packaging>jar</packaging>
                            <file>${project.basedir}/libs/third-party.jar</file>
                        </configuration>
                    </execution>
                    ...
                </executions>
            </plugin>
            ...
        </plugins>
        ...
    </build>
    ...
</project>
```

需要注意的是maven-install-plugin应该在所有其它插件之前。
