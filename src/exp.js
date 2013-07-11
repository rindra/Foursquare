var main = {
    start:unit.find('Start').node,
    goToFoursquare:unit.find('goToFoursquare'),
    bgHome:unit.find('bgHome'),
    header:unit.find('header'),
    footer:unit.find('footer'),
    txt:unit.find('txt'),
    map:unit.find('map').node,
    pan:unit.find('pan'),
    wrapper:0,
    load: function(){
        main.loader(['http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/plugins/CSSPlugin.min.js',
        'http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenLite.min.js',
        'http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TimelineLite.min.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js?ver=latest'
        ], 0);
        //loadJS('https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js?ver=latest', this.init);
    },
    init: function(){
        
        //position:absolute; height: 0px; width: 0px; border:20px solid; border-color: red red transparent red;
        
        var currentIMG = unit.find('pan').node.children[0].children[0].children[0];
        //var newIMG = document.createElement('img');
        //newIMG.src = 'http://rindra.com/celtra/test2.png';
        main.wrapper = document.createElement('div');
        main.wrapper.setAttribute('id', 'wrapper');
        main.wrapper.style.cssText = 'font-family:Arial; color:#999999; font-size:14px; line-height:20px';
        //var newIMG = document.createElement('img');
        //newIMG.src = 'http://rindra.com/celtra/test2.png';
        var panDiv = main.pan.node.children[0].children[0];
        panDiv.innerHTML = '';
        main.map.children[0].innerHTML = '';
        //main.wrapper.appendChild(newIMG);
        panDiv.appendChild(main.wrapper);
        main.txt.node.children[1].style.color = '#333333';
        main.txt.node.children[1].style.textAlign = 'center';
        main.txt.node.children[1].value = 'Zip code';
        main.txt.node.children[1].onfocus = function(){
            this.value = '';
        };
        attach(main.goToFoursquare.node, 'tap', function(){ 
            main.hideHome();
            main.drawMap();
        });
        attach(main.header.node, 'tap', function(){ 
            main.listTips = [];
            main.listZipcar = [];
            main.listVenue = [];
            main.wrapper.innerHTML = '';
            main.showHome();
        });
        main.showHome();
    },
    showHome:function(){
        main.bgHome.showAction(ctx);
        main.goToFoursquare.showAction(ctx);
        main.txt.showAction(ctx);
    },
    hideHome:function(){
        main.bgHome.hideAction(ctx);
        main.goToFoursquare.hideAction(ctx);
        main.txt.hideAction(ctx);
    },
    gCoords:{},
    gMap:{},
    drawMap:function(){
        //setup the map canvas
        //var coords = getCoordsFromZip($('#zipcode').val());
        main.gCoords = main.getCoordsFromZip((main.txt.node.children[1].value !== '' && main.txt.node.children[1].value !== 'Zip code')?main.txt.node.children[1].value:'10001');
      //  var mapcanvas = document.getElementById('mapcontainer');
        var options = {
            zoom: 14,
            center: main.gCoords,
            //mapTypeControl: false,
            disableDefaultUI: true,
            /*navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },*/
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      //  var map = new google.maps.Map(document.getElementById("mapcontainer"), options);
        main.gMap = new google.maps.Map(main.map.children[0], options);
        //clear the info box to repopulate
        //$('#infoBox').html('');
        main.addFoursquarePins(1082106, main.gCoords, main.gMap);
        //main.addGooglePins(coords, map);
        //main.addTrendingPins(coords, map);
    },
    listTips:[],
    addFoursquarePins: function(foursquareId, coords, map){
        //gather all the list ids associated with given user
        var listIds = new Array();
        var apiUrl = "https://api.foursquare.com/v2/users/" + foursquareId + "/lists?group=created&oauth_token=NEPYD2KRGKBZOQ31542XQDDF2KVH5XXMDEKOX4EDWA3ZFVSJ&v=20130314";
	    $.ajax({
            url: apiUrl,
		    async: false,
		    success: function(response){
			    var results = response['response']['lists']['items'];
                for (var i = 0, result; result = results[i]; i++) {
                    listIds.push(result['id']);
                }
                addTips(listIds, 0);
		    },
		    error: function(response) {
    		    console.log(response.status + " " + response.statusText);
		    }
        });
	    //add pins for each venue within the lists that are within the area
        function addTips(listIds, id){
            if(id < listIds.length){
                var apiUrl = "https://api.foursquare.com/v2/lists/" + listIds[id] + "?llBounds=" + main.bboxLeft + "," + main.bboxTop + "," + main.bboxRight + "," + main.bboxBottom + "&oauth_token=NEPYD2KRGKBZOQ31542XQDDF2KVH5XXMDEKOX4EDWA3ZFVSJ&v=20130314";
                $.ajax({
                    url: apiUrl,
                    async: true,
                    success: function(response){
                        var results = response['response']['list']['listItems']['items'];
                        for (var i = 0, result; result = results[i]; i++) {
                            main.addVenuePin(result['venue']['id'], map);
			                main.listTips.push("<div style='border-bottom:1px solid #000000; margin:0;'>" + "<img style='float:left; margin:0 10px 0 0' src=\"" + result['photo']['prefix'] + "62x62" + result['photo']['suffix'] + "\"/><p style='padding:3px 0 0 0; width:240px; height:60px; overflow:hidden;'><b style='color:" + main.getColor() + "'>" + result['venue']['name'] + "</b><br/>" + result['venue']['categories'][0]['shortName'] + "<br/>" + result['tip']['text'] + "</p></div><div style='height:12px; width:0px; margin:-63px 0 33px 300px; border:10px solid; border-color:" + main.getColor() + " " + main.getColor() + " transparent " + main.getColor() + ";'><p style='margin:-10px 0 0 -7px; line-height:10px; color:#ffffff; font-size:9px; font-weight:bold;'>GQ TIP</p></div>");
                            //$('#wrapper').append(main.listTips[id]);
			            }
                        addTips(listIds, ++id);
                    },
                    error: function(response) {
                        console.log(response.status + " " + response.statusText);
                    }
        	    });
                //addTips(listIds, ++id);
            }else{
                console.log("gqtips ready");
                main.addGooglePins(main.gCoords, main.gMap);
            }
        }
	    /*listIds.forEach( function(listId) {
            console.log(listId);
            var apiUrl = "https://api.foursquare.com/v2/lists/" + listId + "?llBounds=" + main.bboxLeft + "," + main.bboxTop + "," + main.bboxRight + "," + main.bboxBottom + "&oauth_token=NEPYD2KRGKBZOQ31542XQDDF2KVH5XXMDEKOX4EDWA3ZFVSJ&v=20130314";
            $.ajax({
                url: apiUrl,
                async: true,
                success: function(response){
                    var results = response['response']['list']['listItems']['items'];
                    for (var i = 0, result; result = results[i]; i++) {
					    main.addVenuePin(result['venue']['id'], map);
					    main.listTips[i] = "<div style='border-bottom:1px solid #000000; margin:0;'>" + "<img style='float:left; margin:0 10px 0 0' src=\"" + result['photo']['prefix'] + "62x62" + result['photo']['suffix'] + "\"/><p style='padding:3px 0 0 0; width:240px; height:58px; overflow:hidden;'><b style='color:" + main.getColor() + "'>" + result['venue']['name'] + "</b><br/>" + result['venue']['categories'][0]['shortName'] + "<br/>" + result['tip']['text'] + "</p></div><div style='height:12px; width:0px; margin:-63px 0 33px 300px; border:10px solid; border-color:" + main.getColor() + " " + main.getColor() + " transparent " + main.getColor() + ";'><p style='margin:-10px 0 0 -7px; line-height:10px; color:#ffffff; font-size:9px; font-weight:bold;'>GQ TIP</p></div>";
                        //$('#wrapper').append(main.listTips[i]);
				    }
                },
                error: function(response) {
                    console.log(response.status + " " + response.statusText);
                }
        	});
	    });*/
    },
    getColor:function(){
        return '#f8941d';
    },
    addVenuePin: function(venueId, map){
        var apiUrl = "https://api.foursquare.com/v2/venues/" + venueId + "?oauth_token=NEPYD2KRGKBZOQ31542XQDDF2KVH5XXMDEKOX4EDWA3ZFVSJ&v=20130314";
        $.ajax({
        	url: apiUrl,
            async: true,
            success: function(response){
                var result = response['response']['venue'];
                var theseCoords = new google.maps.LatLng(result['location']['lat'], result['location']['lng']);
                var marker = new google.maps.Marker({
                    map: map,
                    position: theseCoords,
                    animation: google.maps.Animation.DROP,
                    icon:'http://cache.celtra.com/api/blobs/cc3d27d55d7128048560b4b7fafb883c5e49e2512bceeaca7dfbcc02dbab6c05/pinshop.png',
                    title: result['name']
                });
            },
            error: function(response) {
                console.log(response.status + " " + response.statusText);
            }
    	});
    },
    listVenue:[],
    getVenueInfo: function(venueId, results, id){
        var apiUrl = "https://api.foursquare.com/v2/venues/" + venueId + "?oauth_token=NEPYD2KRGKBZOQ31542XQDDF2KVH5XXMDEKOX4EDWA3ZFVSJ&v=20130314";
        var result;
        $.ajax({
            url: apiUrl,
            async: true,
            success: function(response){
                result = response['response']['venue'];
                main.listVenue.push("<div style='border-bottom:1px solid #000000; margin:0;'>" + "<img style='float:left; margin:0 10px 0 0' src=\"" + result['photos']['groups'][0]['items'][0]['prefix'] + '62x62' + result['photos']['groups'][0]['items'][0]['suffix'] + "\"/><p style='padding:3px 0 0 0; height:60px; overflow:hidden;'><b>" + result['name'] + "</b><br/>" + result['categories'][0]['shortName'] + "<br/>" + result['tips']['groups'][0]['items'][0]['text'] + "</p></div>");
                //$('#wrapper').append();
                main.addTrendingVenue(results, ++id);
            },
            error: function(response) {
                console.log(response.status + " " + response.statusText);
            }
    	});
    },
    addTrendingPins:function(coords, map){
        var apiUrl = "https://api.foursquare.com/v2/venues/trending" + "?ll=" + main.thisLat + "," + main.thisLng + "&limit=5&oauth_token=NEPYD2KRGKBZOQ31542XQDDF2KVH5XXMDEKOX4EDWA3ZFVSJ&v=20130314";
        $.ajax({
            url: apiUrl,
            async: true,
            success: function(response){
                var results = response['response']['venues'];
                main.addTrendingVenue(results, 0);
                /*for (var i = 0, result; result = results[i]; i++) {
                    var theseCoords = new google.maps.LatLng(result['location']['lat'], result['location']['lng']);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: theseCoords,
                        animation: google.maps.Animation.DROP,
                        icon:'http://cache.celtra.com/api/blobs/e8d1892740a6a4980a4060a67ac1d378a67832f63100c9049f211289ea24df72/pingray.png',
                        title: result['name']
                    });
                    main.getVenueInfo(result['id']);
                    //$('#wrapper').append("<div style='border-bottom:1px solid #000000; margin:0;'>" + "<img style='float:left; margin:0 10px 0 0' src=\"" + main.getVenueInfo(result['id']).photo + "\"/><p style='padding:3px 0 0 0'><b>" + result['name'] + "</b><br/>" + result['categories'][0]['shortName'] + "<br/>" + 'Woot Woot!' + "</p></div>");
                }*/
            },
            error: function(response) {
                console.log(response.status + " " + response.statusText);
            }
        });
    },
    addTrendingVenue:function(results, id){
        if(id<results.length){
            var result = results[id];
            var theseCoords = new google.maps.LatLng(result['location']['lat'], result['location']['lng']);
            var marker = new google.maps.Marker({
                map: main.gMap,
                position: theseCoords,
                animation: google.maps.Animation.DROP,
                icon:'http://cache.celtra.com/api/blobs/e8d1892740a6a4980a4060a67ac1d378a67832f63100c9049f211289ea24df72/pingray.png',
                title: result['name']
            });
            main.getVenueInfo(result['id'], results, id);
        }else{
            main.reArrangeList();
        }
    },
    listZipcar:[],
    addGooglePins:function(coords, map){
        var apiUrl = "https://api.foursquare.com/v2/venues/search" + "?ll=" + main.thisLat + "," + main.thisLng + "&query=zipcar&radius=500&limit=3&oauth_token=NEPYD2KRGKBZOQ31542XQDDF2KVH5XXMDEKOX4EDWA3ZFVSJ&v=20130314";
        $.ajax({
            url: apiUrl,
            async: true,
            success: function(response){
                var results = response['response']['venues'];
                for (var i = 0, result; result = results[i]; i++) {
                    var theseCoords = new google.maps.LatLng(result['location']['lat'], result['location']['lng']);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: theseCoords,
                        animation: google.maps.Animation.DROP,
                        icon:'http://cache.celtra.com/api/blobs/de0134e875107e0a4d53a014c48df7fae025af1979915915ee13fb4a08971258/pinzip.png',
                        title: result['name']
                    });
                    main.listZipcar[i] = "<div class='zipcar"+i+"' style='color:#e0fea4; border-bottom:1px solid #000000; margin:0; background:url(http://cache.celtra.com/api/blobs/f38adf681e6d53ee25cd4954a8dc6c2ea1dfe18b7f9d0171498676da22818f87/bg-sponsor2.png);'>" + "<img style='float:left; margin:0 10px 0 0' src=\"http://cache.celtra.com/api/blobs/205c6e86932998537cb25c80905223a5a4bd0c372dc4c70682cc3c00b48d12d2/car.jpg\"/><p style='padding:3px 0 0 0; font-size:12px; height:60px; overflow:hidden;'><b style='color:#ffffff; font-size:14px;'>" + result['name'] + " " + result['location']['address'] + "</b><br/>" + 'Travel & Transport, Rental Car Location' + "</p></div>";
                    //$('#wrapper').append(main.listZipcar[i]);
                }
                console.log('zipcar ready');
               // main.reArrangeList();
               main.addTrendingPins(main.gCoords, main.gMap);
            },
            error: function(response) {
                console.log(response.status + " " + response.statusText);
            }
    	});
    },
    btn0:unit.find('btn0').node,
    btn1:unit.find('btn1').node,
    btn2:unit.find('btn2').node,
    reArrangeList: function(){
        //var i;
        var i=0;
        var j=0;
        var k=0;
        for(i=0; i<main.listTips.length; i++){
            $('#wrapper').append(main.listTips[i]);
            if(i%2 == 1) $('#wrapper').append(main.listZipcar[j++]);
        }
        console.log(j);
        for(j; j<main.listZipcar.length; j++){
            $('#wrapper').append(main.listZipcar[j]);
        }
        for(k; k<main.listVenue.length; k++){
            $('#wrapper').append(main.listVenue[k]);
        }
        var t = new TimelineLite({onComplete:function(){
            var c;
            var i=0;
            //main.myBTN.style.cssText = 'position:relative; width:320px; height:63px; margin:-63px 0 0 0;';
            //attach(main.myBTN, 'tap', function(){window.open().location = 'http://zipcar.com'});
            for(i; i<main.listZipcar.length; i++){
                unit.find('btn'+i).node.style.cssText = 'position:relative; width:320px; height:63px; margin:-63px 0 0 0; opacity:0;';
                attach(unit.find('btn'+i).node, 'tap', function(){unit.goToURLAction(ctx, {url:'http://zipcar.com', reportLabel:'exit_zipcar'}, c);});
                $('.zipcar'+i).append(unit.find('btn'+i).node);
            }
            //$('.zipcar-0').append(main.myBTN);
            //$('.zipcar-1').append(main.myBTN);
            //$('.zipcar').append(main.myBTN);
            //$('#wrapper').bind('click', function(){ console.log('exit'); window.open().location = "http://zipcar.com"; });
        }});
        t.staggerFrom($('#wrapper div'), 1, {opacity:"0"}, 0.1);
        
        //TweenLite.from($('#wrapper div'), 1, {opacity:0});
        //TweenLite.to(test, 1, {opacity:0});
        //console.log(main.listTips);
        //main.addTrendingPins(main.gCoords, main.gMap);
    },
    thisLat:0,
    thisLng:0,
    bboxTop:0,
    bboxLeft:0,
    bboxRight:0,
    bboxBottom:0,
    getCoordsFromZip:function(zipcode){
        var apiUrl = "http://maps.google.com/maps/api/geocode/json?components=postal_code:" + zipcode + "&sensor=false";
	    /*var thisLat = 0;
	    var thisLng = 0;
	    var bboxTop = 0;
	    var bboxLeft = 0;
	    var bboxRight = 0;
	    var bboxBottom = 0;*/

        $.ajax({                
		    url: apiUrl,   
		    async: false,     
	   }).done(function ( data ) {               
		    main.bboxRight = data['results'][0]['geometry']['viewport']['northeast']['lat']; 
		    main.bboxTop = data['results'][0]['geometry']['viewport']['northeast']['lng']; 
		    main.bboxLeft = data['results'][0]['geometry']['viewport']['southwest']['lat']; 
		    main.bboxBottom = data['results'][0]['geometry']['viewport']['southwest']['lng']; 
		    main.thisLat = data['results'][0]['geometry']['location']['lat'];
            main.thisLng = data['results'][0]['geometry']['location']['lng'];
	    });
	    //$.cookie('bboxLeft', bboxLeft);
	    //$.cookie('bboxTop', bboxTop);
	    //$.cookie('bboxRight', bboxRight);
	    //$.cookie('bboxBottom', bboxBottom);
	    return new google.maps.LatLng(main.thisLat, main.thisLng);
    },
    show:function(){
        this.bg.showAction(ctx);
        this.go.showAction(ctx);
    },
    hide:function(){
        this.bg.hideAction(ctx);
        //this.go.hideAction(ctx);
    },
    loader:function(libs, id){
        if(id<libs.length){
            loadJS(libs[id], function(){main.loader(libs, ++id);});
        }else{
            main.init();
        }
    }
}
main.load();
c();
