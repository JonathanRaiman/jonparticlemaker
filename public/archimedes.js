
function Rectangle (x, y, w, h) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this.pathString = "";
    this.create_path();

    this.x = function (_) {
        if (arguments.length === 0) {
            return this._x;
        } else {
            this._x = _;
            return this;
        }
    };
    this.width = function (_) {
        if (arguments.length === 0) {
            return this._w;
        } else {
            this._w = _;
            return this;
        }
    };
    this.y = function (_) {
        if (arguments.length === 0) {
            return this._y;
        } else {
            this._y = _;
            return this;
        }
    };
    this.height = function (_) {
        if (arguments.length === 0) {
            return this._h;
        } else {
            this._h = _;
            return this;
        }
    };

}

Rectangle.prototype.intersection_volume = function (path) {
    return Raphael.pathIntersection(this.pathString, path.pathString);
};

Rectangle.prototype.create_path = function () {
    this.pathString = Raphael.fullfill("M{this.obj._x},{this.obj._y}h{this.obj._w}v{this.obj._h}h{neg_w}z",
        {
            obj: this,
            neg_w: -this._w
        }
    );
    this.path = paper.path(this.pathString);
};

Rectangle.prototype.attr = function (_) {
    if (arguments.length === 0) {
        return this.path.attr();
    } else {
        this.path.attr(_);
        return this;
    }
};

Rectangle.prototype.draw = function () {
    this.pathString = Raphael.fullfill("M{this.obj._x},{this.obj._y}h{this.obj._w}v{this.obj._h}h{neg_w}z",
        {
            obj: this,
            neg_w: -this._w
        }
    );
    this.path.attr("path", this.pathString);
};

function draw_ocean() {
    var oc = new Rectangle(0, 100, 300, 200);
    oc.attr({
        fill: "270-#fff-#1480f9:1-#284885:7-#162c64:95",
        stroke: false
    });
    return oc;
}

var canvas = document.getElementById('canvas'),
    paper = new Raphael(canvas, 300, 300),
    colour = '#bb9066',
    mousedown = false,
    width_slider = document.getElementsByClassName("width_slider")[0],
    undo_btn = document.getElementsByClassName("undo-btn")[0],
    redo_btn = document.getElementsByClassName("redo-btn")[0],
    width = width_slider.value,
    volume_estimator = document.getElementsByClassName("volume_estimate")[0],
    lastX, lastY, path = null, pathString, paths = [], redo_list = [],
    pixels_per_cm = window.devicePixelRatio ? 50 * window.devicePixelRatio : 50,
    ocean = draw_ocean(),
    intersections = [];

function resize_drawing_board () {
    paper.setSize(
        Math.min(1000,
            $(window).width() * (11.0/12.0)
        ),
        Math.min(
            1000,
            $(window).height() * 0.9
        )
    );
    console.log(ocean);
    ocean.width(Math.min(1000,
            $(window).width() * (11.0/12.0)
    ));
    ocean.y(Math.min(
            1000,
            $(window).height() * 0.9
        ) - ocean.height());
    ocean.draw();
}

function update_volume(vol) {
    volume_estimator.innerHTML = vol;
}

var window_resize_timeout = setTimeout(resize_drawing_board, 50);

$(window).resize(function(){
    clearTimeout(window_resize_timeout);
    window_resize_timeout = setTimeout(resize_drawing_board, 10);
});

function Path (x, y, colour, width) {
    this.start_x = x;
    this.start_y = y;
    this.points = [new Vector(x, y)];
    this.pathString = 'M' + x + ' ' + y + 'l0 0';
    this.colour = colour;
    this.width = width;
    this.add_to_paper();
    this.lastX = x;
    this.lastY = y;
    this.update_data_timeout = null;
}

Path.prototype.add_to_paper = function () {
    this.path = paper.path(this.pathString);
    this.path.attr({
        'stroke': this.colour,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': this.width
    });
};

Path.prototype._extend = function (x, y) {
    this.pathString += 'l' + (x - this.lastX) + ' ' + (y - this.lastY);
    this.path.attr('path', this.pathString);
};
Path.prototype.remove = function () {
    this.path.remove();
};
Path.prototype.extend = function (x, y) {
    if (this.update_data_timeout !== null) {
        clearTimeout(this.update_data_timeout);
    }
    this.points.push(new Vector(x,y));
    this._extend(x, y);
    this.lastX = x;
    this.lastY = y;
    this.update_data_timeout = setTimeout(this.update_data.bind(this), 1);
};

function Vector (x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.minus = function (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
};
Vector.prototype.plus = function (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
};

Vector.triangle_size = function (A, B) {
    return B.x * A.y - A.x * B.y;
};

Path.prototype.update_data = function () {
    var points = this.points;
    var first_point = points[0];
    var volume = 0.0;
    for (var i = 2; i < points.length;i++) {
        var A = points[i-1].minus(first_point);
        var B = points[i].minus(first_point);
        volume += Vector.triangle_size(A, B);
    }
    update_volume(Math.abs(volume) / (pixels_per_cm * pixels_per_cm));

    var inters = ocean.intersection_volume(this);



    inters.forEach(function(co) {
      intersections.push(paper.circle(co.x, co.y, 3).attr({stroke: 'black', fill: 'yellow'}));
    });
};
Path.prototype.close_path = function () {
    this._extend(this.start_x, this.start_y);
};

$(canvas).mousedown(function (e) {
    mousedown = true;
    var x = e.offsetX,
        y = e.offsetY;
    path = new Path(x, y, colour, width);
    undo_btn.disabled = false;
});

$(document).mouseup(function () {
    if (path !== null) {
        path.close_path();
        paths.push(path);
        path = null;
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

    path.extend(x, y);
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
