var os = require('os');
var ifaces = os.networkInterfaces();
var ip = {};

ip.getIpAddresses = function() {
    var addresses = [];
    //http://stackoverflow.com/a/8440736

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            var address = {};

            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            address.address = iface.address;
            address.interface = ifname;
            address.alias = alias;

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                //console.log(ifname + ':' + alias, iface.address);
                address.description = ifname + ':' + alias + ' ' + iface.address;
            } else {
                // this interface has only one ipv4 adress)
                //console.log(ifname, iface.address);
                address.description = ifname + ' ' + iface.address;
            }

            alias++;

            addresses.push(address);
        });
    });

    return addresses;
};

module.exports = ip;