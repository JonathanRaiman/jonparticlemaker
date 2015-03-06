function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function Material (color, density) {
    this.color = color;
    this.density = density;
}

function MaterialPicker (scope) {
    var buttons = scope,
        material = null;


    function set_all_classes(scope, name) {
        scope.attr("class", name);
    }

    buttons.each(function () {
        var $this = $(this),
        divColour = $this.css('background-color');

        // // Change the background colour of the box
        // $this.css('background-color', divColour);

        // Add the event listener
        $this.click(function () {
            set_all_classes(buttons, "color-btn");
            $this.addClass("active");
            material = new Material(divColour, parseFloat($this.data("density")));
        });
    });

    buttons[3].click();

    this.material = function () {
        return material;
    }
}

var mat_picker = new MaterialPicker($('#canvascolours .color-btn'));

function Rectangle (x, y, w, h) {
    var _x = x,
        _y = y,
        _w = w,
        _h = h,
        pathString = "";
    this.x = function (_) {
        if (arguments.length === 0) {
            return _x;
        } else {
            _x = _;
            return this;
        }
    };
    this.width = function (_) {
        if (arguments.length === 0) {
            return _w;
        } else {
            _w = _;
            return this;
        }
    };
    this.y = function (_) {
        if (arguments.length === 0) {
            return _y;
        } else {
            _y = _;
            return this;
        }
    };
    this.height = function (_) {
        if (arguments.length === 0) {
            return _h;
        } else {
            _h = _;
            return this;
        }
    };
    this.attr = function (_) {
        if (arguments.length === 0) {
            return this.path.attr();
        } else {
            this.path.attr(_);
            return this;
        }
    };
    this.intersection_volume = function (path) {
        return Raphael.pathIntersection(pathString, path.pathString);
    }
    function create_path_string () {
        pathString = Raphael.fullfill("M{x},{y}h{w}v{h}h{neg_w}z",
            {
                x: _x,
                y: _y,
                w: _w,
                h: _h,
                neg_w: -_w
            }
        );
    }

    this.draw = function () {
        create_path_string();
        this.path.attr("path", pathString);
    };

    create_path_string();
    this.path = paper.path(pathString);
}

function Ocean() {
    var oc = new Rectangle(0, 100, 300, 200);
    oc.attr({
        fill: "270-#fff-#1480f9:1-#284885:7-#162c64:95",
        stroke: false
    });
    return oc;
}

var canvas        = document.getElementById('canvas'),
    canvas_parent = canvas.parentNode,
    paper         = new Raphael(canvas, 300, 300),
    mousedown     = false,
    width_slider  = document.getElementsByClassName("width_slider")[0],
    undo_btn      = document.getElementsByClassName("undo-btn")[0],
    redo_btn      = document.getElementsByClassName("redo-btn")[0],
    width         = width_slider.value,
    volume_estimator = document.getElementsByClassName("volume_estimate")[0],
    immersed_volume_estimator = document.getElementsByClassName("volume_submerged")[0],
    energy_estimator = document.getElementsByClassName("total_energy")[0],
    pixels_per_cm = window.devicePixelRatio ? 2 * window.devicePixelRatio : 2,
    ocean         = Ocean(),
    intersections = [],
    FPS_ms                  = 1000.0/60.0,
    FPS_s                   = FPS_ms / 1000.0,
    water_density_g_per_cm3 = 0.99819,
    gravity_m_per_s2        = 9.81,
    gravity_cm_per_s2       = gravity_m_per_s2 * 100.0,
    paused = false,
    water_drag_constant = 0.05;

var window_resize_timeout = setTimeout(resize_drawing_board, 50);

function resize_drawing_board () {
    window_resize_timeout = null;
    paper.setSize(
        Math.min(1000,
            $(canvas_parent).width()
        ),
        Math.min(
            1000,
            $(window).height() * 0.9
        )
    );
    ocean.width(Math.min(1000,
        $(canvas_parent).width()
    ));
    ocean.y(Math.min(
            1000,
            $(window).height() * 0.9
        ) - ocean.height());
    ocean.draw();
    paths.draw_intersections();
}

