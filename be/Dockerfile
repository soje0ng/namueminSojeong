# 개발 환경
FROM node:20-alpine as development

# 필요한 패키지 설치
RUN apk update && apk add --no-cache tzdata cronie vim zsh git curl

# 시간대 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# # Node.js 메모리 제한 설정
# ENV NODE_OPTIONS="--max-old-space-size=4096"

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 개발 의존성 포함 모든 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# oh-my-zsh 설치
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true
RUN sed -i 's|/root:.*|/root:/usr/bin/zsh|' /etc/passwd

# 포트 설정
EXPOSE 3000

# 실행 명령어
CMD ["npm", "start"]

# 프로덕션 환경
FROM node:20-alpine as production

# # Node.js 메모리 제한 설정
# ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm install --production

COPY . .

EXPOSE 3000

# 실행하기 위한 명령어
# CMD ["npx", "nodemon", "--max-old-space-size=4096", "app.js"]
CMD ["npx", "nodemon", "app.js"]
