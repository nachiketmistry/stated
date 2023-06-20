module.exports = `


(   $setInfo := function($acc, $metaInfo, $flags){(
        $acc~>|$|{
                    "metaInfos":metaInfos~>$append($metaInfo~>|$|{"treeHasExpressions__":$flags.treeHasExpressions__}|),
                    "flags":flags~>|$|{"treeHasExpressions__":($acc.flags.treeHasExpressions__ or $flags.treeHasExpressions__)}|
                }|;   
    )};
    $getPaths := function($o, $acc, $path){
     (                              
                $type($o)="array"
                ?(  $flags := $acc.flags;   /*save flags before recurse into subtree*/
                    $acc := $acc~>|flags|{"treeHasExpressions__":false}|; /*init to false upon descending)*/
                    $acc := $o~>$reduce(function($acc, $v, $idx){
                        $getPaths($v, $acc, $append($path, $idx))
                    }, $acc);
                    $flags:=$flags~>|$|{"treeHasExpressions__":($acc.flags.treeHasExpressions__ or $flags.treeHasExpressions__)}|;
                    $setInfo($acc, { "materialized__": true, "jsonPointer__": $path, "dependees__": [], "dependencies__": []},$flags);
                )
                :$type($o)="object"
                    ?(  $flags := $acc.flags; 
                        $acc := $acc~>|flags|{"treeHasExpressions__":false}|; /*init to false upon descending)*/
                        $acc := $spread($o)?$spread($o)~>$reduce(function($acc, $kv){
                            (
                                $k := $keys($kv)[0];
                                $v := $lookup($kv, $k);
                                $nextPath := $append($path, $k);
                                $getPaths($v, $acc, $nextPath)
                            )
                        }, $acc):$acc;
                        $flags:=$flags~>|$|{"treeHasExpressions__":($acc.flags.treeHasExpressions__ or $flags.treeHasExpressions__)}|;
                        $setInfo($acc, { "materialized__": true,"jsonPointer__": $path, "dependees__": [], "dependencies__": []},$flags);
                    )
    
                    :(
                        $match := /\\s*((/)|((\\.\\.\\/)*))\\$\\{(.+)\\}\\s*$/($o); 
                        $leadingSlash := $match[0].groups[1];
                        $leadingCdUp := $match[0].groups[2];
                        $slashOrCdUp := $leadingSlash ? $leadingSlash : $leadingCdUp;
                        $expr := $match[0].groups[4]; 
                        $match
                                ? $setInfo($acc, { "materialized__": true,"exprRootPath__":$slashOrCdUp, "expr__": $expr, "jsonPointer__": $path, "dependees__": [], "dependencies__": []}, {"treeHasExpressions__":true})
                                : $setInfo($acc, { "materialized__": true,"jsonPointer__": $path, "dependees__": [], "dependencies__": []},{"treeHasExpressions__":false})
                    )
      ) }; 
    $getPaths($, {"metaInfos":[],"flags":{"treeHasExpressions__":false}}, []).metaInfos; 
)`;