---
layout:     post
title:      How To Open An App By URL
date:       2021-06-25 12:00:00
author:     yongseongkim
categories: iOS
tags:       [universallink]
---

![Question About Deeplink]({{site.url}}/images/20210627-how-to-open-app-by-url/question_about_deeplink.jpg){: width="100%" }
최근에 서비스에서 중요한 기능을 개발하면서 해당 화면으로 사람들을 유도할 수 있는 링크에 대한 질문을 많이 받았습니다.
이와 관련된 답변을 준비하다 보니 url 을 통해 어떻게 설치되어 있으면 앱을 열고 설치되어 있지 않은 앱들은 앱스토어로 보내는 지에 대한 이해가 부족하다고 느꼈습니다.
관련된 3rd party 서비스 [Branch](https://branch.io/) 가 어떤 기능들을 제공해주는지에 대한 이해도 필요했습니다.
관련된 기능을 개발해본 적 없는 모바일 개발자 혹은 모바일 플랫폼에 대한 이해도가 부족한 서버 개발자분들의 이해를 돕고자 간단하게 정리했습니다. 설명은 iOS 중심으로 정리되어 있습니다.
<br><br>

# Deeplink

"탑승내역을 보여주는 화면으로 보내는 딥링크가 뭐에요?" 와 같이 공지사항 혹은 여러 마케팅 이벤트를 통해 사용자를 특정 화면으로 유도하려는 노력을 많이 합니다.
이와 같이 딥링크란 사용자를 도메인 내의 어떤 곳으로 안내하는 링크를 말합니다.

- [https://nytimes.com](https://nytimes.com/) 는 최상위 도메인으로 도메인 내 더 깊은 곳으로 안내하지 않기 때문에 딥링크가 아닙니다. 
- [https://www.hbe.io/about](https://www.hbe.io/about) 는 도메인 내 상세정보에 해당하는 about 페이지, 특정 화면으로 향하는 딥링크입니다.

## Scheme, Path, Parameter

URL(Uniform Resource Locator) 은 `scheme://host:port/path?query` 의 형태로 리소스에 대한 위치를 나타냅니다.
모바일 플랫폼에서 각 서비스는 자신들의 앱을 띄울 수 있는 scheme 을 정의할 수 있습니다. 페이스북은 `fb://` 를 scheme 으로 쓰고 있어 사파리에서 `fb://` 와 같이 입력하면 시스템은 입력한 scheme 해당하는 앱(페이스북)을 엽니다.

모바일 개발자들은 custom scheme 으로 정의된 URL 을 통해 사용자를 어떤 화면으로 보내고 어떤 행동을 유도할 지 설계합니다.
예를 들어 메신저로 쿠폰을 선물하여 링크를 눌렀을 때 쿠폰화면을 보여주면서 선물 받은 쿠폰 코드를 자동으로 입력하는 기획이 나왔습니다.
`custom-app-scheme://coupons?code=오픈기념이벤트` 로 path 는 쿠폰 화면 이동을, query 로는 쿠폰 코드를 전달하여 사용자 경험을 개선할 수 있습니다.

{% gist 7acbeacc76b190a8445768bdcb58787a URLHandler.swift %}

이렇게 개발자들이 정의해놓은 URL 에 대해서만 사용자를 원하는 화면으로 도달하게 할 수 있습니다.
정의되어 있지 않은 경우에는 개발자가 URL 에 대한 처리를 추가하여 앱을 업데이트해야 합니다.
<br>
`custom-app-scheme://web?url=www.example.com/features` 와 같이 웹페이지 띄우는 처리를 정의해놓으면 다양한 이벤트를 유연하게 대응할 수 있습니다.

어떤 앱이 어떤 scheme 을 쓰고 어떤 화면을 띄우는지 파악할 수 있으면 앱을 자유롭게 띄워 정보를 전달하여 사용성을 높일 수 있습니다.
예를 들어 내 위치를 친구에게 공유하고 싶을 때 line://message="" 딥링크를 사용하여 친구에게 바로 메세지를 전달할 수 있게 하면 사용자에게 좀 더 부드러운 경험을 제공할 수 있습니다.

iOS 에서는 `UIApplication.shared.canOpenURL` 이라는 API 를 이용하여 앱의 설치 유무도 파악할 수 있었습니다. 이 기능을 활용하면 내 앱을 사용하는 사람이 어떤 앱을 설치했는지도 파악할 수 있었습니다.
하지만 iOS 9 부터 개인정보보호를 위해 이런 API 의 사용을 제한합니다. 다른 앱을 띄우려면, 혹은 위와 같이 `canOpenURL` API 를 이용하려면 whitelist 에 등록해야 합니다.
whitelist 에 등록하지 않은 앱을 띄우려 시도하면 "This app is now allowed to query for scheme xxx" 로그가 찍히며 시스템 API 가 동작하지 않습니다.

또한 정의한 scheme 으로 앱을 여는 과정은 중복을 따로 막지 않았기 때문에 모방하는 앱에 대한 대응도 어려웠습니다.
예를 들어 Reddit 을 모방하는 Redd1t 이 `reddit://` scheme 을 쓰게 되면 어떤 앱이 뜰지 보장할 수 없는 상태였습니다.
<br><br>

# Universal Link

iOS 9 에서는 URL 로 위 문제들과 사용성을 개선하기 위한 Universal Link 가 추가되었습니다.
Universal Link 는 URL 진입 시 URL 에 맞는 앱이 설치되어 있으면 앱을 띄우고 설치되어 있지 않다면 브라우저를 띄우는 기능입니다.
예를 들면 링크 https://www.facebook.com/watch 클릭 시 페이스북이 설치되어 있으면 페이스북 앱에서 watch 탭으로 이동하고 아니면 페이스북 watch 페이지를 브라우저에서 띄웁니다.
앱이 없으면 그에 대응하는 웹페이지를 볼 수 있으니 앱이 없을 때 아무 동작하지 않는 scheme 처리보다 사용자에게 더 좋은 경험을 줄 수 있다.

## Behind the scenes

![How to get AASA files from server]({{site.url}}/images/20210627-how-to-open-app-by-url/how-to-get-aasa-from-server.png){: width="50%" }
<br>
<small>출처: [WWDC 2020 What's new in Universal Link](https://developer.apple.com/videos/play/wwdc2020/10098/)</small>
<br>

Universal Link 를 활성화 시키기 위해서는 앱에 어떤 도메인을 쓸 것인지 명시해야 합니다.
또한, 앱에 등록한 도메인의 웹서버에서 apple-app-site-association(AASA) 이라는 이름의 JSON 파일을 제공해야 합니다.
시스템은 앱을 다운 받아 설치할 때, 등록된 도메인의 AASA 파일을 파싱하여 Universal Link 를 활성화 시킵니다.

예를 들어 페이스북 앱 Associated Domains 에 facebook.com 을 도메인으로 명시하면, `facebook.com/apple-app-site-association` 과 같이 AASA 파일을 서버에서 제공해야 합니다.

사용자가 앱스토어에서 앱을 다운받아 설치하면 시스템에서 등록된 도메인의 AASA 파일을 다운, 파싱하여 Universal Link 를 활성화 시킵니다.
시스템은 AASA 의 업데이트 된 내용을 반영하기 위해 주기적으로 AASA 파일을 다운로드 합니다.

![How to get AASA files from Apple CDN]({{site.url}}/images/20210627-how-to-open-app-by-url/how-to-get-aasa-from-apple-cdn.png){: width="50%" }
<br>
<small>출처: [WWDC 2020 What's new in Universal Link](https://developer.apple.com/videos/play/wwdc2020/10098/)</small>
<br>

애플은 여러 앱의 AASA 파일을 동시에 다운로드 할 수 있게 캐시 서버 CDN 을 제공합니다.
여러 앱들의 웹서버에 접근하는 방식이 아닌 하나의 HTTP2 연결을 통해 처리합니다.
iOS 14 와 BigSur 부터 Apple CDN 으로부터만 AASA 파일 요청을 받습니다.

## AASA (Apple App Site Association)

AASA 파일에는 어떤 것들이 명시되어 있는지 간단하게 소개합니다.

{% gist 7acbeacc76b190a8445768bdcb58787a aasa_example.json %}

"applinks", "apps" 는 템플릿의 형태로 Universal Link 선언이라고 보면 됩니다.

"details" 부분이 어떤 앱을 처리할지, 어떤 경로를 처리할지 명시하는 부분으로 여기서 appID 는 teamID 와 bundleID 의 조합입니다.
예를 들어 [타다](https://tadatada.com/)는 bundleID = kr.co.vcnc.tada 이기 때문에 A1B2C3F4D5.kr.co.vcnc.tada 와 같이 appID 를 정의할 수 있습니다.
도메인은 고유하고 어떤 앱이 뜰지 명시되어 있기 때문에 모방하는 서비스가 뜰 일은 없게 됩니다.
([스카이스캐너 AASA](https://www.skyscanner.co.kr/apple-app-site-association ) 를 보면 bundleID `net.skyscanner.iphone-china` 를 보아 중국 쪽 아이폰 앱을 따로 제공하는 걸 볼 수 있습니다.)

"components" 리스트를 처리하는 부분을 하나씩 보면, "/\*/order/" 는 2번째 order 들어오는 모든 path 를 처리합니다.
예를 들면 https://example.com/taco/order/, https://example.com/salad/order/ 는 앱이 설치되어 있으면 앱을 띄웁니다.
<br>
"/taco/\*" 에서는 query 처리에 대한 명시로 https://example.com/taco/?cheese=panel 는 universal link 처리됩니다.
<br>
3, 4번째는 "exclucde" 를 이용하여 1 로 시작하는 쿠폰 번호는 처리하지 않겠다고 명시할 수 있습니다.
예를 들어 https://example.com#coupon-1234 와 달리 https://example.com#coupon-5678 는 universal link 처리됩니다.
<br><br>

# Understanding 3rd party services

Universal Link 를 지원하려면 AASA 파일을 제공할 수 있는 정적 HTTPS 지원 웹서버가 필요합니다.
어렵지 않지만 [Branch](https://branch.io/) 나 [Appsflyer](https://www.appsflyer.com/) 를 이용하면 간단하게 이용할 수 있습니다.
또한 링크를 통한 사용자의 흐름을 추적하거나 다양한 기능을 제공해줘서 [타다](https://tadatada.com/) 에서는 Branch 를 쓰고 있습니다.
Branch [Quick Links](https://branch.io/quick-links/) 를 이용하여 다양한 링크를 만들고 사용자의 행동을 유도합니다.
여기서는 Branch 에서 많이 쓰는 링크 설정이 어떻게 동작하는지 간단하게 소개하려 합니다.

## Branch Quick Links

![Branch Quick Links List]({{site.url}}/images/20210627-how-to-open-app-by-url/branch_quick_links_list.png){: width="100%" }
<br>

Branch 에서 다양한 목적으로 링크를 만들어서 관리합니다. 다양한 링크를 만들어 어디서 클릭했는지, 어떤 마케팅 캠페인을 통해서 사람들이 유입했는지 관리할 수 있습니다.
Universal Link 가 활성화 되어 있으면, 링크 클릭 시 웹페이지가 아닌 바로 앱이 뜨는데 앱개발자는 어떤 URL 로 앱이 떴는지 와 같은 여러 이벤트를 Branch SDK 에게 알려줍니다.
이러한 정보로 Branch 내부에서 클릭, 설치를 트래킹합니다.

![Branch Quick Links Redirects]({{site.url}}/images/20210627-how-to-open-app-by-url/branch_quick_links_redirects.png){: width="100%" }
<br>

링크 설정에서는 사용자가 앱이 설치되어 있지 않았을 때 어디로 보낼지 정할 수 있습니다. 보통 모바일 플랫폼에서는 해당 스토어로 보내고 PC 에서 링크를 접속했을 때는 대표 홈페이지로 이동합니다.

위 이미지에서 `Web-Only Link` 옵션을 키면 앱이 설치되어 있어도 앱이 뜨지 않는 페이지 이동이 됩니다.
AASA 파일에 exclude 옵션을 이용하여 `/e/*` 를 제외시키도록 등록해놓고 https://tadatada.test-app.link/e/6us6DGSmg3 처럼 바꿔 Universal Link 가 동작하지 않게 합니다.

![Branch Quick Links Link Data]({{site.url}}/images/20210627-how-to-open-app-by-url/branch_quick_links_link_data.png){: width="100%" }
<br>

Link Data 설정에서는 `$deeplink_path` 를 이용하여 사용자를 어디로 보낼지 명시할 수 있습니다.

여기서는 `tada-rider://coupons` 를 이용하여 사용자가 쿠폰함을 바로 볼 수 있게 설정하였습니다.

## How to work (Branch)

위에서 https://tadatada.test-app.link/6us6DGSmg3 링크를 만들어 앱이 설치되어 있는 경우에는 쿠폰함으로, 앱이 설치되어 있지 않은 경우에는 앱스토어로 이동하게 설정하였습니다.

앱 개발자는 앱이 어떤 URL 을 통해서 열렸는지 처리할 수 있습니다.
Branch SDK 에게 앱 관련된 이벤트를 알려주면 해당 URL 에 맞는 정보들을 내려주고 앱 개발자는 그 정보에 맞춰 사용자를 원하는 화면으로 이동시킵니다.
예를 들어 Branch SDK 는 https://tadatada.test-app.link/6us6DGSmg3 에 대한 정보로 `deeplink_path = tada-rider://coupons` 를 내려주고 개발자는 해당 값을 통해 사용자를 쿠폰함으로 보냅니다.

앱이 설치되어 있지 않은 경우 해당 링크는 접속한 기기에 따라 다르게 동작합니다.
https://tadatada.test-app.link/6us6DGSmg3 를 아이폰에서 접속하면 페이지가 뜨면서 아래와 같은 자바스크립트가 동작합니다.

{% gist 7acbeacc76b190a8445768bdcb58787a redirect.js %}

자바스크립트는 URL 이 유효한지 파악하고 잠시 후 https://tadatada-alternate.test-app.link/6us6DGSmg3?__branch_flo... 로 이동시킵니다.
Redirect 된 URL 에서 파라미터들은 사용자가 어떤 경로로 유입됐는지 파악하기 위한 값으로 추정됩니다. Redirect 된 URL 은 사용자를 다시 앱스토어로 이동시킵니다.
{% gist 7acbeacc76b190a8445768bdcb58787a curl_example_ios.sh %}

https://tadatada.test-app.link/6us6DGSmg3 를 PC 에서 접속하면 설정해놓은 대표 홈페이지로 바로 이동시킵니다.

{% gist 7acbeacc76b190a8445768bdcb58787a curl_example_pc.sh %}
<br>
<br>

# Conclusion

Universal Link 는 URL 클릭 시 바로 앱으로 진입하거나, 앱이 설치되어 있지 않은 경우 웹페이지를 띄워 사용자에게 더 좋은 경험을 제공합니다.
안드로이드에서도 Universal Link 와 같은 개념으로 [App Links](https://developer.android.com/training/app-links) 가 있습니다.
동작 방식은 거의 동일하며 AASA 파일과 동치되는 JSON 파일을 웹서버에서 제공하면 됩니다. (https://www.facebook.com/.well-known/assetlinks.json, 페이스북 App Links 파일)
<br>
Branch 는 Universal Link 와 관련된 다양한 기능을 제공해주는데 Redirects 기능을 User-Agent 로 판단하고 있습니다.
그래서 WebView 의 custom user agent 를 일반 포맷과 다른 형태로 설정하고 웹페이지에서 Branch 링크를 사용하면 원하는 방향으로 동작 안할 수 있습니다.

<br><br>

# Reference

- [How to Setup Universal links to depp link on apple iOS](https://blog.branch.io/how-to-setup-universal-links-to-deep-link-on-apple-ios/)
- [What is an AASA(apple app site association file)](https://blog.branch.io/what-is-an-aasa-apple-app-site-association-file/)
- [Deep linking basics](https://www.appsflyer.com/resources/everything-marketer-needs-to-know-deep-linking/deep-linking-basics/)
- [Universal links in iOS](https://abhimuralidharan.medium.com/universal-links-in-ios-79c4ee038272)
- [WWDC 2019 What's new in Universal Links](https://developer.apple.com/videos/play/wwdc2019/717/)
- [WWDC 2020 What's new in Universal Links](https://developer.apple.com/videos/play/wwdc2020/10098/)

<br><br><br>
