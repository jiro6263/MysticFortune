# Mystic Fortune 개발 로그

## 프로젝트 개요
- **앱 이름**: Mystic Fortune (오늘의 운세)
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS
- **배포**: Cloudflare Pages
- **목표**: PWA 웹앱 + Google Play Store 등록

---

## 1. 다국어(i18n) 오류 수정

### 문제
```
useLanguage must be used within a LanguageProvider
```
React Context가 Provider 외부에서 사용될 때 발생하는 에러.

### 해결
`LanguageContext.tsx`에서 createContext에 기본값 제공:
```typescript
const defaultValue: LanguageContextType = {
  locale: defaultLocale,
  setLocale: () => {},
  t: getTranslation(defaultLocale),
};
const LanguageContext = createContext<LanguageContextType>(defaultValue);
```

---

## 2. 번역 콘텐츠 문제

### 문제
- 영어 버전 결과 페이지에 한글('힘듦')이 포함됨
- 한글 버전 결과 페이지 설명, 조언, 주의, 해시태그가 전부 영어로 표시됨

### 해결
`templates.ts` 파일을 재구조화하여 locale별로 콘텐츠 분리:
```typescript
export const categoryDescriptions: Record<Locale, Record<FortuneCategory, Record<ScoreRange, string>>>
```

`fortune.ts`에 locale 파라미터 추가:
```typescript
export async function generateFortune(input: FortuneInput, locale: Locale = 'en'): Promise<FortuneResult>
```

---

## 3. Cloudflare Pages 배포

### 초기 설정
`next.config.js` 수정:
```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
}
```

### 실패 1: Worker로 잘못 생성
- **문제**: Cloudflare에서 Worker로 생성하여 빌드 설정 옵션이 없었음
- **해결**: Worker 삭제 후 Pages로 다시 생성

### 배포 설정
- Framework preset: None
- Build command: `npm run build`
- Build output directory: `out`

### Git 연동
```bash
git init
git remote add origin https://github.com/jiro6263/MysticFortune.git
git push -u origin main
```

---

## 4. Google AdSense 연동

### 스크립트 추가
`layout.tsx`의 `<head>`에 AdSense 스크립트 추가:
```tsx
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8269395390841538"
  crossOrigin="anonymous"
/>
```

### AdBanner 컴포넌트 생성
- Publisher ID: `ca-pub-8269395390841538`
- 수평형 광고 슬롯: `4970447883` (728x90)
- 사각형 광고 슬롯: `2368335270` (450x450)

### 실패: 사이트 확인 불가
- **문제**: AdSense 크롤러가 스크립트를 인식하지 못함
- **원인**: Next.js Script 컴포넌트 사용
- **해결**: 일반 `<script>` 태그로 변경

### ads.txt 추가
```
google.com, pub-8269395390841538, DIRECT, f08c47fec0942fa0
```

---

## 5. 생년월일 입력 UI 변경

### 요구사항
- 숫자 입력 → 드롭다운 선택으로 변경
- 한국어: 년/월/일 순서
- 영어: 일/월/년 순서

### 구현
`input/page.tsx`에서 locale에 따라 다른 순서로 렌더링:
```tsx
{locale === 'ko' ? (
  // Year / Month / Day
) : (
  // Day / Month / Year
)}
```

---

## 6. 이미지 공유 기능

### 요구사항
- 공유 버튼 클릭 시 예쁜 카드 이미지 생성
- 이미지 + 링크를 카카오톡 등에 공유

### 라이브러리 설치
```bash
npm install html2canvas
```

### 실패 1: 빌드 에러
- **문제**: Cloudflare 빌드 실패
- **원인**: `package.json`에 html2canvas가 추가되지 않음
- **해결**: 수동으로 dependencies에 추가
```json
"html2canvas": "^1.4.1"
```

### 실패 2: package-lock.json 동기화 안됨
- **문제**: `npm ci` 에러 - lock file과 package.json 불일치
- **원인**: npm install 명령이 제대로 실행되지 않음
- **해결**: 사용자가 직접 터미널에서 `npm install` 실행

### 실패 3: 이미지 캡처 안됨
- **문제**: 공유 시 텍스트만 공유되고 이미지 없음
- **원인**: 숨겨진 카드(`fixed -left-[9999px]`)가 html2canvas로 캡처 안됨
- **해결**: 캡처 시 카드를 화면에 잠깐 표시 후 캡처
```tsx
const [showShareCard, setShowShareCard] = useState(false);
// 공유 시
setShowShareCard(true);
await new Promise((resolve) => setTimeout(resolve, 100));
// 캡처 후
setShowShareCard(false);
```

### 실패 4: 텍스트 위치가 밀림
- **문제**: 캡처된 이미지에서 텍스트가 아래로 밀려있음
- **시도 1**: `lineHeight`, `verticalAlign` 조정 → 실패
- **시도 2**: 패딩 수동 조정 (위 패딩 줄이고 아래 늘림) → 실패
- **시도 3**: 시스템 폰트 사용 → 일부 개선
- **원인**: html2canvas가 웹폰트(Inter)를 제대로 렌더링하지 못함
- **최종 해결**: Tailwind 클래스 대신 inline style 사용 + 시스템 폰트
```tsx
style={{
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
}}
```

