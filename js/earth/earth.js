var planet = planetaryjs.planet();
    planet.loadPlugin(planetaryjs.plugins.earth({
      topojson: { file: '/js/earth/world-110m.json' },
      oceans:   { fill:   'transparent' },
      land:     { fill:   '#05a8f3' },
      borders:  { stroke: '#03cbfe' }
    }));

    // Load our custom autorotate plugin
    planet.loadPlugin(autorotate(10));

    // Load the `pings` plugin to draw animated pings on the globe
    planet.loadPlugin(planetaryjs.plugins.pings({
      color: '#ffffff', ttl: 1200, angle: 10
    }));

    var colors = ["red", "yellow", "white", "orange", "green", "cyan", "pink"];
    setInterval(function() {
      planet.plugins.pings.add(129.07524, 35.17995, { //부산
        color: "yellow",
        angle: 1
      });
      planet.plugins.pings.add(126.70520, 37.45600, { //인천
        color: "yellow",
        ttl: 1000,
        angle: 1
      });
      planet.plugins.pings.add(120.47573, 22.68022, { //광양
        color: "yellow",
        angle: 2
      });
      planet.plugins.pings.add(129.31191, 35.53917, { //울산
        color: "yellow",
        angle: 1
      });
      planet.plugins.pings.add(121.48905, 31.22530, { //상하이
        color: "white",
        angle: 2
      });
      planet.plugins.pings.add(114.16281, 22.27933, { //홍콩
        color: "white",
        angle: 1
      });

      planet.plugins.pings.add(103.97640, 10.13606, { //롱비치
        color: "white",
        angle: 2
      });
      planet.plugins.pings.add(-74.00602, 40.71273, { //뉴욕
        color: "white",
        angle: 1
      });
      planet.plugins.pings.add(-118.24277, 34.05369, { //LA
        color: "white",
        angle: 1
      });
      planet.plugins.pings.add(-95.36770, 29.75894, { //휴스턴
        color: "white",
        angle: 2
      });

      planet.plugins.pings.add(10.00065, 53.55034, { //함부르크
        color: "white",
        angle: 1
      });
      planet.plugins.pings.add(10.34264, 43.47545, { //로테르담
        color: "white",
        angle: 2
      });

      planet.plugins.pings.add(144.96316, -37.81422, { //멜버른
        color: "white",
        angle: 2
      });
      planet.plugins.pings.add(151.21645, -33.85482, { //시드니
        color: "white",
        angle: 1
      });

      planet.plugins.pings.add(130.21299, 32.85621, { //고베
        color: "white",
        angle: 2
      });
      planet.plugins.pings.add(135.49559, 34.70219, { //오사카
        color: "white",
        angle: 1
      });
      planet.plugins.pings.add(139.76558, 35.68210, { //도쿄
        color: "white",
        angle: 2
      });

      planet.plugins.pings.add(56.27814, 27.17935, { //반다르아바스
        color: "white",
        angle: 2
      });
      planet.plugins.pings.add(28.96516, 41.00963, { //이스탄불
        color: "white",
        angle: 2
      });
      planet.plugins.pings.add(135.47587, 34.69443, { //제다
        color: "white",
        angle: 1
      });

      planet.plugins.pings.add(4.83914, 6.28481, { 
        color: "white",
        angle: 2
      });
      planet.plugins.pings.add(316.62683, -2.76319, { 
        color: "white",
        angle: 2
      });

      planet.plugins.pings.add(221.50116, 5.65959, { 
        color: "white",
        angle: 1
      });

      planet.plugins.pings.add(160.29340, 47.28624, { 
        color: "white",
        angle: 2
      });
    }, 1000);

    // Make the planet fit well in its canvas
    planet.projection.scale(400).translate([400, 400]);
    var canvas = document.getElementById('globe');
    planet.draw(canvas);

    // Helper function to add one ping on the globe
    function showLocation(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      // Add a ping on the globe every second
      setInterval(function() {
        planet.plugins.pings.add(longitude, latitude);
      }, 1000);
    }

    // This plugin will automatically rotate the globe around its vertical
    // axis a configured number of degrees every second.
    function autorotate(degPerSec) {
      // Planetary.js plugins are functions that take a `planet` instance
      // as an argument...
      return function(planet) {
        var lastTick = null;
        var paused = false;
        planet.plugins.autorotate = {
          pause:  function() { paused = true;  },
          resume: function() { paused = false; }
        };
        // ...and configure hooks into certain pieces of its lifecycle.
        planet.onDraw(function() {
          if (paused || !lastTick) {
            lastTick = new Date();
          } else {
            var now = new Date();
            var delta = now - lastTick;
            // This plugin uses the built-in projection (provided by D3)
            // to rotate the globe each time we draw it.
            var rotation = planet.projection.rotate();
            rotation[0] += degPerSec * delta / 1000;
            if (rotation[0] >= 180) rotation[0] -= 360;
            planet.projection.rotate(rotation);
            lastTick = now;
          }
        });
      };
    };

    