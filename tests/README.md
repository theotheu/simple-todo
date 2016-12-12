# Install webdriver
Since v3 WebdriverIO comes with an own test runner. If you want to run your integration tests with it, install WebdriverIO globally calling:

`sudo npm install -g webdriverio`

@see http://webdriver.io/guide/getstarted/install.html


# Installation of selenium standalone server


## Option: selenium-standalone
It will install a selenium-standalone command line that will be able to install selenium server and start firefox, chrome, internet explorer or phantomjs for your tests.

Install selenium standalone with (`sudo` is only for Linux and OSX)

```
sudo npm install -g selenium-standalone@latest
```

Install the selenium version with (`sudo` is only for Linux and OSX)

```
sudo selenium-standalone install --version=2.43.1
```

## Option: downloading the jar
Check the actual version at http://www.seleniumhq.org/download/

Replace the version number with the actual version you have found on the site.

Download selenium

`curl -O http://selenium-release.storage.googleapis.com/2.43/selenium-server-standalone-2.43.1.jar`

Open a new terminal and run the webdriver / selenium hubs

```
java -jar selenium-server-standalone-2.43.1.jar -role hub
```

# Install phantomjs

Install phantomjs with

`sudo npm install -g phantomjs`.

Open a new terminal and run phantomjs with

```
phantomjs --webdriver=4445 --webdriver-selenium-grid-hub=http://127.0.0.1:4444
```

(Port numbers are default.)


*Note: You cannot use `should` with `protractor`. See https://github.com/angular/protractor/issues/633*

---


# Run the tests in 3 steps in 3 terminals

## 1. Run the chat server 
Open a new terminal and execute `node server.js` from the root from this dorectory.
 
You can verify that it runs by pointing your browser to `http://localhost:5000`. 

Replace `localhost` with the appropriate hostname 

## 2. Run selenium
Open a new terminal.

*Version 2.44 has issues. Use 2.43.1*

Open a new terminal and run
```
selenium-standalone start --version=2.43.1
```

## 3. Run the tests
Open a new terminal.

Run `npm test`.

Other option is to change your directory to tests/e2e and execute `mocha test.js`

### References
- http://webdriver.io/api.html