**참고**: 태그 뱃지의 텍스트 정렬 문제는 완전히 해결되지 않음. html2canvas의 한계로 판단.

---

## 7. PWA 설정

### manifest.json 생성
```json
{
  "id": "mystic-fortune-pwa",
  "name": "Mystic Fortune",
  "short_name": "Mystic Fortune",
  "display": "standalone",
  "background_color": "#0f0f1a",
  "theme_color": "#6366f1",
  "orientation": "portrait",
  "icons": [...],
  "screenshots": [...]
}
```

### Service Worker 생성 (`sw.js`)
- 정적 자산 캐싱
- Stale-while-revalidate 전략
- 오프라인 지원

### layout.tsx 수정
- manifest 링크 추가
- PWA 메타태그 추가
- Service Worker 등록 스크립트 추가

### 실패: 번역 팝업
- **문제**: 앱 실행 시 크롬 번역 팝업이 계속 표시됨
- **해결**:
```tsx
<html lang="en" className="notranslate" translate="no">
// + metadata에 추가
other: {
  'google': 'notranslate',
},
```

---

## 8. Play Store 등록 준비 (PWABuilder)

### 초기 테스트
PWABuilder (https://pwabuilder.com)에서 URL 입력 후 검사

### 실패 1: PNG 아이콘 필요
- **문제**: "Your PWA must have a square, 192x192 or larger PNG icon"
- **원인**: SVG 아이콘만 있었음
- **해결**: SVG를 PNG로 변환하여 추가
  - `icon-192x192.png`
  - `icon-512x512.png`

### 실패 2: 스크린샷 크기 불일치
- **문제**: manifest에 1080x1920으로 선언했으나 실제 크기가 1080x2420
- **해결**: 스크린샷을 1080x1920으로 크롭

### 권장 사항 추가
1. **id 필드**: 앱 고유 식별자 추가
2. **screenshots**: 앱 스크린샷 3장 추가
3. **Service Worker 개선**: 적절한 캐싱 로직 추가

### 최종 manifest.json 구조
```json
{
  "id": "mystic-fortune-pwa",
  "name": "Mystic Fortune",
  "short_name": "Mystic Fortune",
  "description": "Discover your daily fortune with cosmic insights",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f1a",
  "theme_color": "#6366f1",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ],
  "screenshots": [
    { "src": "/screenshots/screenshot-1.png", "sizes": "1080x1920", "type": "image/png", "form_factor": "narrow" },
    { "src": "/screenshots/screenshot-2.jpg", "sizes": "1080x1920", "type": "image/jpeg", "form_factor": "narrow" },
    { "src": "/screenshots/screenshot-3.png", "sizes": "1080x1920", "type": "image/png", "form_factor": "narrow" }
  ],
  "categories": ["entertainment", "lifestyle"]
}
```

---

## 9. 다음 단계: Google Play Store 등록

### 필요 사항
1. Google Play 개발자 계정 ($25 일회성)
2. 본인 인증 (신분증, 전화번호)
3. AAB 파일 (PWABuilder에서 생성)
4. 개인정보처리방침 URL

### 등록 절차
1. https://play.google.com/console 접속
2. 개발자 계정 생성 및 인증
3. 앱 만들기
4. 스토어 등록정보 작성
5. AAB 파일 업로드
6. 심사 제출

### 공개되는 정보
- 개발자 이름
- 개발자 이메일 (별도 이메일 사용 권장)
- 개인정보처리방침 URL
- **전화번호는 공개되지 않음**

---

## 프로젝트 구조

```
Fortune/
├── public/
│   ├── ads.txt
│   ├── manifest.json
│   ├── sw.js
│   ├── icon.svg
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   ├── icon-192x192.svg
│   │   ├── icon-512x512.png
│   │   └── icon-512x512.svg
│   └── screenshots/
│       ├── screenshot-1.png
│       ├── screenshot-2.jpg
│       └── screenshot-3.png
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (메인)
│   │   ├── input/page.tsx (입력)
│   │   └── result/page.tsx (결과)
│   ├── components/
│   │   ├── AdBanner.tsx
│   │   └── LanguageSelector.tsx
│   └── lib/
│       ├── fortune.ts
│       ├── templates.ts
│       ├── seed.ts
│       └── i18n/
│           ├── LanguageContext.tsx
│           └── translations.ts
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 배운 점 & 팁

1. **html2canvas 한계**: 웹폰트, flexbox 렌더링에 문제가 있음. inline style과 시스템 폰트 사용 권장.

2. **PWA 아이콘**: 대부분의 브라우저와 스토어는 PNG 아이콘을 요구함. SVG만으로는 부족.

3. **Cloudflare Pages**: `npm ci` 사용하므로 package-lock.json 동기화 필수.

4. **AdSense**: Next.js Script 컴포넌트 대신 일반 script 태그 사용해야 크롤러가 인식.

5. **PWA 설치 팝업**: 브라우저마다 조건이 다르고, 여러 번 방문해야 표시되는 경우가 많음.

---

## 참고 링크

- Cloudflare Pages: https://pages.cloudflare.com
- PWABuilder: https://pwabuilder.com
- Google Play Console: https://play.google.com/console
- Google AdSense: https://www.google.com/adsense
- html2canvas: https://html2canvas.hertzen.com
