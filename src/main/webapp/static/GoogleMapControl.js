
var map = undefined;
var marker = null;
var geocoder = null;
var infowindow = null;
var addressReturn;
var latlngReturn;

var saveWidget;

var lat;
var lng;
// Người dùng thay đổi vị trí bản đồ
var isMakerDrag = false;



//Khởi tạo
google.maps.event.addDomListener(window, 'load', initialize);



function initialize() {
    try {
        infowindow = new google.maps.InfoWindow();
        var mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapDiv = document.getElementById('map-canvas');

        map = new google.maps.Map(mapDiv, mapOptions);

        // Try HTML5 geolocation
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);

                var pos2 = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude + 0.01);
                infowindow = new google.maps.InfoWindow({
                    map: map,
                    position: pos2,
                    content: 'Ban dang o day.'
                });

                marker = new google.maps.Marker({
                    map: map,
                    position: pos,
                    draggable: true
                });

                // Opens the InfoWindow when marker is clicked.
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });

                map.setCenter(pos);

                /*
                var input = (document.getElementById('pac-input'));
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
                */
                var addNewServiceForm = /** @type {HTMLInputElement} */(
                    document.getElementById('addNewService'));
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(addNewServiceForm);

                /*
                var addressInput = (document.getElementById('street'));
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(addressInput);


                var cityInput =(document.getElementById('city'));
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(cityInput);
                */


                var widgetDiv = document.getElementById('save-widget');
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(widgetDiv);

                geocoder = new google.maps.Geocoder();
                getAddress();

                google.maps.event.addListener(map, 'click', function (event) {
                    placeMarker(event.latLng);
                });
                google.maps.event.addListener(marker, 'dragstart', function () {
                    if (infowindow != null)
                        infowindow.close();
                });
                google.maps.event.addListener(marker, 'dragend', function () {
                    getAddress(true);
                });
                /*
                for (var i = 0; i < 5; i++) {
                    var pos3 = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude + 0.004*i);
                    var marker = new google.maps.Marker({
                        position: pos3,
                        map: map
                    });

                    marker.setTitle((i + 1).toString());
                    attachSecretMessage(marker, i);
                }
                */

            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }



        // We add a DOM event here to show an alert if the DIV containing the
        // map is clicked. Note that we do this within the intialize function
        // since the document object isn't loaded until after the window.load
        // event.
        //google.maps.event.addDomListener(mapDiv, 'click', showAlert);

    } catch (ex) {
    }

    var postions = [48.891304999999996,2.352986699999974,
                    48.89488502433846,2.3427486419677734,
                    48.89031408713753,2.3507308959960938,
                    48.88912896112609,2.353992462158203,
                    48.89020121920382,2.347683906555176,
                    48.89457466528419,2.3502588272094727,
                    48.89488502433846,2.3427486419677734];

    for (idx = 0; idx < postions.length; idx = idx + 2) {
        var servicePos = new google.maps.LatLng(postions[idx], postions[idx+1]);
        var service = new google.maps.InfoWindow({
            map: map,
            position: servicePos,
            content: 'Service ' + idx
        });
    }


}
function showAlert() {
    window.alert('DIV clicked');
}


// The five markers show a secret message when clicked
// but that message is not within the marker's instance data
function attachSecretMessage(marker, num) {
    var message = ['This', 'is', 'the', 'secret', 'message'];
    var infowindow = new google.maps.InfoWindow({
        content: message[num]
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(marker.get('map'), marker);
    });
}


function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

