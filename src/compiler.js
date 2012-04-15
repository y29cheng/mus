// helpers
//function clone(obj){
//	if(obj == null || typeof(obj) != 'object')	return obj;
//	var temp = obj.constructor(); // changed
//	for(var key in obj)
//		temp[key] = clone(obj[key]);
//    return temp;
//}

function duration(musexpr) {
    if (musexpr.tag === 'note' || musexpr.tag === 'rest') return musexpr.dur;
    else if (musexpr.tag === 'seq') return duration(musexpr.left) + duration(musexpr.right);
    else if (musexpr.tag === 'par') return Math.max(duration(musexpr.left), duration(musexpr.right));
    else return musexpr.count*duration(musexpr.section);
}


function compile_mod(musexpr, start) {
    if (musexpr.tag === 'note' || musexpr.tag === 'rest') {
        musexpr.start = start;
        return [musexpr];
    } else if (musexpr.tag === 'seq') {
        var dur = duration(musexpr.left);
        return compile_mod(musexpr.left, start).concat(compile_mod(musexpr.right, start + dur));
    } else if (musexpr.tag === 'par') { // par
        return compile_mod(musexpr.left, start).concat(compile_mod(musexpr.right, start));
    } else {
        return compile_mod(musexpr.section, start);
    }
}

// compile mus input of tag 'note', 'seq', 'par', 'repeat' into note language 
var compile = function(musexpr) {
    if (musexpr.tag === 'repeat') { // repeat
        var n = [];
        var start = 0;
        var dur = duration(musexpr.section);
        for (var i = 0; i < musexpr.count; i++) {
            var newobj = jQuery.extend(true, {}, musexpr);
            n = n.concat(compile_mod(newobj, start));
            start += dur;
        }
        return n;
    }
    return compile_mod(musexpr, 0);
};
