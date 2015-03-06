function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

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
    colour        = '#bb9066',
    mousedown     = false,
    width_slider  = document.getElementsByClassName("width_slider")[0],
    undo_btn      = document.getElementsByClassName("undo-btn")[0],
    redo_btn      = document.getElementsByClassName("redo-btn")[0],
    width         = width_slider.value,
    volume_estimator = document.getElementsByClassName("volume_estimate")[0],
    pixels_per_cm = window.devicePixelRatio ? 50 * window.devicePixelRatio : 50,
    ocean         = Ocean(),
    intersections = [];

function resize_drawing_board () {
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
    paths.forEach( function (p) {
        p.draw_intersections();
    });
}

function update_volume(vol) {
    volume_estimator.innerHTML = vol.toFixed(1);
}

var window_resize_timeout = setTimeout(resize_drawing_board, 50);

$(window).resize(function(){
    clearTimeout(window_resize_timeout);
    window_resize_timeout = setTimeout(resize_drawing_board, 10);
});

function Path (x, y, colour, width) {
    var start_x = x,
        start_y = y,
        points = [new Vector(x, y)],
        pathString = 'M' + x + ' ' + y + 'l0 0',
        intersections = [],
        lastX = x,
        lastY = y,
        update_data_timeout = null,
        path;

    this.colour = colour;
    this.width = width;

    function clear_intersections () {
        if (intersections.length > 0) {
            intersections.forEach( function (i) {i.remove();});
            intersections.length = 0;
        }
    }

    this.add_to_paper = function () {
        path = paper.path(pathString);
        path.attr({
            'stroke': this.colour,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': this.width
        });
        intersections.forEach(function (i){
            //draw_intersections();
            i.add_to_paper();
        });
        /*for (var i = 0; i< intersections.length;++i) {
            this.draw_intersections();
            intersections.add_to_paper();
        }*/
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
        intersections.forEach( function (i) { i.remove();});
    };

    this.update_data = function () {
        update_volume(
            Path.get_path_volume(points)
        );
        // path.intersections = ocean.intersection_volume(this);
        // inters.forEach(function(co) {
        //   intersections.push(paper.circle(co.x, co.y, 3).attr({stroke: 'black', fill: 'yellow'}));
        // });
    };

    this.extend = function (x, y) {
        if (update_data_timeout !== null) {
            clearTimeout(update_data_timeout);
        }
        points.push(new Vector(x,y));
        this.extend_svg(x,y);
        update_data_timeout = setTimeout(this.update_data, 1);
    };

    this.extend_svg = function(x,y) {
        pathString += 'l' + (x - lastX) + ' ' + (y - lastY);
        path.attr('path', pathString);
        lastX = x;
        lastY = y;
    };

    function order_points_with_top_first (points) {
        var min_y_idx = 0;
        for (var i=1; i < points.length;++i) {
            if (points[i].y < points[min_y_idx]) {
                min_y_idx = i;
            }
        }
        return points.slice(min_y_idx) + points.slice(0, min_y_idx);
    }

    this.close_path = function () {
        this.extend_svg(start_x, start_y);
        // points = order_points_with_top_first(points);
    };

    this.add_to_paper();
}
function Intersection(points) {
    var lastX = points[0].x,
        lastY = points[1].y;
    console.log("path length: " + points.length );

    this.pathString = 'M' + lastX + ' ' + lastY + 'l0 0';
    var n = points.length;
    for (var i = 1; i <= points.length;i++) {
        this.pathString += 'l' + (points[i%n].x - lastX)  + ' ' + (points[i%n].y - lastY) + '';
        lastX = points[i%n].x;
        lastY = points[i%n].y;
    }
    this.pathString += "z";
    var circles = [];
    this.points = points;

    var path;

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
        path.remove();
        circles.forEach( function (c) {c.remove();});
    }

    this.add_to_paper();
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

    function abovdedness(point) {
        return point.y <= sealevel;
    }

    for (var i = 0; i < n; ++i) {
        var j = (i+1)%n;
        augmented_points.push(points[i]);
        if (abovdedness(points[i]) !== abovdedness(points[j])) {
            var new_point = get_intersection_point(points[i], points[j], sealevel);
            assert(new_point !== null, "LOL WTF");
            augmented_points.push(new_point);
        }
    }
    console.log(augmented_points);
    n = augmented_points.length;
    var clusters = [[]];

    for (var i = 0; i < n; ++i) {
        var j = (i+1)%n;
        if (!abovdedness(augmented_points[i])) {
            clusters[clusters.length-1].push(augmented_points[i]);
        }
        if (abovdedness(augmented_points[i]) !== abovdedness(augmented_points[j])) {
            clusters.push([]);
        }
    }

    if (clusters.length > 1 && clusters[clusters.length-1].length > 0) {
        clusters[0] = clusters[clusters.length-1] + clusters[0];
        clusters.pop();
    }
    
    var non_empty_clusters = [];
    clusters.forEach(function(cluster) {
        if (cluster.length > 0)
            non_empty_clusters.push(cluster);
    });

    console.log(non_empty_clusters);

    return non_empty_clusters;
    /*if (points[0].y >= sealevel) {
        return [points];
    }
    var intersects = [];

    var inside = false;

    var active_set = null,
        inter_point;

    for (var i = 0; i < points.length-1; i++) {
        if (points[i].y >= sealevel) {
            if (active_set !== null) {
                active_set.push(points[i]);
            } else {
                inter_point = get_intersection_point(
                    points[((i-1) + points.length) % points.length],
                    points[i],
                    sealevel
                );
                if (inter_point !== null) {
                    active_set = [inter_point, points[i]];
                } else {
                    active_set = [points[i]];
                }
            }
        } else {
            if (active_set !== null) {
                inter_point = get_intersection_point(
                    points[((i-1) + points.length) % points.length],
                    points[i],
                    sealevel
                );
                if (inter_point !== null)
                    active_set.push(inter_point);
                intersects.push(active_set);
                active_set = null;
            }
        }
    }
    if (inside) {
        inter_point = get_intersection_point(
            points[points.length-1],
            points[0],
            sealevel
        );
        if (active_set !== null) {
            active_set.push(inter_point);
            intersects.push(active_set);
        } else {
            intersects[intersects.length - 1].push(inter_point);
        }
    } else {
        if (active_set !== null) {
            intersects.push(active_set);
        }
    }*/
    return intersects;
};

Path.get_path_volume = function (points) {
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

    this.plus = function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };
}

Vector.triangle_size = function (A, B) {
    return B.x * A.y - A.x * B.y;
};

var current_path = null,
    paths = [],
    redo_list = [];

$(canvas).mousedown(function (e) {
    mousedown = true;
    var x = e.offsetX,
        y = e.offsetY;
    current_path = new Path(x, y, colour, width);
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
    mousedown = false;
});

width_slider.addEventListener('change', function (e) {
    width = this.value;
});

function undo_last_path () {
    if (paths.length > 0) {
        var last_path = paths.pop();
        if (paths.length === 0) {
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

$('#canvascolours [data-colour]').each(function () {
    var $this = $(this),
        divColour = $this.css('background-color');

    // // Change the background colour of the box
    // $this.css('background-color', divColour);

    // Add the event listener
    $this.click(function () {
        colour = divColour;
    });
});
