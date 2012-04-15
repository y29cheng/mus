// helpers
function duration(musexpr) {
    if (musexpr.tag === 'note') return musexpr.dur;
    else if (musexpr.tag === 'seq') return duration(musexpr.left) + duration(musexpr.right);
    else return Math.max(duration(musexpr.left), duration(musexpr.right));
}

function compile_mod(musexpr, start) {
    if (musexpr.tag === 'note') {
        musexpr.start = start;
        return [musexpr];
    } else if (musexpr.tag === 'seq') {
        var dur = duration(musexpr.left);
        return compile_mod(musexpr.left, start).concat(compile_mod(musexpr.right, start + dur));
    } else { // par
        return compile_mod(musexpr.left, start).concat(compile_mod(musexpr.right, start));
    }
}
// compile mus input of tag 'note', 'seq', 'par' into note language 
var compile = function(musexpr) {
    return compile_mod(musexpr, 0);
};
