var assert = require('assert');
var fs = require('fs');

function getActiveRecordModels(projectName) {
  var filePath = projectName + "/app/models";
  var files = fs.readdirSync(filePath);
  var rubyFiles = files.filter(function(file) {
    return file.slice(-3) === ".rb";
  });

  return rubyFiles.filter(function(file) {
    return fs.readFileSync(filePath + "/" + file).indexOf('< ActiveRecord::Base') >= 0;
  });

}

function getClassName(projectName, fileName) {
  var contents = fs.readFileSync(projectName + "/app/models/" + fileName, "utf-8");
  var matches = contents.match(/class (\w+)/);
  return matches[1];
}

function getAssociation(projectName, fileName, association) {
  var contents = fs.readFileSync(projectName + "/app/models/" + fileName, "utf-8");
  var re = new RegExp(".*" + association + " :(\\w+)", "g");
  var associationLines = contents.match(re);

  return associationLines.map(function(associationLine) {
    var re = new RegExp(".*" + association + " :(\\w+)");
    return associationLine.match(re)[1];
  });

  
}

describe('getActiveRecordModels', function() {
  it("returns the files that contain active record models", function() {
    var files = getActiveRecordModels("Lonely-Proton");

    assert.deepEqual(files.sort(), ["tag.rb", "post_view.rb", "post.rb"].sort());
  });
});

describe('getClassName', function() {
  it("returns the class name", function() {
    var className = getClassName("Lonely-Proton", "post.rb");

    assert.equal(className, "Post");
  });
});

describe('getAssociation', function() {
  it('returns the association of the given type', function() {
    var association = getAssociation("Lonely-Proton", "post.rb", "has_many");

    assert.deepEqual(association, ["post_views", "comments"]);
  });
});
