import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppManagerModule } from '../appManager.module';
import { ConfigModule } from '@nestjs/config';
import { APPList } from '../appConfg';

describe('AppManager (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AppManagerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/appManager/getToken (POST)', () => {
    it('should generate token', () => {
      return request(app.getHttpServer())
        .post('/api/appManager/getToken')
        .send({
          appId: 'test-app-id',
          appSecret: 'test-app-secret',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data).toBeDefined();
        });
    });
  });

  describe('/api/appManager/verify (POST)', () => {
    it('should verify token', async () => {
      // 首先获取 token
      const tokenResponse = await request(app.getHttpServer())
        .post('/api/appManager/getToken')
        .send({
          appId: APPList[0].appId,
          appSecret: APPList[0].appSecret,
        });

      const token = tokenResponse.body.data;

      // 然后验证 token
      return request(app.getHttpServer())
        .post('/api/appManager/verify')
        .send({
          appId: 'test-app-id',
          appToken: token,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data).toBe(true);
        });
    });
  });
});
