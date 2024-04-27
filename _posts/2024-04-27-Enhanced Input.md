---
title: "Enhanced Input"
categories: 언리얼
tag: [c++, Unreal]
author_profile: false
layout: single
typora-root-url: ../
sidebar:
    nav: "counts"
---

## 목표

캐릭터를 WASD로 움직이기



## 유니티 에디터

**1. Input Mapping Context와 Input Action 만들기**

![image-20240427201359091](/images/2024-04-27-Enhanced Input/image-20240427201359091.png)![image-20240427201503215](/images/2024-04-27-Enhanced Input/image-20240427201503215.png)



**2. Input Mapping Context에 Input Action 할당하고 입력값 설정하기**

![image-20240427201415171](/images/2024-04-27-Enhanced Input/image-20240427201415171.png)

이때 상하좌우로 움직여야 하므로 Modifiers를 이용하여
기본, 기본 Negate, Swizzle YXZ, Swizzle YXZ Negate로 2D Vector값을 설정한다.



## C++ 코드

#### 1. build.cs

![image-20240312212458547](/images/2024-04-27-Enhanced Input/image-20240312212458547-1714216536227-1.png)

추가 후 Visual Studio, Unreal Engine 닫고 Saved, intermediate, Binaries 파일 삭제 후 다시 열기

#### .h 파일

![image-20240312213313541](/images/2024-04-27-Enhanced Input/image-20240312213313541-1714216536227-2.png)

UInputMappingContext, UInputAction 저장할 변수 선언
(해당 자료형은 Forward Declaration으로 선언)

#### .cpp 파일

1.헤더파일 추가

![image-20240312214104411](/images/2024-04-27-Enhanced Input/image-20240312214104411-1714216536227-4.png)

#include "Components/InputComponent.h"
#include "EnhancedInputComponent"
#include "EnhancedInputSubsystems.h"



2.InputMappingContext 추가하기

![image-20240312215210649](/images/2024-04-27-Enhanced Input/image-20240312215210649-1714216536227-3.png)



3.InputAction 바인딩하기

![image-20240312215455048](/images/2024-04-27-Enhanced Input/image-20240312215455048-1714216536227-6.png)

바인딩할 콜백 함수는 인자로 FInputActionValue&를 받음
(#include "InputActionValue.h" 필요)



![image-20240312215809751](/images/2024-04-27-Enhanced Input/image-20240312215809751-1714216536227-5.png)









