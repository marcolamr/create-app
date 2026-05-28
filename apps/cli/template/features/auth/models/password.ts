import {
  hash as argon2Hash,
  type Options,
  verify as argon2Verify,
} from '@node-rs/argon2';

import webserver from '@/config/webserver';

/** Argon2id (`Algorithm.Argon2id` = 2). Literal evita const enum com `isolatedModules`. */
const ARGON2_ID = 2;

function argon2Options(): Options {
  if (webserver.isServerlessRuntime) {
    return {
      algorithm: ARGON2_ID,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    };
  }

  return {
    memoryCost: 65_536,
    timeCost: 3,
    parallelism: 4,
    outputLen: 32,
    algorithm: ARGON2_ID,
  };
}

async function hash(password: string): Promise<string> {
  return argon2Hash(password, argon2Options());
}

async function compare(
  providedPassword: string,
  storedPassword: string,
): Promise<boolean> {
  try {
    return await argon2Verify(storedPassword, providedPassword);
  } catch {
    return false;
  }
}

export default Object.freeze({
  hash,
  compare,
});
