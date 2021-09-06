import { expect } from "chai";
import proxyquireModule from "proxyquire";
import { stub } from "sinon";
import { getPackageName, getVersionSpecifier } from "./packageVersions";

const axiosMock = stub();
const proxyquire = proxyquireModule.noPreserveCache();

const { fetchPackageVersion, fetchPackageReferenceVersion } = proxyquire<
	typeof import("./packageVersions")
>("./packageVersions", {
	axios: axiosMock,
});

function returnVersions(versions: string[]) {
	const ret: any = {
		status: 200,
		data: { versions: {} },
	};
	for (const version of versions) {
		ret.data.versions[version] = null;
	}
	axiosMock.resolves(ret);
}
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

function getRandomPackageVersion() {
	return [0, 0, 0]
		.map(() => Math.round(Math.random() * 10))
		.map((v) => v.toString())
		.join(".");
}

function getRandomPackageNameAndVersion(
	version: string = getRandomPackageVersion(),
) {
	return `${getRandomPackageName()}@${version}`;
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

describe("packageVersions/getVersionSpecifier()", () => {
	it("returns the version from a package@version specifier", () => {
		const tests = [
			{ nameAndVersion: "", expected: undefined },
			{ nameAndVersion: "foobar", expected: undefined },
			{ nameAndVersion: "foobar@1.2.3", expected: "1.2.3" },
			{ nameAndVersion: "@scope/foobar@4.5.6", expected: "4.5.6" },
		];
		for (const { nameAndVersion, expected } of tests) {
			expect(getVersionSpecifier(nameAndVersion)).to.equal(expected);
		}
	});
});

describe("packageVersions/getPackageName()", () => {
	it("returns the name from a package@version specifier", () => {
		const tests = [
			{ nameAndVersion: "", expected: "" },
			{ nameAndVersion: "foobar", expected: "foobar" },
			{ nameAndVersion: "foobar@1.2.3", expected: "foobar" },
			{
				nameAndVersion: "@scope/foobar@4.5.6",
				expected: "@scope/foobar",
			},
		];
		for (const { nameAndVersion, expected } of tests) {
			getPackageName(nameAndVersion).should.equal(expected);
		}
	});
});

describe("packageVersions/fetchPackageVersion(latest)", () => {
	beforeEach(() => {
		axiosMock.reset();
		resetProcessEnv();
	});

	it("for status codes other than 200, an error is thrown", async () => {
		returnStatus(403);
		await fetchPackageVersion(
			getRandomPackageName(),
		).should.be.rejectedWith("403");
	});

	it("for status codes other than 200, the fallback version is returned if it is passed", async () => {
		returnStatus(403);
		const version = "1.2.3-beta";
		await fetchPackageVersion(
			getRandomPackageName(),
			version,
		).should.become(version);
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
		expect(axiosMock.getCall(0).args[0].url).to.include("/-/package/");
		expect(axiosMock.getCall(0).args[0].url).to.include(
			encodeURIComponent("bar-baz"),
		);
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

describe("packageVersions/fetchPackageVersion(specific)", () => {
	const testVersions = ["0.1.5", "1.2.3", "1.3.5", "1.2.4", "1.1.1", "2.3.4"];

	beforeEach(() => {
		axiosMock.reset();
		resetProcessEnv();
	});

	it("for status codes other than 200, an error is thrown", async () => {
		returnStatus(403);
		await fetchPackageVersion(
			getRandomPackageNameAndVersion(),
		).should.be.rejectedWith("403");
	});

	it("for status codes other than 200, the fallback version is returned if it is passed", async () => {
		returnStatus(403);
		const version = "1.2.3-beta";
		await fetchPackageVersion(
			getRandomPackageNameAndVersion(),
			version,
		).should.become(version);
	});

	it("if the status code is 200, the highest matching version is extracted from the response data", async () => {
		returnVersions(testVersions);
		await fetchPackageVersion(getRandomPackageName() + "@1").should.become(
			"1.3.5",
		);
		await fetchPackageVersion(
			getRandomPackageName() + "@~1.2",
		).should.become("1.2.4");
		await fetchPackageVersion(getRandomPackageName() + "@2").should.become(
			"2.3.4",
		);
	});

	it("subsequent requests should return a cached version instead of issuing another request", async () => {
		const packageName = getRandomPackageNameAndVersion("2");
		const expected = "2.3.4";

		returnVersions(testVersions);
		await fetchPackageVersion(packageName).should.become(expected);

		// Even if the request would fail, this should work
		returnStatus(403);
		await fetchPackageVersion(packageName).should.become(expected);

		// Changes in the version should not be detected
		returnVersions([...testVersions, "2.9.99"]);
		await fetchPackageVersion(packageName).should.become(expected);
	});

	it("the request object should contain an URL with the package name", async () => {
		returnVersions(testVersions);
		await fetchPackageVersion("bar-baz@1");

		axiosMock.should.have.been.called;
		expect(axiosMock.getCall(0).args[0]).to.be.an("object");
		expect(axiosMock.getCall(0).args[0].url).to.not.include("/-/package/");
		expect(axiosMock.getCall(0).args[0].url).to.include(
			encodeURIComponent("bar-baz"),
		);
	});
});

describe("packageVersions/fetchPackageReferenceVersion()", () => {
	const testVersions = ["0.1.5", "1.2.3", "1.3.5", "1.2.4", "1.1.1", "2.3.4"];

	beforeEach(() => {
		axiosMock.reset();
		resetProcessEnv();
	});

	it("for status codes other than 200, the requested version is returned", async () => {
		returnStatus(403);
		const version = "3.13.5";
		await fetchPackageReferenceVersion(
			getRandomPackageNameAndVersion(version),
		).should.become(version);
	});

	it("if the status code is 200, the highest matching version is extracted from the response data", async () => {
		returnVersions(testVersions);

		// cases for major version ("^")
		await fetchPackageReferenceVersion(
			getRandomPackageName() + "@1",
		).should.become("^1.3.5");
		await fetchPackageReferenceVersion(
			getRandomPackageName() + "@^1",
		).should.become("^1.3.5");
		await fetchPackageReferenceVersion(
			getRandomPackageName() + "@^1.1",
		).should.become("^1.3.5");
		await fetchPackageReferenceVersion(
			getRandomPackageName() + "@^1.1.1",
		).should.become("^1.3.5");

		// cases for minor version ("~")
		await fetchPackageReferenceVersion(
			getRandomPackageName() + "@1.2",
		).should.become("~1.2.4");
		await fetchPackageReferenceVersion(
			getRandomPackageName() + "@~1.2",
		).should.become("~1.2.4");
		await fetchPackageReferenceVersion(
			getRandomPackageName() + "@~1.2.1",
		).should.become("~1.2.4");

		// cases for exact version (no prefix)
		await fetchPackageVersion(
			getRandomPackageName() + "@1.2.4",
		).should.become("1.2.4");
	});
});
