/**
 * New node file
 */

var DEBUG = true;


var fs = require('fs');
var path = require('path');
var Wise2Lab = require('./wise2llab_nodelib');


// call from node, command line
//  arg1 source dir, where to read wise files
//  arg2 target dir, where to write llab files
//  arg3 lesson number of nodedata file (wise project.json) - 
//  arg4 filter for file type?


var args = process.argv.slice(2);

if (DEBUG) {
    console.log("ARGUMENTS: ");
    args.forEach(function(val, index, array) {
        console.log(index + ': ' + val);
    });
}

var sourcedir = args[0];
var targetdir = args[1];
var nodedata_lesson = args[2];
var ext_filter = args[3];

// nodedata crapola
var nodedata_dir = "nodedata/";
if (nodedata_lesson < 10) {
    nodedata_lesson = "0" + ("" + nodedata_lesson);
} else {
    nodedata_lesson = String.valueOf(nodedata_lesson);
}
var nodedata_lesson_filename = "lesson" + nodedata_lesson + ".project.json";
var nodedata_str = fs.readFileSync(nodedata_dir + nodedata_lesson_filename, 'utf8');
var nodedata = JSON.parse(nodedata_str);
if (DEBUG) {
    console.log("parsed " + nodedata_lesson_filename + ", got " + nodedata['nodes'].length + " nodes");
}
function get_nodedata_for_file (filename, unknown) {
    nodedata['nodes'].forEach(function (node) {
       if ((node.ref === filename) || (node.ref === (filename + "ml"))) {
           // hackalicious
           unknown = node.title;
       }
    });
    return (unknown || "");
}



// startmeup

var files = fs.readdirSync(sourcedir);

if (DEBUG) {
    files.forEach(function(val, index, array) {
        console.log(index + ": " + val);
    });
}

files.forEach(function(val, index, array) {
    if (DEBUG) {
        console.log("process: " + val);
    }
    var ext = path.extname(val);
    if (DEBUG) {
        console.log(" ext: " + ext);
    }
    ext = ext.slice(1);
    if (ext_filter && ext_filter !== ext) {
        if (DEBUG) {
            console.log("  ignoring!");
        }
        return;
    }
    var valpath = sourcedir + "/" + val;
    var filecontents = fs.readFileSync(valpath, 'utf8');
    var title_from_metadata = get_nodedata_for_file(val);
    var contents = Wise2Lab.convert_file(ext, filecontents, title_from_metadata, val);
    if (DEBUG) {
        console.log("contents: " + contents);
    }
    
    
});

