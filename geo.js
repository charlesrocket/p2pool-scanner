var http = require('http')

require('dotenv').config()

function Geo(options) {
    var self = this;

    function request(options, callback)
    {
	http.get(options.host, function(res){
   	 var body = '';

    	res.on('data', function(chunk){
            body += chunk;
    	});

    	res.on('end', function(){
            var response = JSON.parse(body);
            console.log("Got a response: ", response);
 	    callback(null, response);
        });
        }).on('error', function(e){
            console.error("Got an error: ", e);
        });
    }

    function extract_geo(response) {
        var countryString;
	if(response["city"] == "") {
	  countryString = response["country_name"];
	} else {
	  countryString = response["city"] + ", " + response["country_name"];
	}
	var o = {
            country : countryString,
            img : "https://geoiptool.com/static/img/flags/" + response["country_code"].toLowerCase() + ".gif"
        }

        return o;
    }

    self.get = function(ip, callback) {

        // console.log("QUERYING IP:",ip);
        var options = {
            host : 'http://api.ipstack.com/'+ip+'?access_key=' + process.env.API_KEY + '&output=json&legacy=1',
            port : 80,
            method: 'GET'
        }

        request(options, function(err, response) {
            if(err)
                return callback(err);
            var geo = null;
            try {
                var geo = extract_geo(response);
            } catch(ex) {
                console.error(ex);
            }

            return callback(null, geo);

        }, true);
    }

}

module.exports = Geo;