function update_volume(vol) {
    volume_estimator.innerHTML = vol.toFixed(1);
}

function update_immersed_volume(vol) {
    immersed_volume_estimator.innerHTML = vol.toFixed(1);
}

function update_total_energy(E) {
    energy_estimator.innerHTML = E.toFixed(2);
}

$(window).resize(function(){
    if (window_resize_timeout == null) {
        //clearTimeout(window_resize_timeout);
        window_resize_timeout = setTimeout(resize_drawing_board, FPS_ms);
    }
});

function Paths () {
    var paths = [];

    this.update_physics = function (dt) {
        //var energy = 0.0;
        paths.forEach( function (p) {
            //assert(p.mass_g() > 0, "Object with 0 or negative mass detected. Call CERN. " + p.mass_g());
            p.set_acceleration(
                new Vector(
                    0.0,
                    - gravity_cm_per_s2 * p.effective_mass_g() / p.mass_g() + 
                    (
                        (p.velocity().y > 0 ? -1 : 1) *
                        p.immersed_volume() *
                        p.velocity().squared_norm() *
                        water_drag_constant /
                        p.mass_g()
                    )
                )
            );
            p.update_velocity(dt);
            p.update_position(dt);
            p.draw();
            p.draw_intersections();
            //energy += p.energy();
        });
        //update_total_energy(energy);
    }

    this.push = function (path) {
        paths.push(path);
    }

    this.pop = function () {
        return paths.pop();
    }

    this.length = function () {
        return paths.length;
    }

    this.draw_intersections = function () {
        paths.forEach( function (p) {
            p.draw_intersections();
        });
    }
}

function Path (x, y, colour, width, density_g_per_cm3) {
    var start_x = x,
        start_y = y,
        points = [new Vector(x, y)],
        relative_svg_path = "",
        intersections = [],
        lastX = x,
        lastY = y,
        update_data_timeout = null,
        path,
        acceleration = new Vector(0,0),
        velocity = new Vector(0,0),
        position = points[0],
        volume   = 0.0,
        closed   = false,
        immersed_volume = 0.0,
        position_cm = new Vector(
            position.x / pixels_per_cm,
            (ocean.y() - position.y) / pixels_per_cm
        );

    this.density_g_per_cm3 = density_g_per_cm3;
    this.colour = colour;
    this.width = width;


    function pathString() {
        return ('M' + position.x + ' ' + position.y + 'l0 0') + relative_svg_path;
    }

    function clear_intersections () {
        if (intersections.length > 0) {
            intersections.forEach( function (i) {i.remove();});
            intersections.length = 0;
        }
    }

    this.add_to_paper = function () {
        path = paper.path(pathString());
        path.attr({
            'stroke': this.colour,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': this.width
        });
        if (closed) {
            path.attr({
                'stroke': this.colour,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': this.width,
                fill: this.colour
            });
        } else {
            path.attr({
                'stroke': this.colour,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': this.width
            });
        }
        /*intersections.forEach(function (i){
            i.add_to_paper();
        });*/
    }

    this.draw_intersections = function () {
        clear_intersections();
        var inters = Path.get_intersections(ocean, points);
        if (inters !== null) {
            intersections.length = 0;
            inters.forEach(function (i) { intersections.push( new Intersection(i) );});
        }
    }

    this.remove = function () {
        path.remove();
        acceleration = new Vector(0,0);
        velocity     = new Vector(0,0);
        intersections.forEach( function (i) { i.remove();});
    };

    this.update_data = function () {
        volume = Path.get_path_volume_in_cm(points);
        update_volume(
            volume
        );
    };

    this.set_acceleration = function (new_acceleration) {
        acceleration = new_acceleration;
    }

    this.update_velocity = function (dt) {
        velocity.x += acceleration.x * dt;
        velocity.y += acceleration.y * dt;
    }

    this.update_position = function (dt) {

        position_cm.x += velocity.x * dt;
        position_cm.y += velocity.y * dt;

        points.forEach( function (p) {
            p.x += (velocity.x * pixels_per_cm * dt);
            p.y += (-velocity.y * pixels_per_cm * dt);
        });
    }
    // takes current state and draws it.
    this.draw = function () {
        path.attr('path', pathString());
    }

    this.extend = function (x, y) {
        var norm_change = Math.pow(lastX - x, 2) +  Math.pow(lastY - y, 2);
        if (norm_change < 25) return;

        if (update_data_timeout !== null) {
            clearTimeout(update_data_timeout);
        }
        points.push(new Vector(x,y));
        this.extend_svg(x,y);
        this.draw();
        update_data_timeout = setTimeout(this.update_data, 1);
    };

    this.extend_svg = function(x,y) {
        relative_svg_path += 'l' + (x - lastX) + ' ' + (y - lastY);
        lastX = x;
        lastY = y;
    };

    this.close_path = function () {
        this.extend_svg(start_x, start_y);
        closed = true;
        path.attr({fill: this.colour});
        this.draw();
    };

    this.mass_g = function () {
        return volume * this.density_g_per_cm3;
    };

    this.potential_energy = function () {
        return this.effective_mass_g() * gravity_cm_per_s2 * position_cm.y;
    }

    this.kinetic_energy = function () {
        return 0.5 * this.mass_g() * velocity.squared_norm();
    }

    this.energy = function () {
        return this.potential_energy() + this.kinetic_energy();
    }

    this.immersed_volume = function () {
        return immersed_volume;
    }

    this.velocity = function () {
        return velocity;
    }

    this.effective_mass_g = function () {
        if (intersections.length == 0)
            return this.mass_g();
        immersed_volume = 0.0;
        intersections.forEach( function (i) {
            immersed_volume += i.volume();
        });
        update_immersed_volume(
            immersed_volume
        );
        // effective mass is mass of item - mass of object
        return this.mass_g() - immersed_volume * water_density_g_per_cm3;
    }

    this.add_to_paper();
}

