const DependencyFinder=require('./DependencyFinder');

test('$$.aaa', () => {
    const df = new DependencyFinder('$$.aaa');
    expect(df.findDependencies()).toEqual([["$", 'aaa']]);
});

test('merge', () => {
    const df = new DependencyFinder('$merge($.a.b, $i)');
    expect(df.findDependencies()).toEqual([["", 'a', 'b']]);
});

test('reduce 1', () => {
    const df = new DependencyFinder('$reduce(function($acc, $i){(\n' +
        '                            x.y.z\n' +
        '                       )})');
    expect(df.findDependencies()).toEqual([["x", "y", "z"]]);
});
test('reduce 2', () => {
    const df = new DependencyFinder('$reduce(function($acc, $i){(\n' +
        '                            $merge($.a.b, $i);\n' +
        '                            x.y.z\n' +
        '                       )})');
    expect(df.findDependencies()).toEqual([["", 'a', 'b'], ["x", "y", "z"]]);
});
test("transform - pattern should be ignored", () => {
    const program = `k.z~>|$|{'foo':nozzle~>|bingus|{"dingus":klunk}|, 'zap':$$.aaaa}|`
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["k", "z"],["$","aaaa"]    ]);
});
test("transform 1", () => {
    const program = `(                        
                        $gorp:=k.z[zz].[poop]~>|$|{'foo':nozzle~>|bingus|{"dingus":klunk}|, 'zap':$$.aaaa}|;                        
                        )`
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["k", "z"],["$","aaaa"]    ]);
});


test("variables 1", () => {
    const program = `a`
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["a"]]);
});
test("variables 2", () => {
    const program = `a.b.c`
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["a", "b", "c"]]);
});
test("variables 3", () => {
    const program = `(                        
                            $a:=zoink;                       
                        )`
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["zoink"]]);
});
test("variables 4", () => {
    const program = `(                        
                        $b:=$gimp.zoink;                       
                        )`
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([]);
});
test("variables 5", () => {
    const program = "i";
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["i"]]);
});

test("complex program 1", () => {
    const program = `(                        
                        $gorp:=k.z[zz].[poop]~>|$|{'foo':nozzle~>|bingus|{"dingus":klunk}|, 'zap':$$.aaaa}|;
                        $dink:=doink;
                        $loop := $map($.a, function($i){(
                                $a:=22;
                                $b:=$gimp.zoink;
                            )});
                       $loop ~> $reduce(function($acc, $i){(
                            $merge($.a.b, $i);
                            x.y.z
                       )});  
                        )`
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["k", "z"], ["$","aaaa"],["doink"], ["", "a"],["", 'a', 'b'], ["x", "y", "z"]]);
});

test("subtract", () => {
    const program = "c-a-b"
    const df = new DependencyFinder(program);
    expect(df.findDependencies()).toEqual([["c"], ["a"], ["b"]]);
});
