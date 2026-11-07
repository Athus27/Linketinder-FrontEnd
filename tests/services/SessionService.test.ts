import { afterEach, describe, expect, it, vi } from "vitest";
import { SessionService } from "../../src/services/SessionService";

afterEach(() => vi.unstubAllGlobals());

describe("SessionService", () => {
  it("mantém token e usuário somente em memória e anexa Bearer por request", async () => {
    const session = new SessionService();
    session.establish("opaque-token", { id: "7", name: "Teste", type: "candidate" });
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await session.request("http://api.test/api/candidatos");

    const requestHeaders = fetchMock.mock.calls[0][1].headers as Headers;
    expect(requestHeaders.get("Authorization")).toBe("Bearer opaque-token");
    expect(Object.keys(session.getState())).toEqual(["token", "user"]);
  });

  it("limpa estado e notifica ao receber 401", async () => {
    const session = new SessionService();
    const onUnauthorized = vi.fn();
    session.establish("expired", { id: "7", name: "Teste", type: "candidate" });
    session.setUnauthorizedCallback(onUnauthorized);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

    await expect(session.request("http://api.test/protected")).rejects.toMatchObject({ status: 401 });
    expect(session.getState()).toEqual({ token: null, user: null });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("faz logout com o token atual e limpa mesmo em erro de rede", async () => {
    const session = new SessionService();
    session.establish("opaque-token", { id: "7", name: "Teste", type: "candidate" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    await expect(session.logout("http://api.test")).rejects.toThrow("offline");
    expect(session.getState()).toEqual({ token: null, user: null });
  });
});
