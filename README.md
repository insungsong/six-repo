## ๐ป ํ๋ก์ ํธ ๊ธฐ์  ์คํ

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

## ๐ด ํ๋ก์ ํธ ์ธํ ๋ฐฉ๋ฒ

```bash
# ํด๋น six-shop๋ฅผ git clone ๋ฐ์ต๋๋ค.

$ git clone <six-repo>
```

```bash
# env ํ์ผ์ ๊ฒฝ์ฐ ๋ฉ์ผ์ ํจ๊ป ์ฒจ๋ถํด๋๋ ธ์ต๋๋ค! .envํ์ผ์ ํ๋ก์ ํธ์ root์ ์์ฑํ์ฌ COPY & PASTEํด์ฃผ์๋ฉด ๋ฉ๋๋ค.
```

```bash
$ npm install
```

```bash
#์ ํ๋ฆฌ์ผ์ด์ ์์์์ ํต์ ์ Message Queue(feat. RabbitMQ)๋ฅผ ์ฌ์ฉํ์ต๋๋ค. postgres์ RabbitMQ์ ๊ฒฝ์ฐ docker-compose.yml ํ์ผ์ ํตํ์ฌ ์คํ ํ  ์ ์๋๋ก ๋ง๋ค์ด๋์์ต๋๋ค.

$ docker-compose up
```

```bash
# ํ๋ก์ ํธ์์์ ์คํ๋๋ application์ ํฌ๊ฒ 3๊ฐ์ง ์๋๋ค.
# gateway / authentication / store

$ nest start gateway โ-watch
$ nest start authentication โ-watch
$ nest start store โ-watch
```

<br/>
<br/>
<br/>

### ์คํ

```bash
http://localhost:3000/v1/docs
```

<br/>
<br/>
<br/>

### ๐ง๐ปโ๐ป ํ๊ณ 

์ฝ๋๋ก์จ ์ ๋ฅผ ๋ณด์ฌ๋๋ฆด ์ ์๋ ๊ธฐํ๋ฅผ ๋ง๋ค์ด์ฃผ์์ ๊ฐ์ฌํฉ๋๋ค.
๊ธฐํ ์ฝ๋ ๊ด๋ จ ๋ฌธ์๋ [ song22861@naver.com ] ๋ก ๋ง์ํด์ฃผ์ธ์.