function initializeAddress(lat, lng, address) {
    try {
        if (lat != "0" && lng != "0") {
            infowindow = new google.maps.InfoWindow();
            var myOptions = {
                zoom: 14,
                center: new google.maps.LatLng(lat, lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
            if (lat == "" || lng == "" || lat == null || lng == null) {
                lat = 21.0295818;
                lng = 105.8504133;
            }
            var myLatlng = new google.maps.LatLng(lat, lng);
            marker = new google.maps.Marker({
                map: map,
                position: myLatlng,
                draggable: true
            });
            map.setCenter(myLatlng);
            google.maps.event.addListener(map, 'click', function (event) {
                placeMarker(event.latLng);
            });
            google.maps.event.addListener(marker, 'dragstart', function () {
                if (infowindow != null)
                    infowindow.close();
            });
            google.maps.event.addListener(marker, 'dragend', getAddress);
            /*bds*/
            var bdstrananh = new google.maps.Marker({
                icon: {
                    path: 'M -3,0 0,-3 3,0 0,3 z',
                    strokeColor: "#cec9c1",
                    scale: 3
                },
                map: map,
                position: new google.maps.LatLng(10.871692, 106.535366)
            });
            google.maps.event.addListener(map, 'zoom_changed', function () {
                var zoom = map.getZoom();
                if (zoom <= 17) {
                    if (zoom == 15) bdstrananh.setMap(map);
                    else bdstrananh.setMap(null);
                } else {
                    bdstrananh.setMap(map);
                }
            });
            var contentString = '<style>a{text-decoration: none; color: blue}</style><div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<strong id="firstHeading" class="firstHeading">Công ty bất động sản Trần Anh</strong>' +
                '<div id="bodyContent">' +
                'phan văn hớn quận 12, 58a cầu Lớn, Xuân Thới Thượng, Hóc Môn, Ho Chi Minh City, Vietnam' +
                '<p><a href="http://datnengiatot.net" target="_blank" rel="nofollow">datnengiatot.net</a></p>' +
                '<p><a href="https://plus.google.com/111846113810994069762/about?socpid=238&socfid=maps_api_v3:smartmapsiw">more info</a></p>' +
                '</div>' +
                '</div>';
            var infowindowbdstrananh = new google.maps.InfoWindow({
                content: contentString
            });
            google.maps.event.addListener(bdstrananh, 'click', function () {
                if (infowindowbdstrananh != null)
                    infowindowbdstrananh.open(map, bdstrananh);
            });
            /*end bds*/
            geocoder = new google.maps.Geocoder();
            showAdd(address);
        } else {
            $("#map_canvas").css('display', 'none');
        }
    } catch (ex) {
        console.log(ex);
    }
}
//Add maker
function placeMarker(location) {
    try {
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true
        });
        google.maps.event.addListener(marker, 'dragstart', function () {
            if (infowindow != null)
                infowindow.close();
        });
        google.maps.event.addListener(marker, 'dragend', getAddress);
        map.setCenter(location);
        getAddress();
    } catch (ex) {
        console.log(ex);
    }
}
function showProjectLocation(lat, lng, name) {
    marker.setMap(null);
    map.setCenter(new google.maps.LatLng(lat, lng));
    document.getElementById('txtPositionX').value = lat;
    document.getElementById('txtPositionY').value = lng;
    marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lng),
        draggable: true
    });
    if (lat != '' && lng != '' && lat != 0 && lng != 0) {
        geocoder.geocode({ 'latLng': new google.maps.LatLng(lat, lng) }, function (results2, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results2 != null && results2[0] != null) {
                    addressReturn = results2[0].formatted_address;
                    if (infowindow != null) {
                        infowindow.setContent("<span id='address'><b>Địa chỉ : </b>" + name + "</span>");
                        infowindow.open(map, marker);
                    }
                }
            } else {
//alert("Geocoder failed due to: " + status);
            }
        });
    }
    else {
        showLocation(name);
    }
    google.maps.event.addListener(marker, 'dragstart', function () {
        if (infowindow != null)
            infowindow.close();
    });
    google.maps.event.addListener(marker, 'dragend', getAddress);
}

function ShowLocation() {
    var address = "";
    var cityCode = $('#city').val();
    var street = $('#street').val();

    address = street + ", ";

    if (cityCode != '' && cityCode != 0) {
        address = address + $('#city').children('option:selected').text() + ", ";
    }
    address = address + "France";
//initialize($('#hdfLatitude').val(), $('#hdfLongitude').val());
    var mySplitResult = strLatLng().split(",");
    $("#hddLatitude").val(mySplitResult[0]);
    $("#hddLongtitude").val(mySplitResult[1]);
    showLocation(address);
    $('#mapinfo').show();
}

