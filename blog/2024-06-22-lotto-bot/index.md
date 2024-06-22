---
title: Auto Lotto Bot
tags: [bot]
---

import awsLambdaPricing from './aws-lambda-pricing.png';
import mobileLottery from './mobile-lottery.jpg';

회사를 다니기 막 시작할 때 지인들이 로또를 매주 구매하는게 낭비라고 생각했었다.
매우 낮은 확률에 일주일에 5천원씩, 한달에 약 3만원 정도를 소비하는게 꽤 큰 금액이라고 생각했다.

요즘 들어서 아무 일도 일어나지 않는 확률 0 보다는 가능성이라도 있는 0.0001% 확률이 낫다고 생각이 들었다. 일주일에 5천원이라 스타벅스 커피 한잔 더 마셨다 자기합리화를 하고 구매를 하기 시작했다.

![meme](./meme.png)

<!--truncate-->

# 로또 자동 구매 봇 개발하기

처음에는 온라인 [동행복권](https://dhlottery.co.kr/) 에서 주기적으로 구매헀으나 일하기 바빠 매주 구매하는 걸 까먹기도 했다.
그래서 자동 구매를 찾아보니 구매 프로그램이 있으나 공식 프로그램도 아니어서 보안 이슈를 고려, 다양한 툴 사용 경험도 늘릴겸 (조금이라도 개발 내공에 도움이 되지 않을까) 자동 구매 봇을 만들기로 결심했다.

마침 [자동 구매 스크립트 글](https://www.clien.net/service/board/lecture/16835687)을 보았고 간단한 작업 & 짧은 시간만 소모하므로 AWS lambda 를 써보기로 했다.
lightsail instance 하나 구매해서 다양한 스크립트 실행을 할까 했으나 우선 람다는 가격이 거의 무료에 가까워서 람다를 사용하기로 했다. (chromium 이 메모리를 많이 먹고 느려서 비용 걱정이 돼서 다시 계산해봐도 매우 저렴했다.)

<img src={awsLambdaPricing} width="50%"/>

(0.0000000267 _ 1000 _ 20초) \* 4회 = $0.002136 (대략 한달에 $0.002-0.003)

[자동 구매 스크립트 글](https://www.clien.net/service/board/lecture/16835687)을 참고해서 playwright + chromium 으로 구성했다.
lambda 에서 chromium 을 구성하기 위해 찾아보니
[chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda), [playwright-aws-lambda](https://github.com/JupiterOne/playwright-aws-lambda) 가 있었는데
마지막 커밋 내역도 오래되고 버전도 매우 낮았다.
위 repo 에서 이어서 작업하고 있는 [chromium](https://github.com/Sparticuz/chromium) 를 발견했고 50MB 정도 되어서 S3 업로드, lambda layer 로 만들었다.
원글은 python 으로 작성되어 있는데 기존 lambda 봇들을 js 로 짜고 있어 통일할 겸, playwright 문서도 읽는 겸 nodejs 로 작성했다.

로컬에서 간단하게 돌려보고 성공, 이후 lambda 에서 돌려봤지만 모바일 페이지로 이동해서 구매 실패로 이어졌다.
동행복권은 아래 이미지와 같이 모바일 구매를 막는다.

<img src={mobileLottery} width="40%"/>

[Branch](https://www.branch.io/), [Appsflyer](https://www.appsflyer.com/) 에서 제공하는 AppLinks/UniversalLink 들을 클릭했을 때
User-Agent 를 따라 앱을 실행할지/웹페이지를 띄울지 redirect 했던 기억이 있어 User-Agent 를 모바일로 설정했다.
하지만 또 실패.
[playwright 설정에도 isMobile 이라는 옵션](https://playwright.dev/docs/api/class-browser#browser-new-context-option-is-mobile)이 있었지만 기본으로 false 라 문제가 아니었다.

동행 복권 페이지를 들어갈 때 redirect 하는 것 같아, [로또 구매 페이지](https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40)를 curl 로 요청해보니 navigator.platform 을 보고 redirect 하고 있었다.

```js
var filter = "win16|win32|win64|macintel";
if (
  navigator.platform &&
  !(filter.indexOf(navigator.platform.toLowerCase()) >= 0)
) {
  location.href = "https://m.dhlottery.co.kr/";
}
```

navigator 를 필터에 해당하는 기기로 설정하니 정상적으로 페이지 진입이 가능했고 구매도 가능했다.

```js
Object.defineProperty(Object.getPrototypeOf(navigator), "platform", {
  value: "macintel",
});
```

또한, chromium 을 띄우는 과정에서 lambda timeout 이 발생했는데, [문서를 보니](https://github.com/sparticuz/chrome-aws-lambda?tab=readme-ov-file#usage-with-playwright) 메모리를 꽤 차지하는 것처럼 보였다.
`"You should allocate at least 512 MB of RAM to your Lambda, however 1600 MB (or more) is recommended."`

그래서 timeout 을 늘리고 메모리를 1024MB 로 설정하니 20초 가량 걸려서 구매를 완료했다.
2048MB 로 설정해도 한달에 $0.002-$0.003 라서 문제 없다고 생각한다. 계속 lambda 를 이용할 예정이다.

# Reference

- [파이썬으로 동행복권 로또 매주 자동 구매하기](https://www.clien.net/service/board/lecture/16835687)
