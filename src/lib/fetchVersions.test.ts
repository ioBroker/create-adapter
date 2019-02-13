// tslint:disable: no-unused-expression

import { expect } from "chai";
import * as proxyquireModule from "proxyquire";
import { stub } from "sinon";

const axiosMock = stub();
const proxyquire = proxyquireModule.noPreserveCache();

const { fetchPackageVersion } = proxyquire<typeof import ("./fetchVersions")>("./fetchVersions", {
	axios: {
		default: axiosMock,
	},
});

function returnVersion(version: string) {
	axiosMock.resolves({
		status: 200,
		data: { latest: version },
	});
}
function returnStatus(status: number) {
	axiosMock.resolves({ status });
}
function getRandomPackageName() {
	let ret = "";
	const digits = "abcdefghijklmnopqrstuvwxyz-_0123456789";
	while (ret.length < 8) {
		const index = Math.round(Math.random() * digits.length);
		ret += digits[index];
	}
	return ret;
}

const changedProcessEnv = new Map<string, any>();
function setProcessEnv(env: string, value: any) {
	if (!changedProcessEnv.has(env)) {
		changedProcessEnv.set(env, process.env[env]);
	}
	process.env[env] = value;
}
function resetProcessEnv() {
	for (const [env, value] of changedProcessEnv.entries()) {
		process.env[env] = value;
	}
}

describe("fetchVersions()", () => {

	beforeEach(() => {
		axiosMock.reset();
		resetProcessEnv();
	});

	it("for status codes other than 200, an error is thrown", async () => {
		returnStatus(403);
		await fetchPackageVersion(getRandomPackageName()).should.be.rejectedWith("403");
	});

	it("for status codes other than 200, the fallback version is returned if it is passed", async () => {
		returnStatus(403);
		const version = "1.2.3-beta";
		await fetchPackageVersion(getRandomPackageName(), version).should.become(version);
	});

	it("if the status code is 200, the latest version is extracted from the response data", async () => {
		const latest = "3.2.1";
		returnVersion(latest);
		await fetchPackageVersion(getRandomPackageName()).should.become(latest);
	});

	it("subsequent requests should return a cached version instead of issuing another request", async () => {

		const packageName = getRandomPackageName();

		const latest = "3.2.1";
		returnVersion(latest);
		await fetchPackageVersion(packageName).should.become(latest);

		// Even if the request would fail, this should work
		returnStatus(403);
		await fetchPackageVersion(packageName).should.become(latest);

		// Changes in the version should not be detected
		returnVersion("1.2.3");
		await fetchPackageVersion(packageName).should.become(latest);
	});

	it("the request object should contain an URL with the package name", async () => {
		returnVersion("1.2.3");
		await fetchPackageVersion("bar-baz");

		axiosMock.should.have.been.called;
		expect(axiosMock.getCall(0).args[0]).to.be.an("object");
		expect(axiosMock.getCall(0).args[0].url).to.include(encodeURIComponent("bar-baz"));
	});

	it("the request object should contain a default timeout of 5000ms", async () => {
		returnVersion("1.2.3");
		setProcessEnv("REQUEST_TIMEOUT", undefined);
		await fetchPackageVersion(getRandomPackageName());

		axiosMock.should.have.been.called;
		const callArg = axiosMock.getCall(0).args[0];
		expect(callArg).to.be.an("object");
		expect(callArg.timeout).to.equal(5000);
	});

	it("if the REQUEST_TIMEOUT env variable is set, that should be the request timeout", async () => {
		returnVersion("1.2.3");
		setProcessEnv("REQUEST_TIMEOUT", 7865);
		await fetchPackageVersion(getRandomPackageName());

		axiosMock.should.have.been.called;
		const callArg = axiosMock.getCall(0).args[0];
		expect(callArg).to.be.an("object");
		expect(callArg.timeout).to.equal(7865);
	});

	it("if the HTTPS_PROXY env variable is set, the proxy param should be set appropriately", async () => {
		returnVersion("1.2.3");
		setProcessEnv("HTTPS_PROXY", "https://foo.bar:8961");
		await fetchPackageVersion(getRandomPackageName());

		const callArg = axiosMock.getCall(0).args[0];
		expect(callArg.proxy).to.deep.equal({
			host: "foo.bar",
			port: 8961,
		});
	});

	it("the proxy port should default to 443", async () => {
		returnVersion("1.2.3");
		setProcessEnv("HTTPS_PROXY", "https://foo.bar");
		await fetchPackageVersion(getRandomPackageName());

		const callArg = axiosMock.getCall(0).args[0];
		expect(callArg.proxy.port).to.equal(443);
	});

	it("if the proxy has no valid hostname, it should not be used", async () => {
		returnVersion("1.2.3");
		setProcessEnv("HTTPS_PROXY", "/bar:80");
		await fetchPackageVersion(getRandomPackageName());

		const callArg = axiosMock.getCall(0).args[0];
		expect(callArg.proxy).to.be.undefined;
	});

});
