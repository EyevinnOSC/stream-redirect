import { Context } from "@osaas/client-core";
import { setupDatabase } from "@osaas/client-db";
import { createEyevinnAppConfigSvcInstance, EyevinnAppConfigSvc, getEyevinnAppConfigSvcInstance } from "@osaas/client-services";
import fastify from "fastify";
import cors from '@fastify/cors';

async function initConfigService(ctx: Context): Promise<EyevinnAppConfigSvc> {
  let instance = await getEyevinnAppConfigSvcInstance(ctx, 'streamredirector');
  if (!instance) {
    const redisUrl = await setupDatabase('valkey', 'streamredirector', { password: 'secret' });
    instance = await createEyevinnAppConfigSvcInstance(ctx, {
      name: 'streamredirector',
      RedisUrl: redisUrl,
    });
  }
  return instance;
}

async function readConfigVariable(service: EyevinnAppConfigSvc, key: string) {
  const url = new URL(`/api/v1/config/${key}`, service.url);
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    return undefined;
  }
  const data = await response.json();
  return data.value;
}

async function main() {
  const ctx = new Context();
  const server = fastify();
  server.register(cors, {
    origin: '*',
    methods: ['REDIRECT'],
  });
  const configService = await initConfigService(ctx);
  if (!configService) {
    console.error('Failed to initialize config service');
    return;
  }

  server.get('/', async (request, reply) => {
    reply.send('Hello World');
  });

  server.get<{
    Params: { id: string }
  }>('/play/:id', async (request, reply) => {
    try {
      console.log(`Request to play ${request.params.id}`);
      const value = await readConfigVariable(configService, `${request.params.id}`);
      if (!value) {
        reply.code(404).send('Not found');
      }
      reply.redirect(value);
    } catch (err) {
      console.error(err);
      reply.code(500).send('Internal server error');
    }
  });

  server.listen({ host: '0.0.0.0', port: process.env.PORT ? Number(process.env.PORT) : 8080 }, (err, address) => {
    if (err) console.error(err);
    console.log(`Server listening at ${address}`);
  });
}

main();