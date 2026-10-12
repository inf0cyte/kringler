/*
 * KRINGLE link codec.
 * Obfuscates {giver, recipient} into a URL-safe string so the recipient
 * is not readable at a glance. This is NOT encryption: anyone with the
 * code and this file can decode it.
 */
const KringleCodec = (() => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function keystream(salt, len) {
    let s = ((salt[0] << 24) | (salt[1] << 16) | (salt[2] << 8) | salt[3]) >>> 0;
    if (s === 0) s = 0x9e3779b9;
    const out = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      out[i] = s & 255;
    }
    return out;
  }

  function toB64Url(bytes) {
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function fromB64Url(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    const bin = atob(str);
    return Uint8Array.from(bin, c => c.charCodeAt(0));
  }

  function encode(giver, recipient) {
    const data = enc.encode(JSON.stringify({ v: 1, g: giver, r: recipient }));
    const salt = crypto.getRandomValues(new Uint8Array(4));
    const k = keystream(salt, data.length);
    const out = new Uint8Array(4 + data.length);
    out.set(salt, 0);
    for (let i = 0; i < data.length; i++) out[4 + i] = data[i] ^ k[i];
    return toB64Url(out);
  }

  function decode(code) {
    try {
      const b = fromB64Url(code);
      if (b.length < 5) return null;
      const salt = b.slice(0, 4);
      const body = b.slice(4);
      const k = keystream(salt, body.length);
      const data = body.map((x, i) => x ^ k[i]);
      const o = JSON.parse(dec.decode(data));
      if (!o || typeof o.r !== 'string' || typeof o.g !== 'string') return null;
      return { giver: o.g, recipient: o.r };
    } catch {
      return null;
    }
  }

  return { encode, decode };
})();
