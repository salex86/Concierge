ons.ready(function () {
    var map;
    var highAccuracy = ons.platform.isIOS();
    document.addEventListener("show", function (event) {
        var page = event.target;      

        if (event.target.id == 'mapPage') {            
            window.mapType = page.data.mapType;
            $("#map-title").html(page.data.title);        
            //initList();
        } else if (event.target.id == 'detailPage') {
            initDetail(page.data.entityId);
        } else if (event.target.id == 'conciergePage') {
            initConList(page.data.entityId);
        } else if (event.target.id == 'conciergeHome') {
            //initConList(page.data.entityId);
            localStorage.setItem('conciergeId', page.data.entityId);
            $("#entityHomeTitle").html(page.data.title);
            $("#conciergeText").html(page.data.text);
            if (page.data.image != null) {
                $("#conciergeHomeImage").html(page.data.image);
            }
            //var image = ""

            if (page.data.image == "" || page.data.image == null) {
                image = "img/ImageNotAvailable.jpg";
            } else {
                image = page.data.image;
            }
            $("#conciergeCard").css("background", "linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%),url(" + image + ") no-repeat center center #eae7de");
            $("#conciergeCard").css("background-repeat", "no-repeat");
            $("#conciergeCard").css("background-size", "100% 100%");
            $("#conciergeCard").css("background-position", "top center");
        } else if (event.target.id == 'entityHome') {
            //initConList(page.data.entityId);
            
        }
    });

    function initConList(title) {
        if ($("#mapConRadio").is(':checked') === true) {
            $("#listConRadio").prop('checked', true);
            fn.showConList();
        }

        $("#entityConList").html("<ons-list-header>Concierge Desks</ons-list-header>");
       
        $("#mapConTitle").html(title);
        navigator.geolocation.getCurrentPosition(function (position) {
            $("#entityProgress").show();
            $.ajax({
                url: 'http://stage.theclaymoreproject.com/api/partner/1238?action=concierge_search',
                type: 'post',
                dataType: 'json',
                crossOrigin: true,
                data: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    distance: $("#mapRange").val()
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', make_base_auth("jamesk", "hendrie"));
                },
                success: function (data) {   
                    var count = 0;
                    $("#entityProgress").hide();
                    $.each(data, function (i, obj) {
                        if (obj.concierge_is_public == 1) {
                            var iconURL = "img/map-icons/unlocked-desk-30w.png";
                            var linkOnClick = "fn.loadConciergeHome('conciergeHome.html'," + obj.id + ", '" + obj.entity_name + "', '"+obj.profile_image_url+"', '"+obj.concierge_text+"')";
                            var text = "Enter";
                        } else {
                            var iconURL = "img/map-icons/locked-desk-30w.png";
                            var linkOnClick = 'fn.showConLogin(' + obj.id + ')';
                            var text = "Log in";
                        }

                        //set profile image
                        var image = ""
                        if (obj.profile_image_url == "" || obj.profile_image_url == null) {
                            image = "img/ImageNotAvailable.jpg";
                        } else {
                            image = obj.profile_image_url;
                        }

                        var onsItem = document.createElement('ons-list-item');
                        //onsItem.setAttribute('modifier', "chevron");
                        onsItem.setAttribute('tappable', "");
                        onsItem.setAttribute('onclick', linkOnClick);
                        onsItem.innerHTML = '<div class="left" style="width:130px"><img src="' + image + '" class="avator"></img></div><div class="right" style="width:35px"><img src="' + iconURL + '" class=""></img></div><div vertical-align="top"><div class="name">' + obj.entity_name
                            + '</div><span class="list__item__subtitle"><div class="location">' + obj.town + ', ' + obj.county + ' </div></br><i class="fa fa-map-marker"></i> ' + Math.round(obj.distance * 100) / 100 + ' miles</div>';
                        document.getElementById('entityConList').appendChild(onsItem);
                        //addCustomMarker(obj.id, page.data.mapType, obj.entity_name, obj.latitude, obj.longitude);
                    });
                    //ons.compile(onsList)
                },
                error: function (data) {


                }
            });
        }, onGPSError, { maximumAge: 10000, timeout: 10000, enableHighAccuracy: highAccuracy });
    }

    function initList(title,color) {
        if ($("#mapRadio").is(':checked') === true) {
            $("#listRadio").prop('checked', true);
            fn.showList();
        }
        
        $("#entity_list").html("<ons-list-header>"+title+" - Recommendations</ons-list-header>");
        $("#mapRange").val(25);
        $("#distanceDiv").html('25 miles');
        $("#map-title").html(title);
       
        
        var entityId = localStorage.getItem('conciergeId');
        navigator.geolocation.getCurrentPosition(function (position) {
            $(".listNav").addClass("navigation-bar-" + color + "");
            $("#entityProgress").show();
            
            $.ajax({
                url: 'http://stage.theclaymoreproject.com/api/partner/' + entityId + '?action=app_search',
                type: 'post',
                dataType: 'json',
                crossOrigin: true,
                data: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    distance: $("#mapRange").val(),
                    type: 1,
                    entityType: window.mapType
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', make_base_auth("scotlands19thhole", "3ctbb4512"));
                },
                success: function (data) {
                    var count = 0;
                    $("#entityProgress").hide();
                    $.each(data, function (i, obj) {
                        //set profile image
                        var image = ""
                        if (obj.profile_image_url == "" || obj.profile_image_url == null) {
                            image = "img/ImageNotAvailable.jpg";
                        } else {
                            image = obj.profile_image_url;
                        }

                        var onsItem = document.createElement('ons-list-item');
                        onsItem.setAttribute('modifier', "chevron");
                        onsItem.setAttribute('tappable', "");
                        onsItem.setAttribute('onclick', "fn.loadDetail('entity.html'," + obj.id + ")");
                        onsItem.innerHTML = '<div class="left" style="width:130px"><img src="' + image + '" class="avator"></img></div><div class="right" style="width:30px">T</div><div vertical-align="top"><div class="name">' + obj.entity_name
                            + '</div><span class="list__item__subtitle"><div class="location">' + obj.address3 + ',' + obj.town + '</div></br><i class="fa fa-map-marker"></i> ' + Math.round(obj.distance * 100) / 100 + ' miles</div>';
                        document.getElementById('entity_list').appendChild(onsItem);
                        //addCustomMarker(obj.id, page.data.mapType, obj.entity_name, obj.latitude, obj.longitude);
                        $("#locationCount").html(i + 1);
                        $("#offerCount").html("0");
                    });
                    //ons.compile(onsList)
                },
                error: function (data) {


                }
            });
        }, onGPSError, { maximumAge: 10000, timeout: 10000, enableHighAccuracy: highAccuracy });
    }

    function initMap(position) {    
        //var control = document.getElementById('floating-panel');
        //control.style.display = 'block';
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

        //var onChangeHandler = function () {
        //    calculateAndDisplayRoute(directionsService, directionsDisplay);
        //};
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
    }

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var start = document.getElementById('start').value;
        var end = document.getElementById('end').value;
        
    }

    function initDetail(entityId) {
        $.ajax(
            {
                url: 'http://stage.theclaymoreproject.com/api/entities/'+entityId,
                type: 'get',
                dataType: 'json',
                crossOrigin: true,
                data: { region: "" },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', make_base_auth("scotlands19thhole", "3ctbb4512"));
                },
                success: function (data) {
                    //layout changes tablet
                    if (ons.platform.isIPad() || ons.platform.isAndroidTablet()) {
                        var shortText = data.entity_name;
                        var headerText = data.entity_name + ', ' + data.town.replace(/^,|,$/g, '');
                    } else {
                        var shortText = truncate(data.entity_name);
                        var headerText = truncate(data.entity_name);
                    }

                    // $("#detailCard").css("background-image", "url(" + data.profile_image_url + ") no-repeat");
                    //var item = document.getElementById('detailName');
                    $('#moreDetail').show();

                    $("#detail-title").html(headerText);

                    $("#detailName").text(shortText);
                    $("#detailTop").html(data.address + ' ' + data.address2 + '<br>' + data.address3);

                    $("#detailDesc").html(data.first_paragraph + "</br>" + data.business_overview);

                    $("#directionsIcon").click(function () {

                        var geocoords = parseFloat(data.latitude) + ',' + parseFloat(data.longitude);

                        if (ons.platform.isIOS()) {
                            window.open('maps://?q=' + geocoords, '_system');
                        }
                        else {
                            var label = encodeURI(data.entity_name); // encode the label!
                            window.open('geo:0,0?q=' + geocoords + '(' + label + ')', '_system');
                        }

                    });

                    $("#phoneIcon").click(function () {
                        window.open('tel:' + data.telephone.replace(" ", ""), '_self', "location=yes");
                    });
                    $("#websiteIcon").click(function () {
                        window.open('http://' + data.url, '_system', "location=yes");
                    });

                    if (data.booking_url == null || data.booking_url == "") {
                        $("#bookingDiv").hide();
                    } else {
                        $("#bookingIcon").click(function () {
                            window.open(data.booking_url, '_system', "location=yes");
                        });
                    }

                    $("#emailIcon").click(function () {
                        window.open('mailto:' + data.email, '_system');
                    });

                    var image = ""
                    if (data.profile_image_url == "" || data.profile_image_url == null) {
                        image = "img/no-image-available.png";
                    } else {
                        image = data.profile_image_url;
                    }

                    // social media stuff
                    if (data.facebook == null || data.facebook == "") {
                        $("#facebookIcon").hide();
                    } else {
                        $("#facebookIcon").show();
                        $("#facebookIcon").click(function () {
                            window.open(data.facebook, '_system', "location=yes");
                        });
                    }
                    if (data.twitter == null || data.twitter == "") {
                        $("#twitterIcon").hide();
                    } else {
                        $("#twitterIcon").show();
                        $("#twitterIcon").click(function () {
                            window.open(data.twitter, '_system', "location=yes");
                        });
                    }
                    if (data.linkedin == null || data.linkedin == "") {
                        $("#linkedinIcon").hide();
                    } else {
                        $("#linkedinIcon").show();
                        $("#linkedinIcon").click(function () {
                            window.open(data.linkedin, '_system', "location=yes");
                        });
                    }
                    if (data.googleplus == null || data.googleplus == "") {
                        $("#googleplusIcon").hide();
                    } else {
                        $("#googleplusIcon").show();
                        $("#googleplusIcon").click(function () {
                            window.open(data.googleplus, '_system', "location=yes");
                        });
                    }
                    if (data.blogger == null || data.blogger == "") {
                        $("#bloggerIcon").hide();
                    } else {
                        $("#bloggerIcon").show();
                        $("#bloggerIcon").click(function () {
                            window.open(data.blogger, '_system', "location=yes");
                        });
                    }
                    if (data.youtube == null || data.youtube == "") {
                        $("#youtubeIcon").hide();
                    } else {
                        $("#youtubeIcon").show();
                        $("#youtubeIcon").click(function () {
                            window.open(data.youtube, '_system', "location=yes");
                        });
                    }
                    if (data.pintrest == null || data.pintrest == "") {
                        $("#pintrestIcon").hide();
                    } else {
                        $("#pintrestIcon").show();
                        $("#pintrestIcon").click(function () {
                            window.open(data.pintrest, '_system', "location=yes");
                        });
                    }
                    if (data.tripadvisor == null || data.tripadvisor == "") {
                        $("#tripadvisorIcon").hide();
                    } else {
                        $("#tripadvisorIcon").show();
                        $("#tripadvisorIcon").click(function () {
                            window.open(data.tripadvisor, '_system', "location=yes");
                        });
                    }
                    //

                    $("#detailCard").css("background", "linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%),url(" + image + ") no-repeat center center #eae7de");
                    $("#detailCard").css("background-repeat", "no-repeat");
                    $("#detailCard").css("background-size", "100% 85%");
                    $("#detailCard").css("background-position", "bottom center");
                    //linear-gradient(to bottom, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%),
                    //url(...);
                    ///background: linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, #000000 100%),
                    //url("http://us.123rf.com/400wm/400/400/adroach/adroach1210/adroach121000001/15602757-flower-and-bird-ornaments-retro-tile-repeat-as-many-times-as-you-like.jpg") repeat;
                    //item.innerHTML = data.entity_name;
                    //ons.compile(onsList);
                },
                error: function (data) {

                }
            });
    }

   

    function addConCustomMarker(obj) {
        if (obj.concierge_is_public == 1) {
            var iconURL = "img/map-icons/unlocked-desk-40w.png";
            var linkOnClick = "fn.loadConciergeHome('conciergeHome.html'," + obj.id + ", '" + obj.entity_name + "', '" + obj.profile_image_url + "','" + obj.concierge_text + "')";
            var text = "Enter";
        } else {
            var iconURL = "img/map-icons/locked-desk-40w.png";
            var linkOnClick = 'fn.showConLogin(' + obj.id + ')';
            var text = "Log in";
        }        

        var loc = new google.maps.LatLng(obj.latitude, obj.longitude);
       
        var marker = new google.maps.Marker({
            position: loc,
            icon: iconURL,
            zIndex: 2
        });        

        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<div style="font-size:20px"><b>'+obj.entity_name + '</b></br><ons-button onclick="'+linkOnClick+'" > '+text+' </ons-button>');
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        return marker;
        //marker.setMap(map);//Where map is a google.maps.Map already defined
    }

    function addCustomMarker(id, mapType, iconTitle, lat, lng) {
        if (mapType == 1) {
            iconURL = 'images/map-icons/48x48/play.png';
        }
        if (mapType == 2) {
            iconURL = 'images/map-icons/48x48/stay.png';
        }
        if (mapType == 3) {
            iconURL = 'images/map-icons/48x48/eat.png';
        }
        if (mapType == 4) {
            iconURL = 'images/map-icons/48x48/drink.png';
        }
        if (mapType == 5) {
            iconURL = 'images/map-icons/48x48/enjoy.png';
        }
        if (mapType == 6) {
            iconURL = 'images/map-icons/48x48/travel.png';
        }

        var loc = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: loc,
            icon: iconURL,
            zIndex: 2
        });

        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<div style="font-size:17px"><b>'+iconTitle + '</b></br><ons-icon onclick="fn.loadDetail(\'entity.html\',' + id + ')" icon="ion-search"> View </ons-icon></br><ons-icon onclick="fn.directions(' + lat + ',' + lng + ')" icon="ion-search">Directions</ons-icon>');
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        return marker;
        //marker.setMap(map);//Where map is a google.maps.Map already defined
    }
        
    function make_base_auth(user, password) {
        var tok = user + ':' + password;
        var hash = btoa(tok);
        return 'Basic ' + hash;
    }
    // set up loads functions for menu

    function onGPSError(error) {
        if (ons.platform.isIOS()) {
            ons.notification.alert('Unable to locate: Please turn on location services in Privacy Settings');
        } else {
            ons.notification.alert('Unable to geo locate: Please enable GPS on your device');
        }        

        //alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }

    window.fn = {};

    window.fn.showConLogin = function (id) {

        ons.notification.prompt({ message: 'Enter Password ?' }).then(function (answer) {
            $.ajax({
                url: 'http://stage.theclaymoreproject.com/api/partner/'+id+'?action=concierge_login',
                type: 'post',
                dataType: 'json',
                crossOrigin: true,
                data: {
                    password: answer
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', make_base_auth("jamesk", "hendrie"));
                },
                success: function (data) {
                    if (data == null) {
                        //login unsuccessfull
                       

                    } else {
                        //login successfull
                        fn.load('conciergeHome.html');
                    }
                },
                error: function (data) {


                }
            });
        });

    }

    window.fn.open = function () {
        var menu = document.getElementById('menu');
        menu.open();
    };
    window.fn.close = function () {
        var menu = document.getElementById('menu');
        menu.close();
    };
    window.fn.showPopover = function (target) {
        document
      .getElementById('popover')
      .show(target);
    };

    window.fn.showVal = function (target) {
        $("#rangeView").html(target + " Miles");
    };

    window.fn.hidePopover = function () {
        document
          .getElementById('popover')
          .hide();
    };

    window.fn.showList = function () {
        $("#mapDiv").hide();
        $("#listDiv").animate({ width: 'toggle' }, 350);
    };

    window.fn.showMap = function () {
        $("#listDiv").hide();
        $("#mapDiv").show();
        var entityId = localStorage.getItem('conciergeId');
        navigator.geolocation.getCurrentPosition(function (position) {
            // do_something(position.coords.latitude, position.coords.longitude);
            map = new google.maps.Map(document.getElementById('map'), { center: { lat: position.coords.latitude, lng: position.coords.longitude }, zoom: 11 });

            google.maps.event.addListenerOnce(map, 'idle', function () {
                $.ajax({
                    url: 'http://stage.theclaymoreproject.com/api/partner/'+entityId+'?action=app_search',
                    type: 'post',
                    dataType: 'json',
                    crossOrigin: true,
                    data: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        distance: $("#mapRange").val(),
                        type: 1,
                        entityType: window.mapType
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', make_base_auth("scotlands19thhole", "3ctbb4512"));
                    },
                    success: function (data) {
                        var markers = [];

                        $.each(data, function (i, obj) {                            
                            markers.push(addCustomMarker(obj.id, window.mapType, obj.entity_name, obj.latitude, obj.longitude));                            
                        });
                        var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'images/m' });
                    },
                    error: function (data) {


                    }
                });
            });
        }, onGPSError, { maximumAge: 10000, timeout: 10000, enableHighAccuracy: highAccuracy });
    };

    window.fn.showConList = function () {
        $("#mapConDiv").hide();
        $("#listConDiv").animate({ width: 'toggle' }, 350);
    };

    window.fn.showConMap = function () {
        $("#listConDiv").hide();
        $("#mapConDiv").show();
        navigator.geolocation.getCurrentPosition(function (position) {
            // do_something(position.coords.latitude, position.coords.longitude);
            map = new google.maps.Map(document.getElementById('mapCon'), { center: { lat: position.coords.latitude, lng: position.coords.longitude }, zoom: 11 });

            google.maps.event.addListenerOnce(map, 'idle', function () {
                $.ajax({
                    url: 'http://stage.theclaymoreproject.com/api/partner/1238?action=concierge_search',
                    type: 'post',
                    dataType: 'json',
                    crossOrigin: true,
                    data: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        distance: $("#mapRange").val()
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', make_base_auth("jamesk", "hendrie"));
                    },
                    success: function (data) {
                        var markers = [];

                        $.each(data, function (i, obj) {
                            markers.push(addConCustomMarker(obj));
                        });
                        var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'images/m' });
                    },
                    error: function (data) {


                    }
                });
            });
        }, onGPSError, { maximumAge: 10000, timeout: 10000, enableHighAccuracy: highAccuracy });
    };

    window.fn.directions = function (lat, lng) {   
        fn.load('directions.html');
        //fn.showDialog('dialog-1');
        navigator.geolocation.getCurrentPosition(function (position) {
            $("#directions-panel").empty();
            //$("#directions-panel").show();
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var directionsService = new google.maps.DirectionsService;
            // do_something(position.coords.latitude, position.coords.longitude);
            //map = new google.maps.Map(document.getElementById('map'), { center: { lat: position.coords.latitude, lng: position.coords.longitude }, zoom: 6 });

           // directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('directions-panel'));

            directionsService.route({
                origin: { lat: position.coords.latitude, lng: position.coords.longitude },
                destination: { lat: lat, lng: lng },
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }, onGPSError, { maximumAge: 10000, timeout: 10000, enableHighAccuracy: highAccuracy });
    };
    window.fn.setConDistance = function (target) {
        initConList(72);
    }
    window.fn.setDistance = function (target) {
        fn.hidePopover();

        navigator.geolocation.getCurrentPosition(function (position) {
            // do_something(position.coords.latitude, position.coords.longitude);
            $("#entity_list").html("<ons-list-header>Found Locations</ons-list-header>");
            $("#entityProgress").show();
                $.ajax({
                    url: 'http://stage.theclaymoreproject.com/api/partner/1238?action=concierge_search',
                    type: 'post',
                    dataType: 'json',
                    crossOrigin: true,
                    data: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        distance: $("#mapRange").val(),
                        type: 1,
                        entityType: window.mapType
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', make_base_auth("scotlands19thhole", "3ctbb4512"));
                    },
                    success: function (data) {
                        var count = 0;                        
                        $("#entityProgress").hide();
                        $.each(data, function (i, obj) {
                            //set profile image
                            var image = ""
                            if (obj.profile_image_url == "" || obj.profile_image_url == null) {
                                image = "img/ImageNotAvailable.jpg";
                            } else {
                                image = obj.profile_image_url;
                            }

                            var onsItem = document.createElement('ons-list-item');
                            onsItem.setAttribute('modifier', "chevron");
                            onsItem.setAttribute('tappable', "");
                            onsItem.setAttribute('onclick', "fn.loadDetail('entity.html'," + obj.id + ")");
                            onsItem.innerHTML = '<div class="left" style="width:130px"><img src="' + image + '" class="avator"></img></div><div class="right" style="width:30px">T</div><div vertical-align="top" ><div class="name">' + obj.entity_name
                            + '</div><span class="list__item__subtitle"><div class="location">' + obj.address + ',' + obj.town + '</div> </br><i class="fa fa-map-marker"></i> ' + Math.round(obj.distance * 100) / 100 + ' miles</div>';
                            document.getElementById('entity_list').appendChild(onsItem);
                            //addCustomMarker(obj.id, window.mapType, obj.entity_name, obj.latitude, obj.longitude);
                            $("#locationCount").html(i + 1);
                            $("#offerCount").html("0");
                            $("#distanceDiv").html($("#mapRange").val() + ' miles');
                        });
                        //ons.compile(onsList)
                    },
                    error: function (data) {

                    }
                });
        });
    };

    window.fn.load = function (page) {
        //var content = document.getElementById('content');
        var menu = document.getElementById('menu');
        var navi = document.getElementById('navi');
        menu.close();
        navi.bringPageTop(page, {
            animation: 'slide',
            data: { mapType: '1' }
        });
    };

    window.fn.loadConciergeHome = function (page, entityId, title,image,text) {
        //var content = document.getElementById('content');
        var menu = document.getElementById('menu');
        var navi = document.getElementById('navi');

        menu.close();
        navi.pushPage(page, {
            animation: 'slide',
            data: {
                entityId: entityId,
                title: title,
                image: image,
                text: text
            }
        });

        //content.load(page)
        //  .then(menu.close.bind(menu));        
    };
    
    window.fn.loadDetail = function (page, entityId) {
        //var content = document.getElementById('content');
        var menu = document.getElementById('menu');
        var navi = document.getElementById('navi');

        menu.close();
        navi.pushPage(page, {
            animation: 'lift',
            data: { entityId: entityId }
        });

        //content.load(page)
        //  .then(menu.close.bind(menu));        
    };

    window.fn.loadmap = function (page,mapType) {
        //var content = document.getElementById('content');
        var menu = document.getElementById('menu');
        var navi = document.getElementById('navi');
        var title = "";
        var color;
        if (mapType == 1) {
            title = 'Accomodation';
            color = "red";
        }
        if (mapType == 2) {
            title = 'Attractions';
            color = "orange";
        }
        if (mapType == 3) {
            title = 'Activities';
            color = "yellow";
        }
        if (mapType == 4) {
            title = 'Retail';
            color = "green";
        }
        if (mapType == 5) {
            title = 'Travel & Transport';
            color = "blue";
        }
        if (mapType == 6) {
            title = 'Food & Drink';
            color = "indigo";
        }
        if (mapType == 7) {
            title = 'Events & Entertainment';
            color = "violet";
        }
            
        window.mapType = mapType;
        menu.close();
        navi.bringPageTop(page, {
            animation: 'slide',
            data: {
                mapType: mapType,
                title: title
            }
        }).then(initList(title,color));
      
    };

    window.fn.showDialog = function (id) {
        document
          .getElementById(id)
          .show();
    };

   window.fn.hideDialog = function (id) {
        document
          .getElementById(id)
          .hide();
    };
});