function Intersection(points) {
    var lastX = points[0].x,
        lastY = points[1].y;

    /*
    this.pathString = 'M' + lastX + ' ' + lastY + 'l0 0';
    var n = points.length;
    for (var i = 0; i <= points.length;i++) {
        this.pathString += 'l' + (points[i%n].x - lastX)  + ' ' + (points[i%n].y - lastY) + '';
        lastX = points[i%n].x;
        lastY = points[i%n].y;
    }
    this.pathString += "z";
    */
    
    this.points = points;

    var path = null;
    var circles = [],
        volume = null;

    this.add_to_paper = function () {
        path = paper.path(this.pathString).attr(
            {
                fill: "rgb(25, 40, 150)",
                stroke: "black",
                "stroke-width": 1
            }
        );
        this.points.forEach( function (p) {
            circles.push(
                paper.circle(p.x, p.y, 3).attr({fill:"red", "stroke": "black"})
            );
        });
    }

    this.remove = function () {
        if (path !== null)
            path.remove();
        if (circles.length>0)
            circles.forEach( function (c) {c.remove();});
    }

    this.volume = function () {
        //if (volume == null)
        volume = Path.get_path_volume_in_cm(this.points);
        return volume;
    }

    //this.add_to_paper();
}

function get_intersection_point (p1, p2, y) {
    if (p2.y < y && p1.y < y) {
        return null;
    } else {
        var slope = (p2.y - p1.y) / (p2.x - p1.x);
        var offset = p2.y - (p2.x * slope);
        var desired_x = Math.abs(slope) > 1e-3 ? ((y - offset) / slope) : ((p1.x + p2.x) / 2);
        if (desired_x !== desired_x)
            desired_x = p1.x;
        return new Vector(desired_x, y);
    }
}

