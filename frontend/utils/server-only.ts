import 'server-only';
import Iron from '@hapi/iron';

export async function sealToken(token: string | unknown) {
  try {
    const sealPassword = process.env.IRON_SEAL_PASSWORD ?? '';
    const sealedToken = await Iron.seal(token, sealPassword, Iron.defaults);
    return sealedToken;
  } catch (error) {
    console.error('Failed to seal token', error);
    return null;
  }
}

export async function revealToken(token: string) {
  try {
    const sealPassword = process.env.IRON_SEAL_PASSWORD ?? '';
    const revealedToken = await Iron.unseal(token, sealPassword, Iron.defaults);
    return revealedToken;
  } catch (error) {
    console.error('Failed to reveal token', error);
    return null;
  }
}
