---
title: "애니메이션"
categories: 언리얼
tag: [c++, Unreal, 애니메이션]
author_profile: false
layout: single
typora-root-url: ../
sidebar:
    nav: "counts"
---



# 목표

![image-20240428143821360](/images/2024-04-28-Animation/image-20240428143821360.png)![image-20240428144207193](/images/2024-04-28-Animation/image-20240428144207193.png)

(왼쪽 - 캐릭터, 오른쪽 - 달리는 애니메이션)



캐릭터와 애니메이션이 있을 때, 해당 애니메이션을 상황에 맞게 캐릭터에 적용시키기

=> 가만히 있을 때에는, 가만히 있는 애니메이션 적용  
=> 달릴 때에는 달리는 애니메이션 적용



# 구현

## 1. C++ AnimInstance 생성

캐릭터가 움직일때는 움직이는 애니메이션, 점프할 때에는 점프하는 애니메이션을 적절하게 적용하여야 한다.  
그러기 위해서는 캐릭터의 움직임 여부, 점프 여부를 알아야 하므로
C++ AnimInstance를 생성해 **GroundSpeed**, **IsFalling** 변수를 생성해 움직임 여부, 점프 여부 값을 관리하도록 구현한다.



### .h 파일

먼저 Anim Instance를 상속받는 C++ 코드를 생성하고
다음과 같이 .h파일을 작성한다.

```c++
UCLASS()
class SLASH_API USlashAnimInstance : public UAnimInstance
{
	GENERATED_BODY()

public:
	virtual void NativeInitializeAnimation() override;
	virtual void NativeUpdateAnimation(float DeltaTime) override;

	UPROPERTY(BlueprintReadOnly)
	class ASlashCharacter* SlashCharacter;

	UPROPERTY(BlueprintReadOnly, Category = Movement)
	class UCharacterMovementComponent* SlashCharacterMovement;

	UPROPERTY(BlueprintReadOnly, Category = Movement)
	float GroundSpeed;

	UPROPERTY(BlueprintReadOnly, Category = Movement)
	bool IsFalling;
	
	UPROPERTY(BlueprintReadOnly, Category = "Movement | Character State")
	ECharacterState CharacterState;

};
```



![image-20240428152850631](/images/2024-04-28-Animation/image-20240428152850631.png)

사용하는 Character Blueprint(변수에 사용하는 값들 참고 사진용)

* NativeInitializeAnimation, NativeUpdateAnimation : UAnimInstance의 Virtual Function으로 각각 Init(), Update() 역활
* SlashCharacter : Anim Instance를 가지고 있는 Character를 저장하는 변수
* SlashCharacterMovement : ACharacter가 기본적으로 가지고 있는 Character Movement Component를 저장하는 변수  
  =>  캐릭터의 이동, 점프 등을 관리하는 컴포넌트임, 해당 컴포넌트로 움직임 여부, 방향, 점프 여부등을 판단



### .cpp 파일

* NativeInitializeAnimation()
  * 게임을 시작할 때 초기화 하는 함수 (UAnimInstance 클래스 Virtual Function Override)
  * 해당 AnimInstance를 가지고 있는 Character 포인터를 SlashCharacter에 저장
  * Character의 CharacterMovementComponent를 SlashCharacterMovement에 저장

``` c++
void USlashAnimInstance::NativeInitializeAnimation()
{
	Super::NativeInitializeAnimation();

	SlashCharacter = Cast<ASlashCharacter>(TryGetPawnOwner());
	if (SlashCharacter) {
		SlashCharacterMovement = SlashCharacter->GetCharacterMovement();
	}
}
```



* NativeUpdateAnimation()
  * 매초 실행되는 Update 함수(UAnimInstance 클래스 Virtual Function Override)
  * 캐릭터의 움직임 여부를 알기 위해 속도를 가지고옴 => CharacterMovement의 Velocity
    * 이 때 2D Vector의 값으로 반환되기 때문에 float값으로 변환이 필요함  
      => KismetMathLibrary::VSizexy 함수 사용  
      => #include "Kismet/KismetMathLibrary.h" 추가
  * 캐릭터의 컴프 유무를 알기 위해 CharacterMovement의 IsFalling 값을 가지고 옴

```c++
void USlashAnimInstance::NativeUpdateAnimation(float DeltaTime)
{
	Super::NativeUpdateAnimation(DeltaTime);

	if (SlashCharacterMovement) {
		GroundSpeed = UKismetMathLibrary::VSizeXY(SlashCharacterMovement->Velocity);
		IsFalling = SlashCharacterMovement->IsFalling();
	}
}
```



## 2. Animation Blueprint 생성

![image-20240428143548797](/images/2024-04-28-Animation/image-20240428143548797.png)![image-20240428144554472](/images/2024-04-28-Animation/image-20240428144554472.png)

1. Animation - Animation Blueprint로 애니메이션 블루프린트 생성 (ABP_Echo)



![image-20240428144633222](/images/2024-04-28-Animation/image-20240428144633222.png)

2. 캐릭터 Blueprint(Bp_SlashCharacter)의 속성 중 Animation 탭에서, Animation Mode를 Use Animation Blueprint로 설정
   그리고 Anim Class는 생성한 Animation Blueprint(ABP_Echo)로 설정



## 3. Animation Blueprint 설정

캐릭터의 움직임과 점프 유무를 변수에 저장하는 C++ AnimInstance를 작성하였고,  
해당 변수값을 이용해 적절한 애니메이션을 실행해야 한다.



### 1. 달리기 애니메이션

1. AnimGraph에서 State Machine을 생성한다.

   ![image-20240428155932595](/images/2024-04-28-Animation/image-20240428155932595.png)

2. 생성한 State Machine에서 다음과 같이 State와 Transition을 생성한다.

   ![image-20240428160119095](/images/2024-04-28-Animation/image-20240428160119095.png)

3. Idle, Run State에 알맞은 애니메이션을 연결해준다.

   ![image-20240428160328083](/images/2024-04-28-Animation/image-20240428160328083.png)

4. Transition에서는 C++에서 작성한 변수인 GroundSpeed와 IsFalling 값으로 Transition 조건을 설정해준다.

   ![image-20240428160502885](/images/2024-04-28-Animation/image-20240428160502885.png)





### 2. 점프 애니메이션

1. 점프 애니메이션도 위와 마찬가지로 State Machine을 생성한 후 State들을 생성한다.  
   ![image-20240428160722282](/images/2024-04-28-Animation/image-20240428160722282.png)

점프하기 전에는 가만히 있거나, 달리는 애니메이션을 사용해야 하므로 1에서 만든 State Machine을 사용하면 된다.

2. 달리기 State Machine을 점프 State Machine에서 사용하기 위해 Cached Pose에 저장하고, 
   OnGround State에 사용한다.

   ![image-20240428161110643](/images/2024-04-28-Animation/image-20240428161110643.png)![image-20240428161122825](/images/2024-04-28-Animation/image-20240428161122825.png)

3. 나머지들은 달리기와 동일함



