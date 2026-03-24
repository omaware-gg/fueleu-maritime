/**
 * @group integration
 * Requires PostgreSQL running with seeded data.
 */
import request from 'supertest';
import app from '@infrastructure/server/index';
import pool from '@infrastructure/db/client';

afterAll(async () => {
  await pool.end();
});

describe('GET /routes', () => {
  it('returns 200 and array of 5 routes', async () => {
    const res = await request(app).get('/routes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(5);
    expect(res.body[0]).toHaveProperty('routeId');
    expect(res.body[0]).toHaveProperty('ghgIntensity');
  });

  it('GET /routes?vesselType=Container returns only Container routes', async () => {
    const res = await request(app).get('/routes').query({ vesselType: 'Container' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    for (const route of res.body) {
      expect(route.vesselType).toBe('Container');
    }
  });
});

describe('GET /routes/comparison', () => {
  beforeAll(async () => {
    await request(app).post('/routes/R004/baseline');
  });

  it('returns { baseline, comparisons } with R004 as baseline', async () => {
    const res = await request(app).get('/routes/comparison');
    expect(res.status).toBe(200);
    expect(res.body.baseline).toBeDefined();
    expect(res.body.baseline.routeId).toBe('R004');
    expect(res.body.baseline.isBaseline).toBe(true);
    expect(Array.isArray(res.body.comparisons)).toBe(true);
    expect(res.body.comparisons.length).toBe(4);
    for (const c of res.body.comparisons) {
      expect(c).toHaveProperty('percentDiff');
      expect(c).toHaveProperty('compliant');
      expect(c.baselineRouteId).toBe('R004');
    }
  });
});

describe('POST /routes/:id/baseline', () => {
  it('returns 200 and sets R001 as baseline', async () => {
    const res = await request(app).post('/routes/R001/baseline');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('R001');

    const comparison = await request(app).get('/routes/comparison');
    expect(comparison.body.baseline.routeId).toBe('R001');
  });

  afterAll(async () => {
    await request(app).post('/routes/R004/baseline');
  });
});

describe('GET /compliance/cb', () => {
  it('returns { cb, energyMj } for R001/2024', async () => {
    const res = await request(app)
      .get('/compliance/cb')
      .query({ shipId: 'R001', year: 2024 });
    expect(res.status).toBe(200);
    expect(res.body.shipId).toBe('R001');
    expect(res.body.year).toBe(2024);
    expect(typeof res.body.cb).toBe('number');
    expect(res.body.cb).toBeLessThan(0);
    expect(res.body.energyMj).toBe(205_000_000);
  });
});

describe('POST /banking/bank', () => {
  it('banks surplus for R002 (compliant ship)', async () => {
    const res = await request(app)
      .post('/banking/bank')
      .send({ shipId: 'R002', year: 2024, amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cbBefore');
    expect(res.body).toHaveProperty('banked');
    expect(res.body).toHaveProperty('cbAfter');
    expect(res.body.banked).toBe(100);
    expect(res.body.cbBefore).toBeGreaterThan(0);
  });

  it('returns 400 when banking a deficit ship (R001)', async () => {
    const res = await request(app)
      .post('/banking/bank')
      .send({ shipId: 'R001', year: 2024, amount: 100 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /pools', () => {
  it('returns 201 with pool and cb_after per member', async () => {
    const res = await request(app)
      .post('/pools')
      .send({
        year: 2024,
        members: [
          { shipId: 'S1', cb: 200 },
          { shipId: 'S2', cb: -100 },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('year', 2024);
    expect(res.body.members).toHaveLength(2);
    for (const m of res.body.members) {
      expect(m).toHaveProperty('cbBefore');
      expect(m).toHaveProperty('cbAfter');
    }
  });

  it('returns 400 when pool sum < 0', async () => {
    const res = await request(app)
      .post('/pools')
      .send({
        year: 2024,
        members: [
          { shipId: 'S1', cb: 50 },
          { shipId: 'S2', cb: -200 },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('must be >= 0');
  });
});
