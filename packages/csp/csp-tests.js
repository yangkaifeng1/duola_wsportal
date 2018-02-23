// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by csp.js.
import { name as packageName } from "meteor/leaf4monkey:csp";

// Write your tests here!
// Here is an example.
Tinytest.add('csp - example', function (test) {
  test.equal(packageName, "csp");
});
