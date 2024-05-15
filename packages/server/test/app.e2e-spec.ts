import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("appController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule( {
      imports: [AppModule],
    } ).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  } );

  it("/ (GET)", async () => {
    const { statusCode, text } = await request(app.getHttpServer()).get("/");

    expect(statusCode).toBe(200);
    expect(text).toBe("Hello World!");
  } );
} );