Path.get_intersections = function (el, points) {
    var sealevel = el.y();
    var n = points.length;
    var augmented_points = [];

    function above_sealevel(point) {
        return point.y < sealevel;
    }
    for (var i = 0; i < n; ++i) {
        var j = (i+1)%n;
        augmented_points.push(points[i]);
        if (above_sealevel(points[i]) !== above_sealevel(points[j])) {
            var new_point = get_intersection_point(points[i], points[j], sealevel);
            augmented_points.push(new_point);
        }
    }
    n = augmented_points.length;
    var clusters = [[]];

    for (var i = 0; i < n; ++i) {
        var j = (i+1)%n;
        if (!above_sealevel(augmented_points[i])) {
            clusters[clusters.length-1].push(augmented_points[i]);
        }
        if (above_sealevel(augmented_points[i]) !== above_sealevel(augmented_points[j])) {
            clusters.push([]);
        }
    }

    if (clusters.length > 1 && clusters[clusters.length-1].length > 0) {
        clusters[0] = clusters[clusters.length-1].concat(clusters[0]);
        clusters.pop();
    }
    
    var non_empty_clusters = [];
    clusters.forEach(function(cluster) {
        if (cluster.length > 0)
            non_empty_clusters.push(cluster);
    });

    return non_empty_clusters;
};

Path.get_path_volume_in_cm = function (points) {
    var first_point = points[0];
    var volume = 0.0;
    for (var i = 2; i < points.length;i++) {
        var A = points[i-1].minus(first_point);
        var B = points[i].minus(first_point);
        volume += Vector.triangle_size(A, B);
    }
    return Math.abs(volume) / (pixels_per_cm * pixels_per_cm);
};

function Vector (x, y) {
    this.x = x;
    this.y = y;

    this.minus = function (vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    this.squared_norm = function () {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }

    this.plus = function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };
}

Vector.triangle_size = function (A, B) {
    return B.x * A.y - A.x * B.y;
};

var current_path = null,
    paths = new Paths(),
    redo_list = [];

$(canvas).mousedown(function (e) {
    mousedown = true;
    paused    = true;
    var x = e.offsetX,
        y = e.offsetY;
    current_path = new Path(x, y, mat_picker.material().color, width, mat_picker.material().density);
    undo_btn.disabled = false;
});

$(document).mouseup(function () {
    if (current_path !== null) {
        current_path.close_path();
        current_path.update_data();
        current_path.draw_intersections();
        paths.push(current_path);
        current_path = null;
        redo_list.length = 0;
        redo_btn.disabled = true;
    }
    paused    = false;
    mousedown = false;
});

width_slider.addEventListener('change', function (e) {
    width = this.value;
});

function undo_last_path () {
    if (paths.length() > 0) {
        var last_path = paths.pop();
        if (paths.length() === 0) {
            undo_btn.disabled = true;
        }
        last_path.remove();
        redo_list.push(last_path);
        redo_btn.disabled = false;
    }
}

function redo_last_path () {
    if (redo_list.length > 0) {
        var last_path = redo_list.pop();
        if (redo_list.length === 0) {
            redo_btn.disabled = true;
        }
        last_path.add_to_paper();
        paths.push(last_path);
        undo_btn.disabled = false;
    }
}

undo_btn.addEventListener('click',     undo_last_path);
undo_btn.addEventListener('touchdown', undo_last_path);
redo_btn.addEventListener('click',     redo_last_path);
redo_btn.addEventListener('touchdown', redo_last_path);

$(canvas).mousemove(function (e) {
    if (!mousedown) {
        return;
    }
    var x = e.offsetX,
        y = e.offsetY;

    current_path.extend(x, y);
});

// numbers 1 - 9
$(document).keydown(function (e) {
    if (e.keyCode > 48 && e.keyCode < 58) {
        width = 10.0 * (e.keyCode - 48);
        width_slider.value = width;
    }
});


function tick() {
    if (!paused) paths.update_physics(FPS_s);
    setTimeout(tick, FPS_ms);
}

setTimeout(tick, FPS_ms);

