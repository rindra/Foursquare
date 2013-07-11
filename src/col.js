// Call 'c' when the action is considered "completed".
var collapsed = {
    bg:unit.find('bgcol').node,
    hot:unit.find('hot').node,
    spots:unit.find('spots').node,
    to:unit.find('to').node,
    hit:unit.find('hit').node,
    final:unit.find('final').node,
    cta:unit.find('cta').node,
    load: function(){
        collapsed.loader(['http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/plugins/CSSPlugin.min.js',
        'http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenLite.min.js',
        'http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TimelineLite.min.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js?ver=latest'
        ], 0);
        collapsed.bg.style.cssText = 'top:0px;';
        collapsed.hot.style.cssText = 'top:0px; opacity:0;';
        collapsed.spots.style.cssText = 'top:0px; opacity:0;';
        collapsed.to.style.cssText = 'top:0px; opacity:0;';
        collapsed.hit.style.cssText = 'top:0px; opacity:0;';
        collapsed.final.style.cssText = 'top:0px; opacity:0;';
        collapsed.cta.style.top = '15px';
    },
    init: function(){
        var t = new TimelineLite();
        t.add(TweenLite.to(collapsed.hot, 0.5, {opacity:1}));
        t.add(TweenLite.to(collapsed.spots, 0.5, {opacity:1}), "+=.1");
        t.add(TweenLite.to(collapsed.to, 0.5, {opacity:1}), "+=.1");
        t.add(TweenLite.to(collapsed.hit, 0.5, {opacity:1}), "+=.1");
        t.add(TweenLite.to(collapsed.cta, 0.5, {top:-15}), "+=.1");
        t.add(TweenLite.to(collapsed.hot, 0.5, {opacity:0}), 3.5);
        t.add(TweenLite.to(collapsed.spots, 0.5, {opacity:0}), 3.5);
        t.add(TweenLite.to(collapsed.to, 0.5, {opacity:0}), 3.5);
        t.add(TweenLite.to(collapsed.hit, 0.5, {opacity:0}), 3.5);
        t.add(TweenLite.to(collapsed.final, 0.5, {opacity:1}), 4);
    },
    loader:function(libs, id){
        if(id<libs.length){
            loadJS(libs[id], function(){collapsed.loader(libs, ++id);});
        }else{
            collapsed.init();
        }
    }
};
collapsed.load();
c();

