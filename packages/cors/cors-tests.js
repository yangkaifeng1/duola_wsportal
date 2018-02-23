// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by cors.js.
import { name as packageName } from "meteor/leaf4monkey:cors";

// Write your tests here!
// Here is an example.
Tinytest.add('cors - example', function (test) {
  test.equal(packageName, "cors");
});
