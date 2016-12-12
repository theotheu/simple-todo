var webdriverio = require('webdriverio');
var assert = require('assert');

/**
 * `matrix` is a list of all browsers that will be used in this test.
 * For this test we will use two browsers.
 */
var matrix = webdriverio.multiremote({
        browserA: {desiredCapabilities: {browserName: 'phantomjs'}},
        browserB: {desiredCapabilities: {browserName: 'phantomjs'}}
    }),
    browserA = matrix.select('browserA'),
    browserB = matrix.select('browserB');


describe('Chat test with two browsers', function () {

    this.timeout(99999999);
    
    /**
     * @see https://github.com/domenic/chai-as-promised/
     */
    before(function () {
        var chai = require('chai');
        var chaiAsPromised = require('chai-as-promised');

        chai.use(chaiAsPromised);
        expect = chai.expect;
        chai.Should();
    });

    it('Should open chat application', function () {
        /**
         * Anything send to matrix will apply to all browsers defined in the matrix variable.
         */
        return matrix.init()
            .url('http://localhost:5000/');
    });

    it('Should get me a the title of browserA', function () {
        return browserA
            .getTitle().should.eventually.be.equal('Chat');
    });

    it('Should get me a the title of browserB', function () {
        return browserB
            .getTitle().should.eventually.be.equal('Chat');
    });

    it('Should send a message from browserA', function () {
        return browserA
            .setValue("#message", "Hello and welcome from browserA")
            .pause(1000)
            .keys("Enter")
            .pause(100);
    });

    it('Should send a message from browserB', function () {
        return browserB
            .setValue("#message", "Hello and welcome from browserB")
            .submitForm("#submitBtn");
    });

    it('Should read a message from browserA', function () {

        return browserA
            .pause(200)
            .isVisible("#chat").then(function (v) {
                assert.equal(v, true);
            })
            .getText('#chat').then(function (messages) {
                var m = messages.match(/Hello and welcome from browserB/g).length;
                m.should.be.above(0);
                m.should.be.equal(1);
            })

    });

    it('Should read a message from browserB', function () {

        return browserB
            .pause(200)
            .isVisible("#chat").then(function (v) {
                assert.equal(v, true);
            })
            .getText('#chat').then(function (messages) {
                var m = messages.match(/Hello and welcome from browserA/g).length;
                m.should.be.above(0);
                m.should.be.equal(1);
            })

    });

    it('should end the session', function () {
        return matrix.pause(500).end();
    });

});