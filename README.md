## 💻 프로젝트 기술 스택

- Programming language : TypeScript
- RunTime: NodeJS(feat. NestJS)
- Programing Interface: Restful
- DBMS: PostgreSQL
- Authentication: JWT
- ETC:
  <br/>
  - Message Queue(feat. RabbitMQ)
    <br/>
  - TypeORM
    <br/>
  - docker-compose

<br/>
<br/>
<br/>

## ✍️ API 시나리오

##### 👀 ()안의 내용은 API 이름을 의미합니다.

- 회원 가입 API를 호출 (registerUser) - Mutation
- 회원 인증 및 accessToken 및 refresh Token을 발급(authenticate) - Query
- 🧑🏻‍💻 작업중..

<br/>
<br/>
<br/>

## 🍴 프로젝트 세팅 방법

```bash
# 해당 six-shop를 git clone 받습니다.

$ git clone <six-shop>
```

```bash
# env 파일의 경우 메일에 함께 첨부해드렸습니다! .env파일을 프로젝트에 root에 생성하여 COPY & PASTE해주시면 됩니다.
```

```bash
$ npm install
```

```bash
#애플리케이션 안에서의 통신은 Message Queue(feat. RabbitMQ)를 사용했습니다. postgres와 RabbitMQ의 경우 docker-compose.yml 파일을 통하여 실행 할 수 있도록 만들어놓았습니다.

$ docker-compose up
```

```bash
# 프로젝트안에서 실행되는 application은 크게 3가지 입니다.
# gateway / authentication / store

$ nest start gateway —-watch
$ nest start authentication —-watch
$ nest start store —-watch
```

<br/>
<br/>
<br/>

### 실행

```bash
http://localhost:3000/v1/docs
```

<br/>
<br/>
<br/>

### 🧑🏻‍💻 회고

코드로써 저를 보여드릴 수 있는 기회를 만들어주셔서 감사합니다.
기타 코드 관련 문의는 [ song22861@naver.com ] 로 말씀해주세요.
