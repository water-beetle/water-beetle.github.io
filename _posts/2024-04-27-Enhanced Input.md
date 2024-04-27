---
title: "Enhanced Input"
categories: 언리얼 정리
tag: [c++, Unreal]
author_profile: false
layout: single
sidebar:
    nav: "counts"
---

# Enhanced Input



### 목표

캐릭터를 WASD로 움직이기



##  유니티 에디터

#### 1. Input Mapping Context와 Input Action 만들기

![image-20240427195744732](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240427195744732.png)![image-20240427195758024](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240427195758024.png)



#### 2. Input Mapping Context에 Input Action 할당하고 입력값 설정하기

![image-20240427195932660](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240427195932660.png)

이때 상하좌우로 움직여야 하므로 Modifiers를 이용하여
기본, 기본 Negate, Swizzle YXZ, Swizzle YXZ Negate로 2D Vector값을 설정한다.

## C++ 코드

#### 1. Build.cs에 모듈 추가

![image-20240312212458547](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240312212458547.png)

추가 후 Visual Studio, Unreal Engine 닫고 Saved, intermediate, Binaries 파일 삭제 후 다시 열기

#### 2. .h 파일 코드

![image-20240312213313541](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240312213313541.png)

UInputMappingContext, UInputAction 저장할 변수 선언
(해당 자료형은 Forward Declaration으로 선언)

#### 3. cpp파일 코드

1. 헤더파일 추가

![image-20240312214104411](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240312214104411.png)

#include "Components/InputComponent.h"
#include "EnhancedInputComponent"
#include "EnhancedInputSubsystems.h"



2. InputMappingContext 추가하기

![image-20240312215210649](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240312215210649.png)



3. InputAction 바인딩하기

   ![image-20240312215455048](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240312215455048.png)

바인딩할 콜백 함수는 인자로 FInputActionValue&를 받음
(#include "InputActionValue.h" 필요)

![image-20240312215809751](C:\Users\kdh99\Desktop\Blog\water-beetle.github.io\images\2024-04-27-Enhanced Input\image-20240312215809751.png)











