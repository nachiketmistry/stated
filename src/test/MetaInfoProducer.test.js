const getMetaInfos = require('../MetaInfoProducer');
const Stated  = require("../../stated");


test("tt1", async () => {
    const template = {
        "a": 42,
        "b": "${a}",
        "c": "${'the answer is: '& b}"
    };
    const metaInfos = await getMetaInfos(template);
    expect(JSON.parse(JSON.stringify(metaInfos, Stated.printFunc, 2))).toEqual([
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "a"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "a",
            "jsonPointer__": [
                "b"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "'the answer is: '& b",
            "jsonPointer__": [
                "c"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        }
    ]);
});

test("t2", async () => {
    const template = {
        "a": 10,
        "b": 10,
        "c": "${$$.a*b}",
        "d": "${c-a-b}",
        "e": {
            "f": -1,
            "g": "${e.f}" //<--- this is an intentionally incorrect reference
        }
    };
    const metaInfos = await getMetaInfos(template);
    expect(JSON.parse(JSON.stringify(metaInfos, Stated.printFunc, 2))).toEqual([
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "a"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "b"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "$$.a*b",
            "jsonPointer__": [
                "c"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "c-a-b",
            "jsonPointer__": [
                "d"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "e",
                "f"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "e.f",
            "jsonPointer__": [
                "e",
                "g"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "e"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        }
    ]);
});


test("t3", async () => {
    const template = {
        "x": " @INSTALL ${  k.z~>|$|{'band':true}|}",
        "a": 10,
        "b": 10,
        "c": "${$$.a*b}",
        "d": "${c-a-b}",
        "e": {
            "f": -1,
            "g": "../${h}"
        },
        "h": "${i}",
        "i": 8,
        "j": [
            "../${c}",
            "../${d}",
            [
                "../${$[1]}",
                "../../${a}"
            ],
            44,
            "hi"
        ],
        "k": {
            "z": {
                "zz": "top"
            },
            "q": "${$.z.zz}"
        },
        "l": "${j}"
    };
    const metaInfos = await getMetaInfos(template);
    expect(JSON.parse(JSON.stringify(metaInfos, Stated.printFunc, 2))).toEqual([
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "  k.z~>|$|{'band':true}|",
            "jsonPointer__": [
                "x"
            ],
            "materialized__": true,
            "tags__": [
                "INSTALL"
            ],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "a"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "b"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "$$.a*b",
            "jsonPointer__": [
                "c"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "c-a-b",
            "jsonPointer__": [
                "d"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "e",
                "f"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": "../",
            "expr__": "h",
            "jsonPointer__": [
                "e",
                "g"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "e"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "i",
            "jsonPointer__": [
                "h"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "i"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": "../",
            "expr__": "c",
            "jsonPointer__": [
                "j",
                0
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": "../",
            "expr__": "d",
            "jsonPointer__": [
                "j",
                1
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": "../",
            "expr__": "$[1]",
            "jsonPointer__": [
                "j",
                2,
                0
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": "../../",
            "expr__": "a",
            "jsonPointer__": [
                "j",
                2,
                1
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "j",
                2
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "j",
                3
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "j",
                4
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "j"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "k",
                "z",
                "zz"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "k",
                "z"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": false
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "$.z.zz",
            "jsonPointer__": [
                "k",
                "q"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [
                "k"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "exprRootPath__": null,
            "expr__": "j",
            "jsonPointer__": [
                "l"
            ],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        },
        {
            "dependees__": [],
            "dependencies__": [],
            "jsonPointer__": [],
            "materialized__": true,
            "tags__": [],
            "treeHasExpressions__": true
        }
    ]);
});