function showLocation(address) {
    if (address != null && address != '') {
        var add = address.split(',');
        if (add.length >= 3) {
            if ($.trim(add[add.length - 3]).toLowerCase() == "thanh xuân") {
                add[add.length - 3] = "Thanh Xuân Bắc";
            }
        }
        address = add.join(',');
        address = address.replace('Tp.HCM', bds_lang.GoogleMaps.TpHCM);
        if (marker != null) marker.setMap(null);
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var lat = '';
                var lng = '';
                if (address.indexOf("Trường Sa") >= 0) {
                    lat = 9.482959063037656;
                    lng = 115.33383353124998;
                    addressReturn = address;
                } else {
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    addressReturn = results[0].formatted_address;
                }
                var latlng = new google.maps.LatLng(lat, lng);
                map.setCenter(results[0].geometry.location);
                marker = new google.maps.Marker({
                    map: map,
                    position: latlng,
                    draggable: true
                });
                document.getElementById('txtPositionX').value = lat;
                document.getElementById('txtPositionY').value = lng;

                if (infowindow != null) {
                    infowindow.setContent("<span id='address'><b>" + bds_lang.GoogleMaps.Address + " : </b>" + address + "</span>");
                    infowindow.open(map, marker);
                }
            } else {
//alert("Geocode was not successful for the following reason: " + status);
                if (address.indexOf(',') > 0) {
                    var add = address.substring(address.indexOf(',') + 1);
                    showLocation(add);
                }
            }
            google.maps.event.addListener(marker, 'dragstart', function () {
                if (infowindow != null)
                    infowindow.close();
            });
            google.maps.event.addListener(marker, 'dragend', function () {
                getAddress(true);
            });
        });
// ThanhDT Remove Marker drag status
        isMakerDrag = false;
    } else {
        alert(bds_lang.GoogleMaps.AddressIncorrect);
    }
}
function getAddress(makerDrag) {
    try {
        var point = marker.getPosition();

        var lat = point.lat();
        var lng = point.lng();
        document.getElementById('txtPositionX').value = lat;
        document.getElementById('txtPositionY').value = lng;
        var latlng = new google.maps.LatLng(lat, lng);
        //console.log(lat + "," + lng);
        geocoder.geocode({ 'latLng': latlng }, function (results2, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results2 != null && results2[0] != null) {
                    addressReturn = results2[0].formatted_address;
                    if (infowindow != null) {
                        infowindow.setContent("<span id='address'><b>" + bds_lang.GoogleMaps.Address + " : </b>" + results2[0].formatted_address + "</span>");
                        infowindow.open(map, marker);
                    }
                }
            } else {
//alert("Geocoder failed due to: " + status);
            }
        });
        map.setCenter(point);
// ThanhDT add for marker drag
        if (typeof (makerDrag) != 'undefined') {
            isMakerDrag = makerDrag;
        }
    } catch (ex) {
        console.log(ex);
    }
}
function showAdd(address) {
    try {
        var point = marker.getPosition();
//alert(point);
        var lat = point.lat();
        var lng = point.lng();
        document.getElementById('txtPositionX').value = lat;
        document.getElementById('txtPositionY').value = lng;
        var latlng = new google.maps.LatLng(lat, lng);
//alert(latlng);
        geocoder.geocode({ 'latLng': latlng }, function (results2, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results2[0]) {
                    if (infowindow != null) {
                        if (address != '') {
                            infowindow.setContent("<span id='address'><b>" + bds_lang.GoogleMaps.Address + " : </b>" + address + "</span>");
                        } else {
                            infowindow.setContent("<span id='address'><b>" + bds_lang.GoogleMaps.Address + " : </b>" + results2[0].formatted_address + "</span>");
                        }
                        infowindow.open(map, marker);
                    }
                    addressReturn = results2[0].formatted_address;
                }
            }
            else {
//alert("Geocoder failed due to: " + status);
            }
        });
        map.setCenter(point);
    } catch (ex) {
        console.log(ex);
    }
}
//Lấy địa chỉ
function strAddress() {
    return addressReturn;
}
// Lấy kinh độ, vĩ độ
function strLatLng() {
    try {
        var lat = $('#txtPositionX').val();
        var lng = $('#txtPositionY').val();

        return lat + "," + lng;
    } catch (ex) {
        console.log(ex);
    }
}
