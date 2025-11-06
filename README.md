# AI 기반 3D 비주얼라이저 스튜디오

웹 브라우저에서 AI가 생성하거나 큐레이션한 3D 오브젝트 에셋을 활용하여 자신만의 3D 씬을 자유롭게 구성하고, 고품질 이미지로 즉시 렌더링할 수 있는 강력하고 직관적인 비주얼라이저 스튜디오입니다.

## 🎨 주요 특징

### 1. **3D 작업 공간**
- WebGL 기반 고성능 실시간 렌더링 (Three.js + React Three Fiber)
- 직관적인 카메라 컨트롤 (OrbitControls)
- 환경 설정 (그리드, 배경색, 조명)
- 실시간 렌더링 프리뷰

### 2. **오브젝트 에셋 라이브러리**
- AI 생성 및 큐레이션된 3D 에셋 목록
- 카테고리별 분류 (Primitives, AI Generated 등)
- 시각적 썸네일 및 상세 정보
- 드래그 앤 드롭으로 씬에 추가
- 강력한 검색 및 필터링 기능

### 3. **오브젝트 조작 도구**
- 선택 및 다중 선택
- 변형 기즈모 (Translate, Rotate, Scale)
- 정밀 속성 패널 (위치, 회전, 크기 수치 입력)
- 복제 및 삭제

### 4. **재질 및 텍스처**
- PBR 재질 설정 (색상, 금속성, 거칠기)
- 실시간 재질 프리뷰

### 5. **AI 상호작용 루프**
- AI와의 대화형 피드백 시스템
- 텍스트 입력으로 새로운 에셋 생성 요청
- AI 생성 기록 및 이전 결과 불러오기
- 생성된 에셋을 라이브러리에 추가

### 6. **고품질 이미지 출력**
- 현재 뷰포트 캡처 및 렌더링
- 다양한 해상도 선택 (HD, FHD, 2K, 4K)
- 이미지 형식 선택 (PNG, JPG, WebP)
- 품질 및 렌더링 옵션 조절
- 투명 배경 지원
- 렌더링된 이미지 즉시 다운로드

## 🚀 기술 스택

- **프론트엔드 프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **3D 렌더링**: Three.js + React Three Fiber + Drei
- **상태 관리**: Zustand
- **스타일링**: Tailwind CSS
- **아이콘**: Lucide React

## 📦 설치 및 실행

### 필수 조건
- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 패키지 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 서버 시작 (기본 포트: 5173)
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

## 🎯 사용 방법

### 1. 오브젝트 추가하기
- 왼쪽 사이드바에서 "Asset Library" 탭 선택
- 원하는 오브젝트를 클릭하여 3D 작업 공간에 추가

### 2. 오브젝트 조작하기
- 오브젝트를 클릭하여 선택
- 상단 툴바에서 변형 모드 선택 (이동/회전/크기)
- 기즈모를 드래그하여 조작하거나 오른쪽 패널에서 정밀한 값 입력

### 3. AI로 새로운 에셋 생성하기
- 왼쪽 사이드바에서 "AI Assistant" 탭 선택
- 원하는 에셋을 설명하는 텍스트 입력
- "Generate" 버튼 클릭
- 생성된 에셋을 "Add to Library" 버튼으로 라이브러리에 추가

### 4. 씬 렌더링 및 내보내기
- 오른쪽 사이드바에서 "Render" 탭 선택
- 해상도, 형식, 품질 등 설정
- "Render Scene" 버튼 클릭
- 렌더링 완료 후 "Download" 버튼으로 이미지 저장

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Viewport3D.tsx   # 3D 작업 공간
│   ├── SceneObjects.tsx # 씬 오브젝트 렌더링
│   ├── TransformControls.tsx # 변형 컨트롤
│   ├── TopToolbar.tsx   # 상단 툴바
│   ├── LeftSidebar.tsx  # 왼쪽 사이드바
│   ├── RightSidebar.tsx # 오른쪽 사이드바
│   ├── AssetLibrary.tsx # 에셋 라이브러리
│   ├── AIPanel.tsx      # AI 어시스턴트 패널
│   ├── PropertiesPanel.tsx # 속성 패널
│   ├── SceneSettingsPanel.tsx # 씬 설정 패널
│   └── RenderPanel.tsx  # 렌더링 패널
├── stores/              # Zustand 상태 관리
│   ├── sceneStore.ts    # 씬 상태
│   ├── assetStore.ts    # 에셋 상태
│   ├── renderStore.ts   # 렌더링 상태
│   └── aiStore.ts       # AI 상태
├── types/               # TypeScript 타입 정의
│   └── index.ts
├── App.tsx              # 메인 앱 컴포넌트
├── main.tsx             # 앱 엔트리 포인트
└── index.css            # 글로벌 스타일
```

## 🎨 UI/UX 특징

- **직관적인 3단 레이아웃**: 왼쪽(에셋/AI), 중앙(3D 뷰포트), 오른쪽(속성/설정/렌더)
- **다크 테마**: 3D 작업에 최적화된 다크 UI
- **실시간 피드백**: 모든 변경사항이 즉시 3D 뷰포트에 반영
- **키보드 단축키**: G (이동), R (회전), S (크기) - 계획 중

## 🔮 향후 개발 계획

- [ ] 씬 저장/불러오기 기능 구현
- [ ] 3D 파일 가져오기 (GLTF, OBJ)
- [ ] 3D 파일 내보내기
- [ ] 고급 조명 시스템
- [ ] 포스트 프로세싱 효과
- [ ] 애니메이션 지원
- [ ] 실제 AI 통합 (현재는 Mock)
- [ ] 다중 카메라 뷰
- [ ] 협업 기능

## 📄 라이선스

Apache License 2.0

## 🤝 기여

이슈와 풀 리퀘스트를 환영합니다!

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.
