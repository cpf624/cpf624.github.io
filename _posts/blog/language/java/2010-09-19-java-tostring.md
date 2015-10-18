---
title: Java ——toString
category: 编程开发
tags: [Java]
---

假如说我们需要将一个类的所有成员变量按一定的格式输出，该怎么办呢？是一个一个的getXXX();吗？不错，用这样的方式的确可以得到我们想要的结果，但要是当这个类的成员变量足够多的时候，这样的方法是不是显得特别繁琐了呢？其实Java给我们提供了一个很好的机制来实现这个需求，即重构toString方法。

由于我们在使用System.out.println();进行标准输出时，它会将需要输出的对象转换成字符串，恰好toString也有此功能，所以我们只需在类中新加一个toString方法，需要输出时，只需将这个类的对象作为输出对象即可，不必再去用繁琐的getXXX();了。当然，从另一方面来说，getXX()；更加灵活，有些时候我们只需要输出一部分内容，这个时候getXXX()就是不错的选择了。


代码示例：

```java
class Student {

    private String name;
    private boolean sex;
    private int age;

    Student(String name, boolean sex, int age) {
        this.name = name;
        this.sex = sex;
        this.age = age;
    }

    public String toString() {
        System.out.println(name + "\t" + sex + "\t" + "age");
    }

    public static void main(String[] args) {
        Student stu = new Student("Name", true, 22);
        System.out.println(stu);
    }

}
```

输出结果：

```
Name　　　　true　　　　22
```
